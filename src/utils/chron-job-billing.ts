//Run every month end
//Send Billing as per (Total request - 50)
import {CronJob} from 'cron'
import { UserModel } from '../models/user';
import { getBillDetail } from './get-bill-details';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';

export const job = new CronJob('0 0 1 * *', async function() {

    let users = await UserModel.find({})
    for(let i = 0; i<users.length; i++){
        let billDetails = getBillDetail(users[i]._id, new Date().getMonth(), new Date().getFullYear())
        let pdf = generatePdf(billDetails)
        sendMail(pdf, users[i].email)
    }
}, null, true, 'Asia/Kolkata');