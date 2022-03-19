const router = require('express').Router()
const conn = require('../connection')

// CREATE DATA
router.post('/inputdata', (req, res) => {
    const sql = `INSERT INTO truck SET ?`
    const data = req.body

    conn.query(sql, data, (err, result2) => {
        if(err) return res.send(err)
        res.send("Data telah berhasil dibuat")
    })
})

// READ DATA
router.get('/manage', (req, res) => {
    const sql = `SELECT * FROM truck`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

router.get('/manage/:id', (req, res) => {
    const sql = `SELECT * FROM truck where id = ?`
    const data = req.params.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

// SEARCH DATA
router.get('/searchdata', (req, res) => {
    const sql = `SELECT * FROM truck WHERE ?`
    const data = req.query
    

    conn.query(sql, data, (err, result) => {
        // Jika ada error dalam menjalankan query, akan dikirim errornya
        if(err) return res.send(err)

        res.send(result[0])
    })
})

// UPDATE DATA BY ID
router.patch('/manage/:id', (req, res) => {
    const sql = `UPDATE truck SET ?
                WHERE id = ${req.params.id}`
    const data = req.body
    
    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send("Data berhasil dirubah")
    })
})

// DELETE DATA BY ID
router.delete('/manage/:id', (req, res) => {
    const sql = `DELETE FROM truck WHERE id = ?`
    const data = req.params.id

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

module.exports = router