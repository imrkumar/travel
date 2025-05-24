const Blog = require("../models/blog.model");
const tryCatchAsync = require("../utils/tryCatchAsync");
const cloudinary = require("../config/cloudinary");

exports.createBlog = tryCatchAsync(async (req, res) => {
  const { title, description } = req.body;
  console.log("req.file =", req.file); // Should NOT be undefined if file uploaded
  console.log("req.body =", req.body);
  let image = "";
  let imagePublicId = "";
  if (req.file) {
    image = req.file.path;
    imagePublicId = req.file.filename;
  }

  const blog = await Blog.create({
    title,
    description,
    image,
    imagePublicId,
  });
  res.status(201).json(blog);
});

exports.getAllBlogs = tryCatchAsync(async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

exports.getBlogById = tryCatchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
});

exports.updateBlog = tryCatchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  const { title, description } = req.body;
  if (req.file) {
    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    blog.image = req.file.path;
    blog.imagePublicId = req.file.filename;
  }
  if (title) blog.title = title;
  if (description) blog.description = description;

  await blog.save();
  res.json(blog);
});

exports.deleteBlog = tryCatchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) return res.status(404).json({ message: "Blog not found" });

    if(blog.imagePublicId) {
        await cloudinary.uploader.destroy(blog.imagePublicId);
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message : "Blog deleted successfully" });
});
