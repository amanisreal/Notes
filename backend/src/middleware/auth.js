const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'thisismynewcourse');
        
        const user = await User.findOne({_id: decode._id, 'tokens.token': token});
        if(!user){
            throw new Error('Invalid user');
        }
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        res.status(401).send('Please Authenticate');
    }
}

module.exports = auth;