import express from 'express'
import db from '../config.js';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { async } from '@firebase/util';

const AuthenticationRoutes = express.Router()

AuthenticationRoutes.post('/login', async (req, res) => {
    const { username, password } = req.body
    console.log(req.body)

    try {
        const db_collection = collection(db, 'usersdata')
        const db_query = query(db_collection, where('username', '==', username))
        const docs = await getDocs(db_query)
        const records = docs.docs.map(doc => doc.data())

        if (records.length === 0) {
            res.status(404).send({
                status: 404,
                message: 'User not found'
            })
        } else if (records[0].password !== password) {
            res.status(401).send({
                status: 401,
                message: 'Wrong password'
            })
        } else {
            res.status(200).send({
                status: 200,
                message: 'Logged In'
            })
        }
    }
    catch (error) {
        console.log('Error')
        res.status(500).send({
            status: 500,
            message: error
        })
    }

})

AuthenticationRoutes.post('/signup', async (req, res) => {
    const { username, email, password } = req.body
    console.log(req.body)
    try {
        const db_collection = collection(db, 'usersdata')
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
            const addingReference = await addDoc(db_collection, req.body)
            res.status(200).send({
                status: 200,
                message: 'User Added',
                data: records[0]
            })
            console.log('User added')
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: error
        })
    }
})

export default AuthenticationRoutes

