const {db} = require('./../connection')
const {encrypt} = require('./../helpers')
const nodeMailer = require('nodemailer')
const fs = require('fs')
const handlebars = require('handlebars')
const {createJWToken} = require('./../helpers/jwt')

let transporter=nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user:'hasianamin14@gmail.com',
        pass: 'zdmyshyaqtriljwr'
    },
    tls:{
        rejectUnauthorized:false
    }
})

module.exports = {
    register:(req,res)=>{
        const {username, email, password} = req.body
        let hashPassword = encrypt(password)
        let sql = 'select * from users where username = ?'
        db.query(sql,[username],(err,result)=>{
            if(err) return res.status('500').send({message:err})
            if(result.length) return res.status('500').send({message:'user sudah terdaftar'})
            else{
                let otp_code = Math.floor(1000 + Math.random() * 9000);
                let data = {
                    username,
                    password: hashPassword,
                    email,
                    lastlogin: new Date(),
                    otp: otp_code,
                    roleid:3
                }
                sql = 'insert into users set ?'
                db.query(sql, data, (err)=>{
                    if(err) return res.status('500').send({message:err})
                    sql = 'select * from users where username = ?'
                    db.query(sql,[username],(err,user_data)=>{
                        if(err) return res.status('500').send({message:err})
                        const htmlRender = fs.readFileSync('otp.html','utf8')
                        const template = handlebars.compile(htmlRender)
                        const htmlEmail = template({username:user_data[0].username, otp_code})
                        transporter.sendMail({
                            from: 'Ujian BE <hasianamin14@gmail.com',
                            to:email,
                            subject:'OTP Code verification',
                            html:htmlEmail
                        },(err)=>{
                            if(err) return res.status('500').send({message:err})
                            return res.send(user_data[0])
                        })
                    })
                })
            }
        })
    },
    verified:(req,res)=>{
        let {id} = req.params
        let {otp} = req.body
        let editData = {
            statusver: 'verified',
            lastlogin: new Date(),
            otp: null
        }
        let sql = 'select * from users where id = ? and otp = ?'
        db.query(sql,[id,otp],(err,result)=>{
            if(err) res.status(500).send({message:'invalid otp'})
            if(result.length){
                sql = 'update users set ? where id = ?'
                db.query(sql,[editData,id],(err,result2)=>{
                    if(err) res.status(500).send({message: err})
                    return res.send({message:'verified success'})
                })
            }
        })
    },
    login:(req,res)=>{
        let {username, password} = req.body
        let hashPassword = encrypt(password)
        let data = {
            username,
            password: hashPassword
        }
        let sql = "select * from users where username = ? and statusver = 'verified' "
        db.query(sql,username,(err,result)=>{
            if(err) res.send({message:err})
            if(!result.length) res.send({message:'not verified'})
            sql = "select * from users where username = ? and password = ?"
            db.query(sql,[username, hashPassword],(err,result2)=>{
                if(err) res.send({message:err})
                if(result2.length){
                    let data = {
                        lastlogin: new Date()
                    }
                    sql = 'update users set ? where username = ?'
                    db.query(sql, [data,username], (err,result3)=>{
                        if(err) res.send({message:err})
                        return res.send({message: 'success login'})
                    })
                }
            })
        })
    },
    sendOtp:(req,res)=>{
        const {email} = req.body
        let otp_code = Math.floor(1000 + Math.random() * 9000);
        const htmlRender = fs.readFileSync('otp.html','utf8')
        const template = handlebars.compile(htmlRender)
        const htmlEmail = template({otp_code})
        transporter.sendMail({
            from: 'Ujian BE <hasianamin14@gmail.com',
            to:email,
            subject:'OTP Code verification',
            html:htmlEmail
        },(err)=>{
            if(err) return res.status('500').send({message:err})
            return res.send({message:'otp has been send to your email', otp:otp_code})
        })
    }
}