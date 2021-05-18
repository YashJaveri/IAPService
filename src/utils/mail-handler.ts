import { constants } from "./constants";
import { invoiceMailHtml } from "./html/invoice-email-format";

var nodemailer = require('nodemailer');
const fs = require('fs')
const handlebars = require('handlebars')

export function sendMail(pdf: any, email: string, subject: string, dueDate: Date, link: string, renderHtml: any) {
    var billingMonth
    var billingYear
   
    if(new Date().getMonth() === 0){
        billingMonth = constants.MONTH_NAMES[11]
        billingYear = new Date().getFullYear()-1
    }else{
        billingMonth = constants.MONTH_NAMES[new Date().getMonth()-1]
        billingYear = billingYear = new Date().getFullYear()
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'astronauak@gmail.com',
            pass: 'Astronaut@123'
        }
    });

    var template = handlebars.compile(renderHtml());
    console.log("after template")

    var replacements = {
        dueDate: dueDate.toLocaleString(),
        month: billingMonth,
        year: billingYear,
        paymentUrl: link
    };
    var htmlToSend = template(replacements);

    var mailOptions = {
        from: 'astronauak@gmail.com',   //change to professional mail
        to: email,
        subject: subject,
        html: htmlToSend,
        attachments: [
            {   // file on disk as an attachment
                filename: 'invoice.pdf',
                path: './src/pdfstorage/output.pdf' // stream this file
            }
        ]

    };

    transporter.sendMail(mailOptions, function (error: Error, info: any) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            fs.unlinkSync('./src/pdfstorage/output.pdf')
        }
    });

    
}

