import { Router } from 'express'
import { VerifyUserToken } from '../middlewares/auth'
import { UserStatModel } from '../models/user-stat'
import ApiError from '../utils/api-error'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { filterStatistics, getCompleteUserStats, getCountOfReqPerDay, getCountOfReqPerMonth, getPlatformWiseTotalCount, getLatestInvoiceDetails } from '../utils/handle-stat-details'
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

UserStatRoutes.get('/invoice', ErrorProtectedRoute(async (req: any, resp) => {
    let response:any = {
        invoice: {}
    } 

    let user = req.user
    let dt = new Date()
    if (new Date().getMonth() === 0){
        var invoice = await getLatestInvoiceDetails(user, 11, new Date().getFullYear()-1)
    }else{
        
        var invoice = await getLatestInvoiceDetails(user, new Date().getMonth(), new Date().getFullYear())
    }
    console.log('Invoice', invoice)
    if(invoice !== null){
    //     // TODO: getMonth()-1
        console.log('Inside if statement')
        var pdfData = await getCompleteUserStats(user, new Date().getMonth(), new Date().getFullYear())
        Object.assign(pdfData, {
            name: user.name,
            email: user.email,
            invoiceId: invoice.invoiceDisplayId,
            dueDate: new Date(dt.getFullYear(), dt.getMonth()-1, 7).toDateString(), 
            currDate: new Date(dt.getFullYear(), dt.getMonth()-1, 1).toDateString(),
            subTotal: invoice.billDetails?.totalCount * constants.RATE_PER_REQUEST,
            billedRequests: Math.max(0, invoice?.billDetails?.totalCount - constants.FREE_ALLOWANCE),
            amountPayable: invoice?.amount,
        })
        let pdf = await generatePdf(pdfData)

        var file = fs.createReadStream("./src/pdfstorage/invoice.pdf");
        // response.invoice = pdfData
        file.pipe(resp);

    }else{
        response.invoice = undefined
        resp.send({})
    } 
}))