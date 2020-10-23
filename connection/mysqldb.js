const mysql=require('mysql')

//local
const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE,
    port     : 3306
});

//db4free
// const db = mysql.createConnection({
//     host     : 'db4free.net',
//     user     : 'hasianamin',
//     password : 'P@ssw0rd',
//     database : 'db_latihan1013',
//     port     : 3306
// });

db.connect((err)=>{
    if(err)console.log(err)
    else console.log('success')
})


module.exports=db