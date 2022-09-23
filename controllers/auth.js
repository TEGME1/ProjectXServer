import express from 'express'
import db from '../config.js';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { async } from '@firebase/util';
import bcrypt from 'bcrypt';
const controller={}
controller.postLogin=async (req,res,next)=>
{
    const { username, password } = req.body
    console.log(req.body)

    try {
        const db_collection = collection(db, 'usersdata2')
        const db_query = query(db_collection, where('username', '==', username))
        const docs = await getDocs(db_query)
        const records = docs.docs.map(doc => doc.data())

        if (records.length === 0) {
            res.status(404).send({
                status: 404,
                message: 'User not found'
            })
        } else 
        {
            bcrypt.compare(password,records[0].password)
            .then(doMatch=>
                {
                    if(doMatch)//password matched
                    {
                        res.status(200).send({
                            status: 200,
                            message: 'Logged In'
                        })

                    }
                    else
                    {
                        res.status(401).send({
                            status: 401,
                            message: 'Wrong password'
                        })
                    }
                })
        .catch(err=>
            {
                console.log(err)
            }
            )
        
         }
    

}
catch (error) {
    console.log('Error')
    res.status(500).send({
        status: 500,
        message: error
    })
}
}
controller.postSignUp=async (req, res,next) => {
    const { username, email, password } = req.body
    console.log(req.body)
    try {
        const db_collection = collection(db, 'usersdata2')
        const db_query = query(db_collection, where('username', '==', username))
        const docs = await getDocs(db_query)
        const records = docs.docs.map(doc => doc.data())
        if (records.length !== 0) {
            res.status(409).send({
                status: 409,
                message: 'User already exists'
            })
        }
        else {
            const newUser={};
            newUser.username=username;
            newUser.email=email;
            bcrypt.hash(password,8)
            .then(async cryptedPass=>
                {
                    newUser.password=cryptedPass;
                    const addingReference = await addDoc(db_collection, newUser)
                    res.status(200).send({
                        status: 200,
                        message: 'User Added',
                        data: records[0]
                    })
                    console.log('User added')
                })
            .catch(err=>{console.log(err)})
            
            
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: error
        })
    }
}
export default controller