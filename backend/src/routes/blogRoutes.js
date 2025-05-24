const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {createBlog,getAllBlogs,getBlogById,updateBlog, deleteBlog } = require("../controllers/blog.controller");

router.post("/", upload.single("image"), createBlog);

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id",deleteBlog);

module.exports = router;
