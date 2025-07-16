const Post = require('../models/Post');
const User = require('../models/User');

const getPosts = async (req, res) => {
  try {
    const { search, category, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    
    // Build query object
    let query = {};
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination and sorting
    const posts = await Post.find(query)
      .populate('user', 'name')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalPosts: total,
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user', 'name').populate('comments.user', 'name');
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};

const createPost = async (req, res) => {
  const { title, content, image, summary, category = 'Other' } = req.body;

  const post = new Post({
    title,
    content,
    image,
    summary: summary || content.substring(0, 150) + '...', // Auto-generate summary if not provided
    category,
    user: req.user._id,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
};

const updatePost = async (req, res) => {
  const { title, content, summary, category } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    post.title = title;
    post.content = content;
    post.summary = summary || content.substring(0, 150) + '...'; // Auto-generate summary if not provided
    if (category) post.category = category;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: 'Post removed' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const likePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        if (post.likes.includes(req.user._id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }
        await post.save();
        res.json(post.likes);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
};

const commentOnPost = async (req, res) => {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (post) {
        const comment = {
            text,
            user: req.user._id,
        };
        post.comments.push(comment);
        await post.save();
        res.status(201).json(post.comments);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
};

const savePost = async (req, res) => {
    const user = await User.findById(req.user._id);
    const post = await Post.findById(req.params.id);

    if (user && post) {
        if (user.savedPosts.includes(post._id)) {
            user.savedPosts = user.savedPosts.filter(id => id.toString() !== post._id.toString());
        } else {
            user.savedPosts.push(post._id);
        }
        await user.save();
        res.json(user.savedPosts);
    } else {
        res.status(404).json({ message: 'User or Post not found' });
    }
};


module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentOnPost,
  savePost,
};