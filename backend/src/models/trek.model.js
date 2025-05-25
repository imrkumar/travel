const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    author: { 
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        }
    },
    rating: { type: Number, required: true , min: 1, max: 5},
    comment: { type: String, required: true },
},{ timestamps: true });

const trekSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    image: { type: String },
    imagePublicId: { type: String },
    duration: { type: String},
    bestTimeToVisit: { type: String},
    rating: { type: Number, default: 0 },
    reviews: [reviewSchema]
},{ timestamps: true });

module.exports = mongoose.model("Trek", trekSchema);