const router = require('express').Router()
const conn = require('../connection')

router.get('/rooms', (req,res)=>{
    const sql_room = `SELECT * FROM tb_meeting_room`
    const sql_facility = `SELECT tb_facility_detail.room_id, tb_facility.facility_id, tb_facility.facility_name, tb_facility_detail.status FROM tb_facility INNER JOIN tb_facility_detail ON tb_facility.facility_id=tb_facility_detail.facility_id`
    const sql_time_slot = `SELECT tb_time_slot_detail.room_id, tb_time_slot.time_slot_id, tb_time_slot.time, tb_time_slot_detail.status FROM tb_time_slot INNER JOIN tb_time_slot_detail ON tb_time_slot.time_slot_id=tb_time_slot_detail.time_slot_id`

    let room_detail = null

    conn.query(sql_room, (err, result_room) => {
        if (err) {
            return res.send(err)
        } else {
            room_detail = result_room
            conn.query(sql_facility, (err, result_facility) => {
                if (err) {
                    return res.send(err)
                } else {
                    for (let a = 0; a < room_detail.length; a++) {
                        const facility = []
                        for (let b = 0; b < result_facility.length; b++) {
                            if (room_detail[a].room_id === result_facility[b].room_id) {
                                const payload = {
                                    facility_name : result_facility[b].facility_name,
                                    status : result_facility[b].status
                                }
                                facility.push(payload)
                            }
                        }
                        room_detail[a].facility = facility
                    }
                    conn.query(sql_time_slot, (err, result_time_slot) => {
                        if (err) {
                            return res.send(err)
                        } else {
                            for (let a = 0; a < room_detail.length; a++) {
                                const time_slot = []
                                for (let b = 0; b < result_time_slot.length; b++) {
                                    if (room_detail[a].room_id === result_time_slot[b].room_id) {
                                        const payload = {
                                            id : result_time_slot[b].time_slot_id,
                                            time : result_time_slot[b].time,
                                            status : result_time_slot[b].status
                                        }
                                        time_slot.push(payload)
                                    }
                                }
                                room_detail[a].time_slot = time_slot
                            }
                            return res.send(room_detail)
                        }
                    })
                }
            })
        }
    })
})

// router.post('/users/login', (req,res)=>{
    // const sql = `select * from users where username = ? `
    // const data = req.body.email

    // if (data == "admin@email.com") {
    //     return res.send(data)
    // } else {
    //     return res.send(`Email admin@email.com`)
    // }

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
// })

module.exports = router