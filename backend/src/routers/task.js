const express = require('express');
require('../mongoose')
const auth = require('../middleware/auth')
const Task = require('../models/tasks')
const router = express.Router();

//get request
router.get('/tasks', auth, async (req, res) => {``
    const tasks = await Task.find({owner: req.user._id.toString()});
    res.send(tasks);
})

//post request
router.post('/tasks', auth, async (req, res) => {
    const t = {...req.body, owner: req.user._id};
    try{
        const task = new Task(t);
        await task.save();
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
})

//patch
router.patch('/task/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try{
        const task = await Task.findById({_id: _id});
        if(!task){
            res.send('No task exists with such id');
        }
        if(req.user._id.toString() !== task.owner.toString()){
            throw new Error('Invalid user')
        }
        const allowedUpdates = ['title', 'description'];
        const updatesMade = Object.keys(req.body);

        const isAllowed = updatesMade.every((update) => {
            return allowedUpdates.includes(update);
        })

        if(!isAllowed){
            res.send('Invalid updates');
        }

        updatesMade.forEach((update) => {
            task[update] = req.body[update];
        })

        await task.save();
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
})

//delete
router.delete('/task/:id', auth, async (req, res) => {
    const id = req.params.id;
    try{
        const task = await Task.findById({_id: id});
        if(!task){
            res.semd('Invalid task');
        }

        if(req.user._id.toString() !== task.owner.toString()){
            throw new Error('Invalid user');
        }

        await Task.findByIdAndDelete({_id: id});
        res.send(task);

    }catch(e){
        res.status(500).send(e);
    }
})

module.exports = router;