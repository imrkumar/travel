const Blog = require("../models/blog.model");
const tryCatchAsync = require("../utils/tryCatchAsync");
const cloudinary = require("../config/cloudinary");
const mongoose = require('mongoose');

exports.createBlog = tryCatchAsync(async (req, res) => {
  const { title, description, shortDescription } = req.body;

  let image = "";
  let imagePublicId = "";
  if (req.file) {
    image = req.file.path;
    imagePublicId = req.file.filename;
  }

  const blog = await Blog.create({
    title,
    description,
    shortDescription,
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
  const { title, description, shortDescription } = req.body;
  if (req.file) {
    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    blog.image = req.file.path;
    blog.imagePublicId = req.file.filename;
  }
  if (title) blog.title = title;
  if (description) blog.description = description;
  if(shortDescription) blog.shortDescription = shortDescription;

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

exports.likeBlog = tryCatchAsync(async (req, res) => {
    const userId = req.user._id;

    const blog = await Blog.findById(req.params.id);
    if(!blog) return res.status(404).json({ message: "Blog not found" });

    if(blog.likedBy.includes(userId)) {
        return res.status(400).json({ message: "You already liked this blog" });
    }

    if(blog.dislikedBy.includes(userId)) {
        blog.dislikedBy.pull(userId);
        blog.dislikes = Math.max(blog.dislikes - 1, 0);
    }

    blog.likedBy.push(userId);
    blog.likes += 1;

    await blog.save();
    res.json(blog);
});

exports.dislikeBlog = tryCatchAsync(async (req, res) => {
    const userId = req.user._id;
    const blog = await Blog.findById(req.params.id);
    if(!blog) return res.status(404).json({ message: "Blog not found" });

    if(blog.dislikedBy.includes(userId)) {
        return res.status(400).json({ message: "You already disliked this blog" });
    }

    if(blog.likedBy.includes(userId)) {
        blog.likedBy.pull(userId);
        blog.likes = Math.max(blog.likes - 1, 0);
    }
    blog.dislikedBy.push(userId);
    blog.dislikes += 1;

    await blog.save();
    res.json(blog);
});

exports.addComment = tryCatchAsync(async (req, res) => {
    const { content } = req.body;
    const blog = await Blog.findById(req.params.id);
    if(!blog) return res.status(404).json({ message: "Blog not found" });
    console.log("data", req.user._id, req.user.name);

    const newComment = blog.comments.create({
        author: {
            id: new mongoose.Types.ObjectId(req.user._id),
            name: req.user.name
        },
        content
    });
    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json(blog.comments);
})

exports.getComments = tryCatchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog.comments);
})

exports.updateComment = tryCatchAsync(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    const blog = await Blog.findOne({ "comments._id": commentId });
    if(!blog) return res.status(404).json({ message: "Comment not found" });

    const comment = blog.comments.id(commentId);

    if(comment.author.id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to update this comment" });
    }
    comment.content = content;

    await blog.save();
    res.json(comment);
})

exports.deleteComment = tryCatchAsync(async (req, res) => {
    const { commentId } = req.params;
    const blog = await Blog.findOne({ "comments._id" : commentId });
    if(!blog) return res.json(404).json({ message: "Comment not found" });

    const comment = blog.comments.id(commentId);

    if(comment.author.id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this comment"});
    }

    blog.comments = blog.comments.filter((c) => c._id.toString() !== commentId);
    await blog.save();
    res.json({ message: "Comment deleted"});
})
