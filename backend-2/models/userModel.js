const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {name:{type:String, required:true, trim:true},
    email:{type:String, required:true, unique:true,lowercase: true, trim:true},
    role:{type:String, enum:['admin','user'], default:'user'},
    isActive:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now}
});
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;