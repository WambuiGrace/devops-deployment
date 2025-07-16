const User = require('../models/User');

const getSavedPosts = async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedPosts');
  if (user) {
    res.json(user.savedPosts);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

module.exports = {
  getSavedPosts,
  getUserById,
  updateUser,
  deleteUser,
  getUsers,
};