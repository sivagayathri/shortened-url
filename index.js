require('dotenv').config();


const express = require('express');
const urlRouter = require('./routes/url');
const URL = require('./models/url');

const { connectToMongoDB } = require('./connect');

const app = express()

connectToMongoDB(process.env.MongodbUrl).then(() => console.log("connected to mongodb"))

app.use(express.json())
app.use("/url", urlRouter)

app.get("/:shortId",async (req, res) => {
    const shortId = req.params.shortId
    
  const entry=  await URL.findOneAndUpdate({
       shortId
    }, {
        $push: {
            visitHistory: {
                timestamp:Date.now()
            }
   }})
    return res.redirect(entry.redirectUrl)

})


const PORT = 8000

app.listen(PORT,()=>console.log(`server started listening ${PORT}`))