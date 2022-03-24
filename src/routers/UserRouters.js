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

router.get('/history', (req,res)=>{
    const sql_reservation = `SELECT * FROM tb_reservation WHERE user_booking LIKE ?`
    const sql_time_slot = `SELECT tsd.date, mr.roomname FROM tb_time_slot_detail tsd INNER JOIN tb_meeting_room mr ON mr.room_id=tsd.room_id WHERE tsd.reservation_id = ?`

    let email = `${req.query.user}%`

    conn.query(sql_reservation, email, (err, result_reservation) => {
        if (err) {
            return res.send("error")
        } else {
            for (let i = 0; i < result_reservation.length; i++) {
                conn.query(sql_time_slot, result_reservation[i].reservation_id, (err, result_time_slot) => {
                    if (result_time_slot[0]) {
                        result_reservation[i].room = result_time_slot[0].roomname
                        result_reservation[i].date = result_time_slot[0].date
                    }
                    if (i == result_reservation.length-1) {
                        // console.log(result_reservation);
                        return res.send(result_reservation);
                    }
                })
            }
        }
    })

})

router.get('/participant', (req,res)=>{
    const sql_participant = `SELECT * FROM tb_participant WHERE reservation_id = ${req.query.id}`

    
    conn.query(sql_participant, (err, result_participant) => {
        return res.send(result_participant)
    })
})

module.exports = router