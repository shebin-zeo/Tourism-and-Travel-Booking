// routes/blog.routes.js
import express from 'express';
import {
  createBlogPost,
  getApprovedBlogPosts,
  getBlogPostById,
  getAllBlogPosts,
  approveBlogPost,
  deleteBlogPost,
} from '../controllers/blog.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Middleware that populates req.user
import { verifyAdmin } from '../utils/verifyAdmin.js'; // Middleware to check if the user is admin

const router = express.Router();

// Public endpoints for approved blog posts
router.get('/', getApprovedBlogPosts);
router.get('/:id', getBlogPostById);

// Protected endpoint for creating a blog post (requires authentication)
router.post('/create', verifyToken, createBlogPost);

// ADMIN endpoints (moderation)
router.get('/admin/all', verifyToken, verifyAdmin, getAllBlogPosts);
router.put('/admin/approve/:id', verifyToken, verifyAdmin, approveBlogPost);
router.delete('/admin/:id', verifyToken, verifyAdmin, deleteBlogPost);

export default router;
