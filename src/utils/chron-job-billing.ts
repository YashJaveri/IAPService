//Run every month end
//Send Billing as per (Total request - 50)
import {CronJob} from 'cron'
import { UserModel } from '../models/user';
import { getBillDetail } from './get-bill-details';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';

export const jobBill = new CronJob('* * * * *', async function() { //Change to normal after testing is done

    let users = await UserModel.find({})
    for(let i = 0; i<users.length; i++){
        if(new Date().getMonth() === 0)
            var billDetails = await getBillDetail(users[i], 11, new Date().getFullYear()-1)
        else
            var billDetails = await getBillDetail(users[i], new Date().getMonth()-1, new Date().getFullYear())
        
        /*console.log("Billlll: " + JSON.stringify(billDetails))*/
        let pdf = generatePdf(billDetails)
        sendMail(pdf, users[i].email, "", "")   //Add content
    }
}, null, true, 'Asia/Kolkata');
