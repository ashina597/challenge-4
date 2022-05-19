import { v1 as uid} from 'uuid'
import {Request, RequestHandler, Response } from "express";
import mssql from 'mssql'
import sqlConfig from '../config/config';
import bcyrpt from 'bcrypt';
import dotenv from 'dotenv';
import {LoginSchema} from '../helpers/login';
import {Registerschema} from '../helpers/registration';
import jwt from 'jsonwebtoken';


dotenv.config()

//creating user
 export const createUser=async(req:Request,res:Response)=>{
    try {
        const id=uid()
        const{fullname,username, age, roles,email,user_password}= req.body as {fullname:string, 
            username:string, age:number, roles:string, email:string, user_password:string}
            const { error}= Registerschema.validate(req.body)

            if(error){
                return res.json({error:error.details[0].message})
            }
        let pool= await mssql.connect(sqlConfig)
        //encrpting password

        const hashed_pass = await bcyrpt.hash(user_password,10)

        await pool.request()
        .input('id' ,mssql.VarChar(100) , id)
        .input('fullname' ,mssql.VarChar(50) , fullname)
        .input('username' ,mssql.VarChar(50) , username)
        .input('email' ,mssql.VarChar(50) , email)
        .input('age' ,mssql.Int , age)
        .input('roles' ,mssql.VarChar(50) , roles)
        .input('user_password' ,mssql.VarChar(250) , hashed_pass)
        .execute('insertUser')
        res.status(200).json({message: 'USer Created Successfully'})
    } catch (error:any) {
        res.json({error:error.message})
    }
}

//read all users
export const getUsers:RequestHandler=async(req,res,next)=>{
 try {
    let pool= await mssql.connect(sqlConfig)
    const users= await pool.request().execute('getUsers')
        res.json(users.recordset)
 } catch (error:any) {
    res.json({error:error.message})
 }
}

//get one user
export const getUser:RequestHandler<{id:string}>=async(req,res)=>{
try {
    const{username} = req.body as {username:string}
    let pool= await mssql.connect(sqlConfig)
    const user= await pool.request()
    .input('username' ,mssql.VarChar , username)
    .execute('getUser')
        if(!user.recordset[0]){
            return res.json({message:`User with username : ${username} Does Not exist`})
        }
    res.json(user.recordset)
} catch (error:any) {
    res.json({error:error.message})
}
   
}

//updating a user
export const updateUser:RequestHandler<{id:string}>=async(req,res)=>{
   try {
    const id =req.params.id
    let pool= await mssql.connect(sqlConfig)
    const{fullname,username, age, roles,email,user_password}= req.body as {fullname:string, 
        username:string, age:number, roles:string, email:string, user_password:string}
    const user= await pool.request()
    .input('username' ,mssql.VarChar , username)
    .execute('getUser')
        if(!user.recordset[0]){
            return res.json({message:`User with id : ${id} Does Not exist`})
        }

        const hashed_pass= await bcyrpt.hash(user_password,10)
        
    await pool.request()
    .input('id' ,mssql.VarChar , id)
    .input('fullname' ,mssql.VarChar , fullname)
    .input('username' ,mssql.VarChar , username)
    .input('email' ,mssql.VarChar , email)
    .input('age' ,mssql.Int , age)
    .input('roles' ,mssql.VarChar , roles)
    .input('user_password' ,mssql.VarChar , hashed_pass)
    .execute('updateUser')
    res.json({message:"User Successfully Updated"})
   } catch (error:any) {
       res.json({error:error.message})
   }
}


interface RequestExtended extends Request{
    users?:any
}
export const deleteUser= async(req:RequestExtended,res:Response)=>{
   
   try {
    const {id} = req.body as {id:string}
    let pool= await mssql.connect(sqlConfig)
    const user= await pool.request()
    .input('id' ,mssql.VarChar , id)
    .execute('deleteUser')
  
    res.json({message:'User Deleted Successfully'})
   }  catch (error:any) {
    res.json({error:error.message
     }
        )
}
}

//login Endpoint
export const loginUser:RequestHandler=async(req,res)=>{
    try {
        let pool= await mssql.connect(sqlConfig)
        const{email,user_password}= req.body as { email:string, user_password:string}
        const { error}= LoginSchema.validate(req.body)

        if(error){
            return res.json({error:error.details[0].message})
        }
        

        const user= await pool.request()
        .input('email' ,mssql.VarChar(100) , email)
        .execute('login_user')
        if(!user.recordset[0]){
            res.json({message:`Invalid Credentials`})
        }
        const hashed_pass = user.recordset[0].user_password
        const valid_pass = await bcyrpt.compare(user_password, hashed_pass) 
        if (!valid_pass){
            res.json({message:'Invalid credentials'})
        }
        const data=user.recordset.map(record=>{
            const{user_password, ...rest} =record   
            
            return rest
    })

    let payload= await pool.request().query(
        ` SELECT fullname,email FROM Users
        WHERE email='${email}'
        `
    )

    payload = payload.recordset[0]

    const token = jwt.sign(payload, process.env.SECRET_KEY as string)
    res.json({message:"logged in successfully",data, token})
    

    } catch (error:any) {
         res.json(error.message)
    }
}

//homepage
export const homepage:RequestHandler=(req,res)=>{
    const{username}= req.body as {username:string}
    
    res.json({message:'Hello ${username} Welcome..'})

}

export const resetpassword:RequestHandler<{id:string}>=async(req,res)=>{
    try {
     const id =req.params.id
     let pool= await mssql.connect(sqlConfig)
     const{username,user_password} = req.body as {user_password:string,username:string}
     const user= await pool.request()
     .input('username' ,mssql.VarChar , username)
     .execute('getUser')
         if(!user.recordset[0]){
             res.json({message:`User with id : ${id} Does Not exist`})
         }
         else{
 
            const hashed_pass = await bcyrpt.hash(user_password,10)
         
     await pool.request()
     .input('id', mssql.VarChar(100), id)
     .input('user_password' ,mssql.VarChar ,hashed_pass)
     .execute('resetpassword')
    res.json({message:"paswword Successfully Updated"})}
   } catch (error:any) {
       res.json({error:error.message})
   }
}

