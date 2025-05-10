import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, bio, password } = req.body;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (password) user.password = password;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio
      }
    });
  } catch (error) {
    // Check for duplicate username/email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Username or email already exists' 
      });
    }
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};


export const getUserPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.id;
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's posts with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await Post.find({ 
      author: userId,
      published: true  
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('author', 'username bio');
    
    const totalPosts = await Post.countDocuments({ 
      author: userId,
      published: true
    });
    
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


export const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all user's posts
    await Post.deleteMany({ author: userId });

    // Delete all user's comments
    await Comment.deleteMany({ author: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Profile and associated data deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('-password') 
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalUsers = await User.countDocuments(query);

    res.json({
      users,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / parseInt(limit)),
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};


export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select('-password')
      .populate({
        path: 'posts',
        select: 'title content createdAt',
        options: { sort: { createdAt: -1 }, limit: 5 }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const postCount = await Post.countDocuments({ author: userId });
    const commentCount = await Comment.countDocuments({ author: userId });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt,
        stats: {
          posts: postCount,
          comments: commentCount
        },
        recentPosts: user.posts
      }
    });
  } catch (error) {
    next(error);
  }
};


export const updateUserAdminStatus = async (req, res, next) => {
  try {
    const { isAdmin } = req.body;
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.json({
      message: 'User admin status updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    next(error);
  }
};
