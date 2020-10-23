const express=require('express')
const app = express()
const bodyParser=require('body-parser')
const cors=require('cors')
const bearerToken=require('express-bearer-token')
const http=require('http')
require('dotenv').config()
const {db} = require('./connection')


const PORT= process.env.PORT || 5000

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors())
app.use(bearerToken())

const server = http.createServer(app)

// app.get('/getactor',(req,res)=>{
//     let sql = 'select * from actor limit 10'
//     db.query(sql,(err,result)=>{
//         if(err)res.send({message:err})
//         res.send(result)
//     })
// })

const {authRoutes, transactionRoutes, pendapatanRoutes} = require('./routes')
app.use('/auth',authRoutes)
app.use('/transaction',transactionRoutes)
app.use('/pendapatan',pendapatanRoutes)

server.listen(PORT,()=>{
    console.log('Api Aktif di Port '+PORT)
})