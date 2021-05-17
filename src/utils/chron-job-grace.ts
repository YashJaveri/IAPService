//Run every 7th day of the month
//Disable if bill not paid and notify
import { CronJob } from 'cron'
import { InvoiceModel, IInvoice } from '../models/invoice';
import { UserModel } from '../models/user';
import { constants } from './constants';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';


export const jobGrace = new CronJob('* * * * *', async function () { //Change to normal after testing is done

    let users = await UserModel.find({})

    for (const user of users) {
        let invoice = await InvoiceModel.findOne({ userId: user._id}, {}, {sort: {'created_at':-1}})
        
        if(invoice && !invoice?.paid){
            var pdfData = invoice.billDetails

            Object.assign(pdfData, {
                name: user.name,
                email: user.email,
                invoiceId: invoice.invoiceDisplayId,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toDateString(), //TODO: date logic needs to be changed
                currDate: new Date().toDateString(),
                subTotal: pdfData.totalCount * constants.RATE_PER_REQUEST,
                billedRequests: Math.max(0, pdfData.totalCount - constants.FREE_ALLOWANCE),
                amountPayable: invoice.amount,
            })

            console.log("Cron grace running...")
            let pdf = await generatePdf(pdfData)
            sendMail(pdf, user.email, "Test Mail", "This is the body")   //add content
            
            user.disabled = true
            await user.save()
        }
    
    }
}, null, true, 'Asia/Kolkata');