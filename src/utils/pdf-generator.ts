var pdf = require("pdf-creator-node");
var fs = require("fs");

var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
};

export async function generatePdf(billData: any) {

    var html = await fs.readFileSync("src/utils/html/invoice.html", "utf8")

    var document = {
        html: html,
        data: {
            bill: billData,
        },
        path: "./src/pdfstorage/output.pdf",
        type: "",
    };

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