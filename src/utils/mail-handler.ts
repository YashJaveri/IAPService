import { invoiceMailHtml } from "./html/invoice-email-format";

var nodemailer = require('nodemailer');
const fs = require('fs')
const handlebars = require('handlebars')

export function sendMail(pdf: any, email: string, subject: string, dueDate: any, month: string, year: number, link: string, renderHtml: any) {
   
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'astronauak@gmail.com',
            pass: 'Astronaut@123'
        }
    });

    console.log("before template")
    var template = handlebars.compile(renderHtml());
    console.log("after template")

    var replacements = {
        dueDate: dueDate.toLocaleString(),
        month: month,
        year: year,
        paymentUrl: link
    };
    var htmlToSend = template(replacements);

    var mailOptions = {
        from: 'astronauak@gmail.com',
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

