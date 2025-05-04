require('dotenv').config();
 
const path = require('path')

const express = require('express');
const urlRouter = require('./routes/url');
const staticRoutes = require('./routes/staticRoutes')
const URL = require('./models/url');

const { connectToMongoDB } = require('./connect');

const app = express()

connectToMongoDB(process.env.MongodbUrl).then(() => console.log("connected to mongodb"))


app.set('view engine', 'ejs')

app.set('views',path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({
    extended :true
}))


app.get("/test", async (req, res) => {
    const result = await URL.find({})
    return res.render('home', {
        urls:result
    })
})
app.use("/url", urlRouter)
app.use('/',staticRoutes)

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