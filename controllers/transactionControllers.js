const {db} = require('./../connection')

module.exports = {
    addToCart:(req,res)=>{
        let {userid,productid,quantity,penjualid} = req.body
        let data = {
            userid,
            productid,
            quantity,
            lastupdate: new Date(),
            penjualid
        }
        let sql = "select * from transaksi where status='oncart' and userid=? and productid=?"
        db.query(sql,[userid, productid],(err,result)=>{
            if(err)res.send({message:err})
            if(result.length){
                let qtyFinal = {
                    quantity: quantity + result[0].quantity,
                    lastupdate: new Date()
                }
                sql = "update transaksi set ? where userid=? and productid=?"
                db.query(sql,[qtyFinal,userid,productid],(err,result2)=>{
                    if(err)res.send({message:err})
                    return res.send({message: 'item has updated to cart'})
                })
            } else {
                data.status = 'oncart'
                sql = "insert into transaksi set ?"
                db.query(sql,data,(err,result3)=>{
                    if(err)res.send({message:err})
                    return res.send({message: 'item has been added to cart'})
                })
            }
        })
    }
}