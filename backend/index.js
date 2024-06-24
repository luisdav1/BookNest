import express from 'express'
import "dotenv/config"
import routeUser from './routes/user.route.js'

const app = express()
const PORT = process.env.PORT || 4000

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/v1/users', routeUser)

app.listen(PORT, () => {
    console.log('server iniciado en el puerto ' + PORT)
})