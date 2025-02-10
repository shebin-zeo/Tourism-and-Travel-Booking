// models/blogPost.model.js
import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      default: '',
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    username: {           // New field for storing the user's name
      type: String,
      required: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to a User model (if available)
      required: true,
    },
    approved: {
      type: Boolean,
      default: false, // Not visible to public until approved by admin
    },
  },
  { timestamps: true }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
