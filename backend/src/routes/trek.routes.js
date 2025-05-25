const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

const { createTrek,getAllTreks,updateTrek,deleteReview,deleteTrek,addReview,updateReview,getTrekById } = require('../controllers/trek.controller');

//trek routes
router.post("/", protect, upload.single("image"), createTrek);
router.get("/",getAllTreks);
router.get("/:id", getTrekById);
router.put("/:id", protect, upload.single("image"), updateTrek);
router.delete("/:id", protect, deleteTrek);

//Review routes
router.post("/:id/reviews", protect, addReview);
router.put("/:id/reviews/:reviewId", protect, updateReview);
router.delete("/:id/reviews/:reviewId", protect, deleteReview);

module.exports = router;
