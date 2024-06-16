
const User = require('../models/user-model');
const Group= require('../models/group-model');

// Create a new group
const createGroup = async (req, res) => {
    try {
        const group = new Group({ ...req.body, creator: req.user.id });
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an existing group
const updateGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a group
const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a group by ID
const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('members', 'name email profilePicture');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all groups
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate('members', 'name email profilePicture');
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Join a group
const joinGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (!group.members.includes(req.user.id)) {
            group.members.push(req.user.id);
            await group.save();
        }
        res.status(200).json({ message: 'Joined group successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leave a group
const leaveGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        group.members = group.members.filter(memberId => memberId.toString() !== req.user.id);
        await group.save();
        res.status(200).json({ message: 'Left group successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupById,
    getAllGroups,
    joinGroup,
    leaveGroup
};
