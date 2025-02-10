// controllers/blog.controller.js
import BlogPost from '../models/blogPost.model.js';

// Create a blog post (user submission)
export const createBlogPost = async (req, res, next) => {
  try {
    const { title, content, review, images } = req.body;
    // Ensure req.user is populated by authentication middleware.
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const blogPost = await BlogPost.create({
      title,
      content,
      review,
      images, // Must match your model's field name
      author: req.user.id,
      approved: false, // Default to not approved until admin approves
    });
    return res.status(201).json({ success: true, blogPost });
  } catch (error) {
    next(error);
  }
};

// Get all approved blog posts (public)
export const getApprovedBlogPosts = async (req, res, next) => {
  try {
    const blogPosts = await BlogPost.find({ approved: true }).populate('author', 'name');
    return res.status(200).json({ success: true, blogPosts });
  } catch (error) {
    next(error);
  }
};

// Get a single blog post (only if approved, unless admin)
export const getBlogPostById = async (req, res, next) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id).populate('author', 'name');
    if (!blogPost) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    // If not approved and the user is not an admin, return 403.
    if (!blogPost.approved && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Blog post not approved yet' });
    }
    return res.status(200).json({ success: true, blogPost });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all blog posts (for moderation)
export const getAllBlogPosts = async (req, res, next) => {
  try {
    // Populate the 'author' field with 'username' and 'email' from the User model.
    const blogPosts = await BlogPost.find({})
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blogPosts });
  } catch (error) {
    next(error);
  }
};
// ADMIN: Approve a blog post
export const approveBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogPost = await BlogPost.findByIdAndUpdate(id, { approved: true }, { new: true });
    if (!blogPost) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    return res.status(200).json({ success: true, blogPost });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Delete a blog post
export const deleteBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogPost = await BlogPost.findByIdAndDelete(id);
    if (!blogPost) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    return res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
