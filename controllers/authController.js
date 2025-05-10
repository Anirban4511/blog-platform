import User from '../models/User.js'; 
import { registerSchema, loginSchema } from '../utils/validators.js';

export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, bio, password } = req.body;
    const userId = req.user._id;
    
    // Get user
    const user = await User.findById(userId);
    
    // Check if user exists
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
    
    const Post = require('../models/Post.js');
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

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }


    const user = await User.create({
      username,
      email,
      password
    });


    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
  
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

   
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};
