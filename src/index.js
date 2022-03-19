const express = require('express')
const cors = require ('cors')
const ManageRouter = require('./routers/ManageRouters')
const UserRouter = require('./routers/UserRouters')
const RoomRouter = require('./routers/RoomRouters')
const ports = require('./config')

const app = express()
const port = ports

app.use(express.json())
app.use(cors())
app.use(RoomRouter)
app.use(UserRouter)
app.use(ManageRouter)

app.get('/', (req,res) =>{
    res.send('<h1>Selamat datang di API Project HRIS</h1>')
})

app.listen(port, () => {
    console.log('Berhasil Running di ' + port);
})