//Run every 7th day of the month
//Disable if bill not paid and notify
import { CronJob } from 'cron'
import { InvoiceModel } from '../models/invoice';
import { UserModel } from '../models/user';
import { constants } from './constants';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';


export const jobGrace = new CronJob('* * * * *', async function () { //Change to normal after testing is done

    let users = await UserModel.find({})

    for (const user of users) {
        let invoices = await InvoiceModel.find({ userId: users[i]._id })

        //get last invoice and check padi or not
        if (!paid) {
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
            sendMail(pdf, user.email, "", "")   //add content
            user.disabled = true
            await user.save()
        }
    }
}, null, true, 'Asia/Kolkata');