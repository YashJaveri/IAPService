var nodemailer = require('nodemailer');
const fs = require('fs')

export function sendMail(pdf: any, email: string, subject: string, body: string) {
    console.log("Sending mail")

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'astronauak@gmail.com',
            pass: 'Astronaut@123'
        }
    });

    var mailOptions = {
        from: 'astronauak@gmail.com',
        to: 'aditkalyani1111@gmail.com',
        subject: subject,
        text: 'That was easy!' + body,
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
        }
    });

    fs.unlinkSync('./src/pdfstorage/output.pdf')
}

