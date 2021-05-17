export function invoiceMailHtml(month: string, year: string, paymentUrl: string, dueDate: string) {
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Invoice</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Coda&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Coda:wght@400;800&display=swap" rel="stylesheet">
            <style type="text/css">
                * {
                    font-family: 'Coda';
                }
        
                body,
                table,
                td,
                a {
        
                    -ms-text-size-adjust: 100%;
                    /* 1 */
                    -webkit-text-size-adjust: 100%;
                    /* 2 */
                }
        
                /**
         * Remove extra space added to tables and cells in Outlook.
         */
                table,
                td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                }
        
                /**
         * Better fluid images in Internet Explorer.
         */
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                /**
         * Remove blue links for iOS devices.
         */
                a[x-apple-data-detectors] {
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    color: inherit !important;
                    text-decoration: none !important;
                }
        
                /**
         * Fix centering issues in Android 4.4.
         */
                div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                }
        
                body {
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
                table {
                    border-collapse: collapse !important;
                }
        
                a {
                    color: #fc5350;
                }
        
                img {
                    height: auto;
                    line-height: 100%;
                    text-decoration: none;
                    border: 0;
                    outline: none;
                }
            </style>
        
        </head>
        
        <body style="background-color: #e9ecef;">
        
            <!-- start preheader -->
            <div class="preheader"
                style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
                Invoice
            </div>
            <!-- end preheader -->
        
            <!-- start body -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
        
                <!-- start logo -->
                <tr>
                    <td align="center" bgcolor="#e9ecef">

                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" valign="top" style="padding: 18px 12px;">
                                    
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <!-- end logo -->
        
                <!-- start hero -->
                <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="left" bgcolor="#ffffff"
                                    style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                                    <h1
                                        style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                                        Your invoice for month} is ready</h1>
                                </td>
                            </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
                    </td>
                </tr>
                <!-- end hero -->
        
                <!-- start copy block -->
                <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        
                            <tr>
                                <td align="left" bgcolor="#ffffff"
                                    style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                    <p style="margin: 0;">We thank you for using our service!</p>
                                </td>
                            </tr>
                            
                            <tr>
                                <td align="left" bgcolor="#ffffff"
                                    style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                    <p style="margin: 0;">Your invoice for ${month}, ${year} is ready. Kindly make the payment using this 
                                    <a style="color: #fc5350;" href=${paymentUrl} target="_blank">link</a> by ${dueDate}. You can also complete the payment by visiting your dashboard at
                                    <a style="color: #fc5350;" href="www.somewebsite.com" target="_blank">www.somewebsite.com</a></p>
                                    </p>
                                    <p style="margin: 0;">If the pdf looks corrupted. Kindly contact us at</p>
                                    <a style="color: #fc5350;" href="hello@cryvis.com" target="_blank">hello@cryvis.com</a>
                                </td>
                            </tr>
        
                            <!-- start copy -->
                            <tr>
                                <td align="left" bgcolor="#ffffff"
                                    style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                                    <p style="margin: 0;">Cheers,<br> Team Cryvis</p>
                                </td>
                            </tr>
                            <!-- end copy -->
        
                        </table>
                    </td>
                </tr>
            </table>        
        </body>
        </html>`
}