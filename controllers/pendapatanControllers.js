const {db} = require('../connection')

module.exports={
    income:(req,res)=>{
        let sql = `SELECT sum(quantity * hargabeli * 0.1) as total FROM ujian.transaksi
        where status = 'Finished'`
        db.query(sql,(err,result)=>{
            if(err)res.send({message:err})
            return res.send(result)
        })
    },
    incomePotential:(req,res)=>{
        let sql = `SELECT sum(quantity * hargabeli * 0.1) as total FROM ujian.transaksi`
        db.query(sql,(err,result)=>{
            if(err)res.send({message:err})
            return res.send(result)
        })
    },
    bestSeller:(req,res)=>{
        let sql = `SELECT t.penjualid, p.namatoko, count(t.penjualid) as 'jml_transaksi' FROM transaksi t
        inner join penjual p
        on p.id = t.penjualid
        where status = 'Finished'`
        db.query(sql,(err,result)=>{
            if(err) res.send({message:err})
            return res.send(result)
        })
    },
    notseller:(req,res)=>{
        let sql =`SELECT count(u.id) as 'bukan_penjual' FROM users u
        left join penjual p
        on u.id = p.userid
        where p.id is null`
        db.query(sql,(err,result)=>{
            if(err) res.send({message:err})
            return res.send(result)
        })
    },
    bestCategory:(req,res)=>{
        let sql = `SELECT cp.namacategory, count(cp.id) as 'total' FROM transaksi t
        inner join products p
        on p.id = t.productid
        inner join category_products cp
        on cp.id = p.categoryprodid
        where t.status = 'Finished'
        group by cp.namacategory
        order by total desc limit 1`
        db.query(sql,(err,result)=>{
            if(err) res.send({message:err})
            return res.send(result)
        })
    },
    bestProduct:(req,res)=>{
        let sql = `SELECT p.image, penj.namatoko, p.nama, p.informasiproduct, count(t.id) as 'total' FROM transaksi t
        inner join products p 
        on p.id = t.productid
        inner join penjual penj
        on penj.id = p.penjualid
        group by t.productid
        order by total desc
        limit 6`
        db.query(sql,(err,result)=>{
            if(err) res.send({message:err})
            return res.send(result)
        })
    }

}