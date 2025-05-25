const Trek = require('../models/trek.model');
const tryCatchAsync = require("../utils/tryCatchAsync");
const cloudinary = require('../config/cloudinary');

exports.createTrek = tryCatchAsync(async (req,res) => {
    const { name, location, shortDescription, longDescription, duration, bestTimeToVisit, rating } = req.body;

    let image = "";
    let imagePublicId = "";

    if(req.file) {
        image = req.file.path;
        imagePublicId = req.file.filename;
    }

    const trek = await Trek.create({
        name,location,shortDescription,longDescription,duration,bestTimeToVisit,rating,image,imagePublicId
    });
    res.status(201).json(trek);
});

exports.getAllTreks = tryCatchAsync(async (req, res) => {
    const treks = await Trek.find();
    res.json(treks);
});

exports.getTrekById = tryCatchAsync(async (req, res) => {
    const trek = await Trek.findById(req.params.id);
    if(!trek) return res.status(404).json({ message: "Trek not found" });
    res.json(trek);
});

exports.updateTrek = tryCatchAsync(async (req, res) => {
    const trek = await Trek.findById(req.params.id);
    if(!trek) return res.status(404).json({ message: "Trek no found" });

    const { name, location, shortDescription, longDescription, duration, bestTimeToVisit, rating } = req.body;

    if(req.file) {
        if(trek.imagePublicId) {
            await cloudinary.uploader.destroy(trek.imagePublicId);
        }
        
        trek.image = req.file.path;
        trek.imagePublicId = req.file.filename;
    }

    trek.name = name || trek.name;
    trek.location = location || trek.location;
    trek.shortDescription = shortDescription || trek.shortDescription;
    trek.longDescription = longDescription || longDescription;
    trek.duration = duration || trek.duration;
    trek.bestTimeToVisit = bestTimeToVisit || trek.bestTimeToVisit;
    trek.rating = rating || trek.rating;

    await trek.save();
    res.json(trek);
});

exports.deleteTrek = tryCatchAsync(async(req, res) => {
    const trek = await Trek.findById(req.params.id);
    if(!trek) return res.status(404).json({ message: "Trek not found" });

    if(trek.imagePublicId){
        await cloudinary.uploader.destroy(trek.imagePublicId);
    }

    await trek.deleteOne();
    res.json({ message: "Trek deleted successfully" });
});

exports.addReview = tryCatchAsync(async (req, res) => {
    const { rating, comment } = req.body;
    const trek = await Trek.findById(req.params.id);
    if(!trek) return res.status(404).json({ message: "Trek not found" });

    trek.reviews.push({
        author: {
            id: req.user._id,
            name: req.user.name,
        },
        rating,
        comment
    });
    await trek.save();
    res.status(201).json(trek.reviews);
});

exports.updateReview = tryCatchAsync(async (req, res) => {
    const { rating, comment} = req.body;
    const { reviewId } = req.params;
    const trek = await Trek.findOne({ "reviews._id": reviewId });
    if(!trek) return res.status(404).json({ message: "Review not found"});

    const review = trek.reviews.id(reviewId);
    if(review.author.id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to edit this review" });
    }
    if(rating) review.rating = rating;
    if(comment) review.comment = comment;

    await trek.save();
    res.json(review);
});

exports.deleteReview = tryCatchAsync(async (req, res) => {
    const { reviewId } = req.params;
    const trek = await Trek.findOne({ "reviews._id": reviewId });
    if(!trek) return res.status(404).json({ message: "Review not found" });

    const review = trek.reviews.id(reviewId);
    if(review.author.id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to delete this review"});
    }
    trek.reviews.pull(review._id);
    await trek.save();
    
    res.json({ message: "Review deleted successfully" });
});