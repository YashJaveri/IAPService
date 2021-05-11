import * as admin from 'firebase-admin';
import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { BodyParser } from "./middlewares/body-parser"
import ApiError from "./utils/api-error"
import http from 'http';
import { Routes } from "./routes"

const app = express()
const serviceAccount = require("./firebase/iapservice-firebase-adminsdk-q0hwn-a359781f99.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.use(cors()); //AK doubt
app.use(BodyParser);
app.use(Routes);
app.use((err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    if (err.constructor === ApiError && err.name === 'ApiError') {
        res.status(err.responseCode).send(err.toResponseData())
    } else {
        res.sendStatus(500)
        console.log(err)
    }
})

const server = http.createServer(app);

mongoose.connect("mongodb://127.0.0.1:27017/IAPService", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    server.listen(process.env.PORT || 8080, () => {
        console.log("Server Running...")
    })
})