//Run every month end
//Send Billing as per (Total request - 50)
import { CronJob } from 'cron'
import { InvoiceModel } from '../models/invoice';
import { UserModel } from '../models/user';
import { constants } from './constants';
import { generateBill } from './generate-bill';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';



export const jobBill = new CronJob('* * * * *', async function () { //Change to normal after testing is done

    let users = await UserModel.find({})
    for (const user of users) {
        if (new Date().getMonth() === 0)
            var pdfData = await generateBill(user, 11, new Date().getFullYear() - 1)
        else
            var pdfData = await generateBill(user, new Date().getMonth() - 1, new Date().getFullYear())

        let amountPayable = Math.max(0, pdfData.totalCount - constants.FREE_ALLOWANCE) * constants.RATE_PER_REQUEST

        if (amountPayable > 0) {
            InvoiceModel.create({ userId: user._id, billDetails: pdfData, amount: amountPayable })
            Object.assign(pdfData, {
                name: user.name,
                email: user.email,
                dueDate: new Date((new Date().getDay() + 7)).toDateString(), //TODO: date logic needs to be changed
                currDate: new Date().toDateString(),
                subTotal: pdfData.totalCount * constants.RATE_PER_REQUEST,
                billedRequests: Math.max(0, pdfData.totalCount - constants.FREE_ALLOWANCE),
                amountPayable: amountPayable,
            })

            let pdf = await generatePdf(pdfData)
            sendMail(pdf, user.email, "", "")   //Add content
        }
    }
}, null, true, 'Asia/Kolkata');
