const router = require('express').Router()
const conn = require('../connection')

router.get('/users', (req,res)=>{
    res.send("test")
})

router.post('/users/login', (req,res)=>{
    // const sql = `select * from users where username = ? `
    const data = req.body.email

    if (data == "admin@email.com") {
        return res.send(data)
    } else {
        return res.send(`Email admin@email.com`)
    }

    // conn.query(sql, data, async (err, result) => {
    //     if (err) return res.send(err)

    //     const user = result[0]

    //     if (!user) return res.send('Username not found')

    //     const match = await bcrypt.compare(req.body.password, result[0].password)
    //     if (!match) {
    //         return res.send(`Password incorrect`)
    //     }

    //     res.send(user)
    // })
})

module.exports = router