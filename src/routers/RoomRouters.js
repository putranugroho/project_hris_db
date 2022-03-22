const router = require('express').Router()
const conn = require('../connection')

router.get('/rooms', (req,res)=>{
    const sql_room = `SELECT * FROM tb_meeting_room`
    const sql_facility = `SELECT tb_facility_detail.room_id, tb_facility.facility_id, tb_facility.facility_name, tb_facility_detail.status FROM tb_facility INNER JOIN tb_facility_detail ON tb_facility.facility_id=tb_facility_detail.facility_id`
    const sql_time_slot = `SELECT * FROM tb_time_slot`
    const sql_reservation = `SELECT tb_time_slot_detail.room_id, tb_time_slot.time_slot_id, tb_time_slot.time, tb_time_slot_detail.reservation_id, tb_time_slot_detail.date FROM tb_time_slot INNER JOIN tb_time_slot_detail ON tb_time_slot.time_slot_id=tb_time_slot_detail.time_slot_id`

    let room_detail = null
    let date = ""

    if (req.query.date) {
        date = req.query.date.split("-").join("/")
    }

    conn.query(sql_room, (err, result_room) => {
        if (err) {
            return res.send("error")
        } else {
            room_detail = result_room
            conn.query(sql_facility, (err, result_facility) => {
                if (err) {
                    return res.send("error")
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
                            return res.send("error")
                        } else {
                            conn.query(sql_reservation, (err, result_reservation) => {
                                if (err) {
                                    return res.send("error")
                                } else {
                                    for (let a = 0; a < room_detail.length; a++) {
                                        const time_slot = []
                                        for (let b = 0; b < result_time_slot.length; b++) {
                                            let status = 1
                                            for (let c = 0; c < result_reservation.length; c++) {
                                                if ((result_time_slot[b].time_slot_id === result_reservation[c].time_slot_id && room_detail[a].room_id === result_reservation[c].room_id) && date == result_reservation[c].date){
                                                    status = 0
                                                }
                                            }
                                            const payload = {
                                                id : result_time_slot[b].time_slot_id,
                                                time : result_time_slot[b].time,
                                                status : status
                                            }
                                            time_slot.push(payload)
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
        }
    })
})

router.post('/booking', (req,res)=>{
    const sql_reservation = `INSERT INTO tb_reservation(reservation_id, pic, agenda, addon, user_booking, stsrec) VALUES (?,?,?,?,?,0)`
    const sql_participant = `INSERT INTO tb_participant(nik, reservation_id, nama, hp, email, reminder, status) VALUES (?,?,?,?,?,?,0)`
    const sql_time_slot = `INSERT INTO tb_time_slot_detail(room_id, time_slot_id, reservation_id, date) VALUES (?,?,?,?)`
    const count = `SELECT COUNT(*) AS 'count' FROM tb_reservation`
    const data = req.body

    let date = data.detail_booking.room[0].date.split("/")
    const a = date[0]
    date[0] = date[2]
    date[2] = date[1]
    date[1] = a
    date = date.join("")

    let addon = data.detail_booking.addon.join(",")
    let user_booking = `${data.objCookie.email},${data.objCookie.username}`

    conn.query(count, (err, result_count) => {
        if (err) {
            return res.send("error")
        } else {
            result_count = result_count[0].count+1
            if (result_count < 10) {
                result_count = `000${result_count}`
            } else if (result_count < 100) {
                result_count = `00${result_count}`
            }  else if (result_count < 1000) {
                result_count = `0${result_count}`
            }
            let reservation_id = `${date}${result_count}`
            conn.query(sql_reservation, [reservation_id,data.detail_booking.pic,data.detail_booking.agenda,addon,user_booking],(err, result_reservation) => {
                if (err) {
                    return res.send("error")
                } else {
                    for (let a = 0; a < data.detail_booking.nama.length; a++) {
                        let reminder = 0
                        let nik = 0
                        if (data.detail_booking.nama[a].blast) {
                            reminder = 1
                            nik = parseInt(`00000${a+1}`)
                        }
                        conn.query(sql_participant, [nik,reservation_id,data.detail_booking.nama[a].nama,data.detail_booking.nama[a].hp,data.detail_booking.nama[a].email, reminder], (err, result_participant) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("success");
                            }
                        })
                    }
                    conn.query(sql_time_slot, [data.detail_booking.room[0].ruangan_id,data.detail_booking.room[0].id,reservation_id,data.detail_booking.room[0].date], (err, result_participant) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("success");
                        }
                    })
                    return res.send("Booking Berhasil Dibuat")
                }
            })
        }
    })
})

module.exports = router