const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    imagePublicId: {
        type: String,
    }
    
},{ timestamps: true }) ;

module.exports = mongoose.model('Blog',blogSchema);