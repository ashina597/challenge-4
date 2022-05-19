import express from 'express'
import mssql from 'mssql'
import router from './Routes/user.routes'
import sqlConfig from './config/config'

console.log("opening port...");

const app= express()
 app.use(express.json())
app.use('/user',router)
 app.listen(5000, ()=>{
     console.log('App running on part 5000 ...');
     
 })


const checkConnection=async ()=>{
await mssql.connect(sqlConfig).then(
     x=>{
        if( x.connected){
            console.log('Database Connected');
          
        }
     }
 ).catch(err=>{
     console.log(err.message);
 })
 }

 checkConnection()