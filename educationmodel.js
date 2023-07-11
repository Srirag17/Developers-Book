const mongoose = require('mongoose');


const educationSchema = new mongoose.Schema({
    school:{
         type : String,
         required : true,
        },
    degree:{
        type : String,
        required : true,
        },
    field:{
        type : String,
        required : true,
        },   
    fromdate:{
        type : Number,
        required : true,
        }, 
    todate:{
        type : Number,
        required : true,
        },
    programdescription:{
        type : String,
        }
});

const Education = mongoose.model('Education', educationSchema);

module.exports = Education;