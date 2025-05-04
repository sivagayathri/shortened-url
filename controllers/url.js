const { nanoid }= require('nanoid')
const URL = require('../models/url');


async function handleGenerateShortUrl(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({
        error:'url is required'
    })
    }
    const shortID = nanoid(8) 
    await URL.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory:[]
    })

    return res.render('home', {
        id: shortID   
    })

  
}

async function handleGetAnalytics(req,res) {
    const shortId = req.params.shortId

    if (!shortId) {
        return res.status(400).json({
            error: 'shortId is required'
        })
    }
    const result = await URL.findOne({ shortId })
     return res.json(`total click:${result.visitHistory.length}`)
}

module.exports = {
    handleGenerateShortUrl,
    handleGetAnalytics
}


