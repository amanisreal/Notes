const mongoose = require('mongoose');
require('../mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type:String, 
        required:  true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        },
        unique: true,
    },
    password: {
       type:String,
       required: true,
       validate(value){
        if(value.length<6){
            throw new Error('Password cant be less than 6 characters')
        }
        if(value.includes('password')){
            throw new Error('Password cant contain password')
        }
       } 
    },
    age:{
        type:Number,
        default: 0
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save',async  function(next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.methods.generateToken = async function () {
    const user = this;
    const jwtToken = jwt.sign({_id: user.id.toString()}, 'thisismynewcourse')
    user.tokens = user.tokens.concat({token: jwtToken});
    await user.save();
    return jwtToken;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email});
    if(!user){
        throw new Error('No user exist');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Invalid email and password');
    }
    return user;
}

const User = mongoose.model('user', userSchema)

module.exports = User;