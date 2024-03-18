const express = require('express')
const app = express()
const cors = require('cors');
const cookieParser = require('cookie-parser')
const connectDB = require('./connectDB')
require('dotenv').config();
const port = process.env.PORT || 8000
const User = require('./routes/user')
const Product = require('./routes/product')
const Review = require('./routes/review')
const  { addProductsInDB } = require('./controllers/product')


app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: true, 
}));
app.use(cookieParser())

app.use('/user', User)
app.use('/product', Product)
app.use('/review', Review)

app.get('/', (req, res) => {
    res.status(200).send("server running...")
})

app.listen(port, () => {
    console.log("server started")
    connectDB()
    addProductsInDB()
})
