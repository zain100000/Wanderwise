const User = require("../models/user-model");

// Send friend request
const sendFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.body.friendId);

    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!friend.pendingFriendRequests.includes(user.id)) {
      friend.pendingFriendRequests.push(user.id);
      await friend.save();
    }

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.body.friendId);

    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    user.pendingFriendRequests = user.pendingFriendRequests.filter(
      (id) => id.toString() !== friend.id.toString()
    );
    if (!user.friends.includes(friend.id)) {
      user.friends.push(friend.id);
    }

    if (!friend.friends.includes(user.id)) {
      friend.friends.push(user.id);
    }

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.body.friendId);

    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    user.pendingFriendRequests = user.pendingFriendRequests.filter(
      (id) => id.toString() !== friend.id.toString()
    );
    await user.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove friend
const removeFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.body.friendId);

    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friends = user.friends.filter(
      (id) => id.toString() !== friend.id.toString()
    );
    friend.friends = friend.friends.filter(
      (id) => id.toString() !== user.id.toString()
    );

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get friend list
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "name email profilePicture"
    );
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
};
