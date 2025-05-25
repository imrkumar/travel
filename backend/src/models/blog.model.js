const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: { 
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User",
        },
        name: {
            type: String,
            required: false,
        }
     },
    content: { type: String, required: true },
},{timestamps: true});

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    shortDescription: {
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
    },
    comments: [commentSchema],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    
},{ timestamps: true });

module.exports = mongoose.model('Blog',blogSchema);