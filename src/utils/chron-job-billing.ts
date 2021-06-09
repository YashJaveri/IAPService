//Run every month end
//Send Billing as per (Total request - 50)
import { CronJob } from 'cron'
import { InvoiceModel } from '../models/invoice';
import { UserModel } from '../models/user';
import { constants } from './constants';
import { getStatDetails } from './handle-stat-details';
import { invoiceMailHtml } from './html/invoice-email-format';
import { sendMail } from './mail-handler';
import { generatePdf } from './pdf-generator';



export const jobBill = new CronJob('* * * * *', async function () { //Change to normal after testing is done

    let users = await UserModel.find({})
    let dueDate = new Date(new Date().setDate(new Date().getDate() + 7))

    for (const user of users) {
        if (new Date().getMonth() === 0)
            var pdfData = await getStatDetails(user, 11, new Date().getFullYear() - 1)
        else
            var pdfData = await getStatDetails(user, new Date().getMonth() - 1, new Date().getFullYear())

        let amountPayable = Math.max(0, pdfData.totalCount - constants.FREE_ALLOWANCE) * constants.RATE_PER_REQUEST

        if (amountPayable > 0) {
            let prevInvoice = await InvoiceModel.findOne({}, {}, {sort: { "created_at":-1}})
            
            var prevInvoiceId=-1
            
            if(!prevInvoice){
                prevInvoiceId=1
            }else{
                prevInvoiceId = (prevInvoice.invoiceDisplayId + 1)%Math.pow(10,7)
            }

            let invoice = await InvoiceModel.create({ userId: user._id, invoiceDisplayId: prevInvoiceId, billDetails: pdfData, amount: amountPayable })
            

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

            let pdf = await generatePdf(pdfData)
            sendMail(pdf, user.email, "Test Mail", dueDate, "www.google.com", invoiceMailHtml)   //Add content 
        }
    }
}, null, true, 'Asia/Kolkata');
