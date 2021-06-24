import { Router } from 'express'
import { VerifyUserToken } from '../middlewares/auth'
import { UserStatModel } from '../models/user-stat'
import ApiError from '../utils/api-error'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { filterStatistics, getCompleteUserStats, getCountOfReqPerDay, getCountOfReqPerMonth, getPlatformWiseTotalCount, getLatestInvoiceDetails, getCompleteInvoiceObject } from '../utils/handle-stat-details'
import { generatePdf } from '../utils/pdf-generator'
import { ResponseData } from '../utils/response'
import { constants } from '../utils/constants'

export const UserStatRoutes = Router()

UserStatRoutes.use(VerifyUserToken())   //Auth custom middleware

const fs = require("fs");

UserStatRoutes.get('/', ErrorProtectedRoute(async (req: any, resp) => {
    let response: any = {
        all: [],
        google: [],
        apple: [],
        amazon: [],
        packageWise: [],
        monthWise: [],
        dayWise: [],
        amazonCount: 0,
        googleCount: 0,
        appleCount: 0,
        totalCount: 0,
       
    }

    let user = req.user
    let completeUserStatData = await getCompleteUserStats(user, new Date().getMonth(), new Date().getFullYear())
    let userStat = await UserStatModel.findOne({userId:user._id})
    let platforms = ['total', 'google', 'apple', 'amazon']

    for(let i=0; i<12; i++){
        let monthWiseCount = await getCountOfReqPerMonth(userStat, i, new Date().getFullYear())
        response.monthWise.push(monthWiseCount)
    }

    var dt = new Date();
    let noOfDaysThisMonth = new Date(dt.getFullYear(), dt.getMonth()+1, 0).getDate()

    
        for(let platform=0; platform<platforms.length; platform++){
            let countPerPlatform = []
            for(let day=0; day<noOfDaysThisMonth; day++){
                let dayWiseCount = getCountOfReqPerDay(userStat, day+1, dt.getMonth(), dt.getFullYear(), platforms[platform])
                countPerPlatform.push(dayWiseCount)
            }
        response.dayWise.push(countPerPlatform)
    }

    response.all = completeUserStatData.statistics
    response.apple = filterStatistics(completeUserStatData, 'apple', "")
    response.google = filterStatistics(completeUserStatData, 'google', "")
    response.amazon = filterStatistics(completeUserStatData, 'amazon', "")

    response.googleCount = getPlatformWiseTotalCount(response.google)
    response.amazonCount = getPlatformWiseTotalCount(response.amazon)
    response.appleCount = getPlatformWiseTotalCount(response.apple)
    response.totalCount = response.googleCount + response.amazonCount + response.appleCount

    let packageMap = new Map()

    for(let item of completeUserStatData.statistics){        
        if(packageMap.get(item.appId) === undefined){
            packageMap.set(item.appId, 1)
        }
    }

    for(let packageName of packageMap.keys()){
        response.packageWise.push(filterStatistics(completeUserStatData, 'google', packageName)[0])
        response.packageWise.push(filterStatistics(completeUserStatData, 'apple', packageName)[0])
        response.packageWise.push(filterStatistics(completeUserStatData, 'amazon', packageName)[0])
    }
    
    resp.send(new ResponseData(response))
}))

UserStatRoutes.get('/invoice-pdf', ErrorProtectedRoute(async (req: any, resp) => {
    let user = req.user
    let dt = new Date()

    if (new Date().getMonth() === 0)
        var invoice = await getLatestInvoiceDetails(user, 11, new Date().getFullYear()-1)
    else
        var invoice = await getLatestInvoiceDetails(user, new Date().getMonth(), new Date().getFullYear())
    
    if(invoice !== null){
        var pdfData = await getCompleteInvoiceObject(user, invoice)
        let pdf = await generatePdf(pdfData, user)

        var file = fs.createReadStream("./src/pdfstorage/" + user._id + ".pdf");
        file.on('end', ()=>{
            file.destroy()
        })
        file.pipe(resp);

        // setTimeout(()=>{
            fs.unlinkSync("./src/pdfstorage/" + user._id + ".pdf");
        
        // },5000)
        
    }else{
        resp.send({})
    } 
}))

UserStatRoutes.get('/invoice', ErrorProtectedRoute(async (req: any, resp) => {
    let response:any = {
        invoice: null,
        paid: false
    } 

    let user = req.user
    let dt = new Date()

    if (new Date().getMonth() === 0)
        var invoice = await getLatestInvoiceDetails(user, 11, new Date().getFullYear()-1)
    else
        var invoice = await getLatestInvoiceDetails(user, new Date().getMonth(), new Date().getFullYear())

    if(invoice !== null){
        var isPaid = invoice.paid
        var pdfData = await getCompleteInvoiceObject(user, invoice)

        response.invoice = pdfData
        response.paid = isPaid

        resp.send(new ResponseData(response))
    }else{
        resp.send(new ResponseData(response))
    } 
}))