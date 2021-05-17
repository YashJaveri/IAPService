//Run every 7th day of the month
//Disable if bill not paid and notify
import {CronJob} from 'cron'
import { TransactionModel } from '../models/transcation';
import { UserModel } from '../models/user';
import { getBillDetail } from './get-bill-details';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';


export const jobGrace = new CronJob('* * * * *', async function() { //Change to normal after testing is done
    
    let users = await UserModel.find({})
    
    for(let i = 0; i<users.length; i++){
        let transactions = await TransactionModel.find( { userId: users[i]._id })
        
        if(new Date().getMonth() === 0)
            var billDetails = await getBillDetail(users[i], 11, new Date().getFullYear()-1)
        else
            var billDetails = await getBillDetail(users[i], new Date().getMonth()-1, new Date().getFullYear())

        
        if(billDetails.amountPayable === 0){
         
            continue
        }
        else{
            if(transactions === undefined || (transactions && transactions.length === 0)){
                
                Object.assign(billDetails, {
                    name: users[i].name,
                    email: users[i].email,
                    rate: 0.3,
                    dueDate: null, //past due
                    currDate: new Date().toDateString(),
                    subTotal: Math.round(((billDetails.totalCount-50)*RATE) * 100) / 100 
                })

                let pdf = await generatePdf(billDetails)
                sendMail(pdf, users[i].email, "", "")   //add content
                users[i].disabled = true
                await users[i].save()
            }else{
                
                let d = new Date()
                d.setDate(d.getDate() - 7)
                let t = transactions.find(item => new Date(item.forBillDate).toDateString() === d.toDateString())
               
                //after this point user is disabled
                if(!t){

                    Object.assign(billDetails, {
                        name: users[i].name,
                        email: users[i].email,
                        rate: 0.3,
                        dueDate: null,
                        currDate: new Date().toDateString(),
                        subTotal: Math.round(((billDetails.totalCount-50)*RATE) * 100) / 100 
                    })

                    let pdf = await generatePdf(billDetails)
                    sendMail(pdf, users[i].email, "", "")   //add content
                    users[i].disabled = true
                    await users[i].save()
                }
            }
        }
    }
}, null, true, 'Asia/Kolkata');