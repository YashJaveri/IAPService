//Run every 7th day of the month
//Disable if bill not paid and notify
import { CronJob } from 'cron'
import { InvoiceModel, IInvoice } from '../models/invoice';
import { UserModel } from '../models/user';
import { constants } from './constants';
import { invoiceDueMailHtml } from './html/invoice-email-past-due';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';


export const jobGrace = new CronJob('* * * * *', async function () { //Change to normal after testing is done
    console.log('Cron job grace started...')
    const fs = require('fs')
    let users = await UserModel.find({})
    let dueDate = new Date(new Date().setDate(new Date().getDate() + 7))

    for (const user of users) {
        let invoice = await InvoiceModel.findOne({ userId: user._id}, {}, {sort: {'created_at':-1}})
        console.log('Invoice Grace ' + JSON.stringify(invoice) + ' ' + user.email)
        if(invoice && !invoice?.paid){
            var pdfData = invoice.billDetails

            Object.assign(pdfData, {
                name: user.name,
                email: user.email,
                invoiceId: invoice.invoiceDisplayId,
                dueDate: dueDate.toDateString(),
                currDate: new Date().toDateString(),
                subTotal: pdfData.totalCount * constants.RATE_PER_REQUEST,
                billedRequests: Math.max(0, pdfData.totalCount - constants.FREE_ALLOWANCE),
                amountPayable: invoice.amount,
            })

            console.log("Cron grace running...")
            let pdf = await generatePdf(pdfData, user)
            sendMail(pdf, user.email, "Test Mail", dueDate, "www.google.com", invoiceDueMailHtml, user) 
            //fs.unlinkSync("./src/pdfstorage/" + user._id + ".pdf");
            user.disabled = true
            await user.save()
        }
    
    }
}, null, true, 'Asia/Kolkata');