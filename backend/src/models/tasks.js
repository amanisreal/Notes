const express = require('express');
const mongoose = require('mongoose');

const taskSchema  = new mongoose.Schema({
    title: {
        type: String,
    },
    description:{
        type:String,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Task = mongoose.model('task', taskSchema);

module.exports = Task 