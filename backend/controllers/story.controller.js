import { Story } from "../models/story.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";


export const createStory = async (req, res) => {
    try {
        
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const fileUri = getDataUri(req.file); // Convert buffer to Data URI

        const result = await cloudinary.uploader.upload(fileUri, {
            folder: 'stories',
            resource_type: 'image'
        });

        const story = new Story({
            user: req.id,
            imageUrl: result.secure_url
        });

        await story.save();

        res.status(201).json({ success: true, story, message:'Story created successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error uploading image' });
    }
};

export const getUserStories = async (req, res) => {
    try {
        const stories = await Story.find({ user: req.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, stories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching your stories' });
    }
};

export const getAllStories = async (req, res) => {
    try {
        const stories = await Story.find()
            .sort({ createdAt: -1 })
            .populate('user', 'firstname lastname profilePicture');
        res.status(200).json({ success: true, stories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching all stories' });
    }
};

export const deleteStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ success: false, message: 'Story not found' });
        }

        if (story.user.toString() !== req.id) {
            return res.status(403).json({ success: false, message: 'You are not allowed to delete this story' });
        }

        await story.deleteOne();

        res.status(200).json({ success: true, message: 'Story deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting story' });
    }
};