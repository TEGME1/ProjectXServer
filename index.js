import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import AuthenticationRoutes from './routes/authentication_routes.js'

const app = express()
app.use(cors({ origin: '*' }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use((err, req, res, next) => {
    if (err) {
        res.status(400).send('Error parsing data')
    } else {
        next()
    }
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', AuthenticationRoutes)

app.get('/', (req, res) => {
    console.log(req.body)
})

const PORT = process.env.PORT | 8080

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})