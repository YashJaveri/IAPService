import * as admin from 'firebase-admin';

var serviceAccount = require("./firebase/iapservice-firebase-adminsdk-q0hwn-a359781f99.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// admin.auth().verifyIdToken("").then((response)=>{
//     response.
// })