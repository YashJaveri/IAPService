// import { IUser } from "../models/user";

// var easyinvoice = require('easyinvoice');
// const fs = require('fs')

// //https://codepen.io/tjoen/pen/vCHfu

// export async function generatePdf(user: IUser,billData: any){

//     var itemsArr = []

//     for(let i=0;i<billData.statistics.length;i++){
//         var currBillObj = billData.statistics[i]
//         console.log(JSON.stringify(currBillObj) + "***")
//         var itemObj = {
//             quantity: currBillObj.count,
//             description: currBillObj.platform+" & "+currBillObj.appId,
        
//             tax: 20, //hardcoded
//             price: 0.6 //hardcoded
//         }

//         await itemsArr.push(itemObj)
//     }


//     var receiptObj = {
//         //"documentTitle": "RECEIPT", //Defaults to INVOICE
//         //"locale": "de-DE", //Defaults to en-US, used for number formatting (see docs)
//         "currency": "USD", //See documentation 'Locales and Currency' for more info
//         "taxNotation": "vat", //or gst
//         "marginTop": 25,
//         "marginRight": 25,
//         "marginLeft": 25,
//         "marginBottom": 25,
//         "logo": "https://www.easyinvoice.cloud/img/logo.png", //or base64
//         //"logoExtension": "png", //only when logo is base64
//         "sender": {
//             "company": "Cryvis",
//             "address": "Sample Street 123",
//             "zip": "400006",
//             "city": "Mumbai",
//             "country": "India"
//             //"custom1": "custom value 1",
//             //"custom2": "custom value 2",
//             //"custom3": "custom value 3"
//         },
//         "client": {
//                "company": user.email,
//                "address": user.name,
//                "zip": "",
//                "city": "",
//                "country": ""
//             //"custom1": "custom value 1",
//             //"custom2": "custom value 2",
//             //"custom3": "custom value 3"
//         },
//         "invoiceNumber": "2021.0001",
//         "invoiceDate": "1.1.2021",
//         "products": itemsArr,
//         "bottomNotice": "Kindly pay your invoice within 7 days.",
        
//     };
    
//     const result = await easyinvoice.createInvoice(receiptObj);
//     console.log("Writing pdf");      
//     await fs.writeFileSync("src/pdfstorage/invoice.pdf", result.pdf, 'base64');              
//     //easyinvoice.download('myInvoice.pdf', result.pdf);
// }
var pdf = require("pdf-creator-node");
var fs = require("fs");
var options = {
    // format: "A3",
    // orientation: "portrait",
    // border: "10mm",
    // header: {
    //     height: "45mm",
    //     contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
    // },
    // footer: {
    //     height: "28mm",
    //     contents: {
    //         first: 'Cover page',
    //         2: 'Second page', // Any page number is working. 1-based index
    //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
    //         last: 'Last Page'
    //     }
    // }
};

import { IUser } from "../models/user";

export async function generatePdf(billData: any){

    var html = await fs.readFileSync("src/utils/html/invoice.html", "utf8")
    // billData:{

    // }

    
    
    var document = {
        html: html,
        data: {
          bill: billData,
        },
        path: "./src/pdfstorage/output.pdf",
        type: "",
    };

    console.log("Creating pdf")
    await pdf
    .create(document, options)
    .then((res: any) => {
        console.log(res);
    })
    .catch((error: any) => {
        console.error(error);
    });
    console.log("Pdf created")
}

// Read HTML Template
