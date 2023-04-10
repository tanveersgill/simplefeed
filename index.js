import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config()
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan";
import path from "path"
import { fileURLToPath } from "url";

import register from "./controllers/auth.js"

//config
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json()) //parses incoming json
app.use(helmet()) //gives us various headers for safety
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"})) //cors headers
app.use(morgan("common")) //for info on incoming requests
app.use(bodyParser.json({extended:true, limit: "30mb"}))
app.use(bodyParser.urlencoded({extended:true, limit: "30mb"}))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

//multer file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})

//routes w/ files
app.post('/auth/register', 
        upload.single('picture'), //specifies where the file will be coming from, and that there will just be one
        register);


//mongodb setup
const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.MONGO_URL, {
    userNewURLParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })
}).catch(err => console.log(err, 'could not connect'))