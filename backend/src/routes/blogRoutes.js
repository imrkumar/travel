const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {createBlog,getAllBlogs,getBlogById,updateBlog, deleteBlog, likeBlog, dislikeBlog, getComments, updateComment, deleteComment, addComment} = require("../controllers/blog.controller");
const protect = require('../middleware/authMiddleware');

router.post("/", upload.single("image"), createBlog);

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id",deleteBlog);

//Reactions
router.get("/:id/like", protect,likeBlog);
router.get("/:id/dislike",protect, dislikeBlog);

//comments 
router.post("/:id/comments",protect, addComment);
router.get("/:id/comments", getComments);
router.put("/comments/:commentId",protect, updateComment);
router.delete("/comments/:commentId", protect,deleteComment);


module.exports = router;
