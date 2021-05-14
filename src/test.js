const admin = require('firebase-admin')

const serviceAccount = require("./firebase/iapservice-firebase-adminsdk-q0hwn-a359781f99.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/*admin
  .auth()
  .createCustomToken(uid)
  .then((customToken) => {
    console.log(customToken)
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
});*/

var firebase = require('firebase');

var app = firebase.initializeApp({
  apiKey: "AIzaSyCyJYky_CJD3xlYyYE6TJQrpfNJEuxe-fQ",
  authDomain: "iapservice.firebaseapp.com",
  projectId: "iapservice",
  storageBucket: "iapservice.appspot.com",
  messagingSenderId: "395495264330",
  appId: "1:395495264330:web:2758df14f367d418af96b3",
  measurementId: "G-4NJRKDKHG9"
});


firebase.auth().signInWithEmailAndPassword("aditkalyani@gmail.com", "pass@123")
  .then(async (userCredential) => {
    // Signed in
    var user = userCredential.user;
    let IdToken = await user.getIdToken()
    console.log(IdToken)
  })
  .catch((error) => {
    console.log(error.message)
    var errorCode = error.code;
    var errorMessage = error.message;
  });