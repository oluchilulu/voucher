const mongoose = require("mongoose")
const {Schema} = mongoose
const users = new Schema({
        username:{
        type:  String,
        require: true, 
        unique:true,
        trim:true,
        },

        fullname:{
        type:  String,
        require: true, 
        unique:true,
        trim:true,
        },

       course:{
        type: String,
        requiretrue:true,
        // minlenght:[10, 'fullname must be above 10'],
        trim:true,
       },

       passport:{
        type: String,
        require:true,
        trim:true,
       },


 age:{
        type: String,
        require:true,
        trim:true,
       },

//kelvin powell
        password:{
        type:  String,
        require: true, 
        trim:true,
        },

        role:{
        type:  String,
        require: true, 
        },

        active:{
        type:  Boolean,
        require: true, 
        },

    })

module.exports = mongoose.model('School', users);


