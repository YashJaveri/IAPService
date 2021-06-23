//Run every month end
//Send Billing as per (Total request - 50)
import { CronJob } from 'cron'
import { InvoiceModel } from '../models/invoice';
import { UserModel } from '../models/user';
import { constants } from './constants';
import { getCompleteUserStats } from './handle-stat-details';
import { invoiceMailHtml } from './html/invoice-email-format';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';



export const jobBill = new CronJob('* * * * *', async function () { //Change to normal after testing is done
    console.log('Cron job billing started...')
    const fs = require('fs')
    let users = await UserModel.find({})
    let dueDate = new Date(new Date().setDate(new Date().getDate() + 7))
    // console.log('Users found')

    for (const user of users) {
        if (new Date().getMonth() === 0)
            var pdfData = await getCompleteUserStats(user, 11, new Date().getFullYear() - 1)
        else{
            // TODO: getMonth()-1
            var pdfData = await getCompleteUserStats(user, new Date().getMonth(), new Date().getFullYear())
        }
        // console.log('got complete user stats')

        let amountPayable = Math.max(0, pdfData.totalCount - constants.FREE_ALLOWANCE) * constants.RATE_PER_REQUEST

        // console.log('Amount Payable', amountPayable)

        if (amountPayable > 0) {
            //logic to generate bill display id
            let prevInvoice = await InvoiceModel.findOne().sort({createdAt: -1})

            var invoiceId=-1
            
            if(!prevInvoice){
                invoiceId=1
            }else{
                invoiceId = (prevInvoice.invoiceDisplayId + 1)%Math.pow(10,7)
            }

            let invoice = await InvoiceModel.create({ userId: user._id, invoiceDisplayId: invoiceId, billDetails: pdfData, amount: amountPayable })
            

            Object.assign(pdfData, {
                name: user.name,
                email: user.email,
                invoiceId: invoice.invoiceDisplayId,
                dueDate: dueDate.toDateString(), 
                currDate: new Date().toDateString(),
                subTotal: pdfData.totalCount * constants.RATE_PER_REQUEST,
                billedRequests: Math.max(0, pdfData.totalCount - constants.FREE_ALLOWANCE),
                amountPayable: amountPayable,
            })

            let pdf = await generatePdf(pdfData, user)
            await sendMail(pdf, user.email, "Test Mail", dueDate, "www.google.com", invoiceMailHtml, user)   //Add content 

        }
    }
}, null, true, 'Asia/Kolkata');
