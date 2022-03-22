const router = require('express').Router()
const conn = require('../connection')

router.get('/users', (req,res)=>{
    res.send("test")
})

router.post('/users/login', (req,res)=>{
    const data = req.body.email

    if (data == "admin@email.com") {
        return res.send(data)
    } else {
        return res.send(`Email admin@email.com`)
    }
})

module.exports = router