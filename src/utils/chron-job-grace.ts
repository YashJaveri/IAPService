//Run every 7th day of the month
//Disable if bill not paid and notify
import {CronJob} from 'cron'
import { TransactionModel } from '../models/transcation';
import { UserModel } from '../models/user';
import { getBillDetail } from './get-bill-details';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';

export const job = new CronJob('0 0 8 * *', async function() {
    
    let users = await UserModel.find({})
    for(let i = 0; i<users.length; i++){
        let transactions = await TransactionModel.find( { userId: users[i]._id })
        let billDetails = await getBillDetail(users[i]._id, new Date().getMonth()-1, new Date().getFullYear())  //FIX "-1"
        
        if(billDetails.amountPayable === 0){
            continue
        }
        else{
            if(transactions === undefined || (transactions && transactions.length === 0)){
                let pdf = generatePdf(billDetails)
                sendMail(pdf, users[i].email, "", "")   //add content
                users[i].disabled = true
                await users[i].save()
            }else{
                let d = new Date()
                d.setDate(d.getDate() - 7)
                let t = transactions.find(item => new Date(item.forBillDate).toDateString() === d.toDateString())
                
                if(!t){
                    let pdf = generatePdf(billDetails)
                    sendMail(pdf, users[i].email, "", "")   //add content
                    users[i].disabled = true
                    await users[i].save()
                }
            }
        }
    }
}, null, true, 'Asia/Kolkata');