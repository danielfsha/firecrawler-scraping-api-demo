import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import FirecrawlApp from '@mendable/firecrawl-js';

const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY

if(!FIRECRAWL_API_KEY) {
    throw new Error("FIRECRAWL API KEY isn't defined'")
}

const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
})

app.post('/scrape', async (req, res) => {
    const { URL } = req.body

    try {
        const crawlResponse = await firecrawl.scrapeUrl(URL, {
            formats: ['markdown', 'html', 'screenshot@fullPage'],
        })

        if (!crawlResponse.success) {
            throw new Error(`Crawl failed: ${crawlResponse.error}`)
        }

        // console.log(crawlResponse)
        res.status(200).json({crawlResponse: crawlResponse})
    } catch (error) {
        throw new Error(`Crawl failed: ${error}`)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})