//Run every month end
//Send Billing as per (Total request - 50)
import {CronJob} from 'cron'
import { UserModel } from '../models/user';
import { getBillDetail } from './get-bill-details';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';

const RATE = 0.3

export const jobBill = new CronJob('* * * * *', async function() { //Change to normal after testing is done

    let users = await UserModel.find({})
    for(let i = 0; i<users.length; i++){
        if(new Date().getMonth() === 0)
            var billDetails = await getBillDetail(users[i], 11, new Date().getFullYear()-1)
        else
            var billDetails = await getBillDetail(users[i], new Date().getMonth()-1, new Date().getFullYear())
        
        /*console.log("Billlll: " + JSON.stringify(billDetails))*/
        Object.assign(billDetails, {
            name: users[i].name,
            email: users[i].email,
            rate: RATE,
            // dueDate: new Date(new Date().getDate() + 7).toDateString(), //faulty
            dueDate: new Date((new Date().getDate()+7)).toDateString(), //TODO: date logic needs to be changed
            currDate: new Date().toDateString(),
            subTotal: Math.round(((billDetails.totalCount-50)*RATE) * 100) / 100 
        })
        
        let pdf = generatePdf(billDetails)
        sendMail(pdf, users[i].email, "", "")   //Add content
    }
}, null, true, 'Asia/Kolkata');
