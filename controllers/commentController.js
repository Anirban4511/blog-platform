import Comment from "../models/Comment.js";  
import Post from "../models/Post.js";        


export const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if post is published
    if (!post.published) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = await Comment.create({
      content,
      post: req.params.postId,
      author: req.user._id,
    });

    // Populate author details
    await newComment.populate("author", "username");

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};


export const getComments = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);


    const post = await Post.findById(req.params.postId);
    if (!post || !post.published) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate("author", "username");

    const totalComments = await Comment.countDocuments({
      post: req.params.postId,
    });

    res.json({
      comments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalComments / parseInt(limit)),
      totalComments,
    });
  } catch (error) {
    next(error);
  }
};


export const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    comment.content = content;
    await comment.save();

    
    await comment.populate("author", "username");

    res.json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

 
    const post = await Post.findById(comment.post);

    // Check if user is either comment author or post author
    if (
      comment.author.toString() !== req.user._id.toString() &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted successfully" });
  } catch (e) {
    console.log("error", e);
  }
};


export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }


    if (comment.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Comment already liked' });
    }

    // Add user to likes array
    comment.likes.push(req.user._id);
    await comment.save();

    res.json({
      message: 'Comment liked successfully',
      likes: comment.likes.length
    });
  } catch (error) {
    next(error);
  }
};

export const unlikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

  
    if (!comment.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Comment not liked yet' });
    }

   
    comment.likes = comment.likes.filter(
      like => like.toString() !== req.user._id.toString()
    );
    await comment.save();

    res.json({
      message: 'Comment unliked successfully',
      likes: comment.likes.length
    });
  } catch (error) {
    next(error);
  }
};
