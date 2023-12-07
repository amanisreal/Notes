const express = require('express');
const  User = require("../models/users");
const Task = require('../models/tasks');
require('../mongoose')
const auth = require('../middleware/auth')
const router = express.Router();


//get request
// router.get('/tasks', async (req, res) => {
//     const tasks = await Task.find({});
//     res.send(tasks);
// })

//post request
router.post('/user', async (req, res) => {
    const u = req.body;
    try{
        const user = new User(u);
        const token = user.generateToken();
        //await user.save();
        res.send(user);
    }catch(e){
        res.status(500).send(e);
    }
})

//patch
router.patch('/userS', auth, async (req, res) => {
    const id = req.user._id;
    try{
        const user = await req.user;
        // if(!user){
        //     res.status(404).send("NO user found")
        // }
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const updatesMade = Object.keys(req.body);

        const updateOK = updatesMade.every((update) => {
            return allowedUpdates.includes(update);
        })

        if(!updateOK){
            throw new Error('Invalid Updates made')
        }

        updatesMade.forEach((update) => {
            user[update] = req.body[update];
        })

        await user.save();
        res.send(user);
    
    }catch(e){
        res.status(500).send(e);
    }
})

//delete
router.delete('/user', auth, async (req, res) => {
    const _id = req.user._id

    try{
        const user = await User.findById({_id: _id});
        if(!user){
            throw new Error('Invalid user');
        }
        await User.findByIdAndDelete({_id:_id});
        res.send('User deleted');
    }catch(e){
        res.status(500).send(e);
    }
})

//login user
router.post('/user/login', async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateToken();
        if(!user){
            res.send('No user found');
        }
        res.send({user, token});
    }catch(e){
        res.status(500).send(e);
    }
})  

//me
router.get('/user/me', auth, async(req, res) => {
    res.send(req.user);
})


//log out
router.post('/user/logout', auth, async(req, res) => {
    try{
        const user = req.user;
        user.tokens = await user.tokens.filter((token) => {
            return user.tokens.token !== token;
        })
    
        await user.save();
        res.send('Logout')
    }catch(e){
        res.status(500).send(e);
    }
})


module.exports = router;