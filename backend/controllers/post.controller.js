import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const createPost = async (req, res) => {
    try {
        const userId = req.id;

        const { content } = req.body;
        const file = req.file;
        

        if (!file) {
            return res.status(400).json({ message: "Image is required" });
        }

        //Image upload
        const optimizedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        //buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri)
        const post = await Post.create({
            content,
            image: cloudResponse.secure_url,
            user: userId
        });
        const user = await User.findById(userId)
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'user', select: '-password' });


        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        })

    } catch (error) {
        console.log('error creating post', error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

export const getAllPost = async (_, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'user', select: 'firstname lastname profilePicture' }).populate({path:'comments', populate:{
                path: 'userId',
                select: 'firstname lastname profilePicture'
            }})
        // .populate({
        //     path: 'comments',
        //     sort: { createdAt: -1 },
        //     populate: {
        //         path: 'author',
        //         select: 'firstname lastname username profilePicture'
        //     }
        // });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ user: authorId }).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: 'firstname lastname image'
        })
        // .populate({
        //     path: 'comments',
        //     sort: { createdAt: -1 },
        //     populate: {
        //         path: 'author',
        //         select: 'firstname lastname username profilePicture'
        //     }
        // })
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const getPostByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!userId) {
            return res.status(400).json({
                message: "UserId is require to get user post",
                success: false
            })
        }

        const posts = await Post.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('user', '_id firstname lastname profilePicture email')
        // .populate({
        //     path: 'comments.user',
        //     select: 'username, profilePicture'
        // })
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        if (post.user.toString() !== authorId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this post' });
        }

        // Delete post
        await Post.findByIdAndDelete(postId);

        // Delete related comments
        // await Comment.deleteMany({ postId: blogId });


        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting post", error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.postId
        const {content } = req.body;
        const file = req.file;

        let post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:"Post not found!"
            })
        }
        let photo;
        if (file) {
            const fileUri = getDataUri(file)
            photo = await cloudinary.uploader.upload(fileUri)
        }

        const updateData = {content, user: req.id, image: photo?.secure_url};
        post = await Post.findByIdAndUpdate(postId, updateData, {new:true});

        res.status(200).json({ success: true, message: "post updated successfully", post });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating post", error: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const likeKrneWalaUserKiId = req.id;
        const post = await Post.findById(postId).populate({path:'likes'});
        if (!post) return res.status(404).json({ message: 'Post not found', success: false })

        //like logic started
        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
        await post.save();


        return res.status(200).json({ message: 'Post liked', post, success: true });
    } catch (error) {
        console.log(error);

    }
}


export const dislikePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false })

        //dislike logic started
        await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await post.save();

        return res.status(200).json({ message: 'Post disliked', post, success: true });
    } catch (error) {
        console.log(error);

    }
}
