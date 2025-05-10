import Post from '../models/Post.js';
import jwt from 'jsonwebtoken';
import Comment from '../models/Comment.js';

export const createPost = async (req, res, next) => {
  try {
    const { title, content, tags, published } = req.body;

    const newPost = await Post.create({
      title,
      content,
      author: req.user._id,
      tags: tags || [],
      published: published !== undefined ? published : true
    });

    await newPost.populate('author', 'username bio');

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    next(error);
  }
};


export const getPosts = async (req, res, next) => {
  try {
    const { tag, author, limit = 10, page = 1 } = req.query;
    const query = { published: true };

    if (tag) {
      query.tags = tag;
    }

    if (author) {
      query.author = author;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('author', 'username bio');

    const totalPosts = await Post.countDocuments(query);

    res.json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / parseInt(limit)),
      totalPosts
    });
  } catch (error) {
    next(error);
  }
};


export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username bio');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }


    if (!post.published) {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return res.status(404).json({ message: 'Post not found' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        if (post.author._id.toString() !== decoded.id) {
          return res.status(404).json({ message: 'Post not found' });
        }
      } catch (err) {
        return res.status(404).json({ message: 'Post not found' });
      }
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};


export const updatePost = async (req, res, next) => {
  try {
    const { title, content, tags, published } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }


    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }


    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (published !== undefined) post.published = published;

    post.updatedAt = Date.now();

    await post.save();
    await post.populate('author', 'username bio');

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    next(error);
  }
};


export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }


    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    await Comment.deleteMany({ post: req.params.id });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.published) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.json({
      message: 'Post liked successfully',
      likes: post.likes.length
    });
  } catch (error) {
    next(error);
  }
};


export const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.published) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post not liked yet' });
    }


    post.likes = post.likes.filter(
      like => like.toString() !== req.user._id.toString()
    );
    await post.save();

    res.json({
      message: 'Post unliked successfully',
      likes: post.likes.length
    });
  } catch (error) {
    next(error);
  }
};
