import Comment from "../models/comment.model.js";
import { Post } from "../models/post.model.js";

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id
    const commentKrneWalaUserKiId = req.id;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!content) return res.status(400).json({ message: 'text is required', success: false });

    const comment = await Comment.create({
      content,
      userId: commentKrneWalaUserKiId,
      postId: postId
    })

    await comment.populate({
      path: 'userId',
      select: 'firstname lastname profilePicture'
    })



    post.comments.push(comment._id);
    await post.save()
    return res.status(201).json({
      message: 'Comment Added',
      comment,
      success: true
    })
  } catch (error) {
    console.log(error);

  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const authorId = req.id
    const comment = await Comment.findById(commentId);
    console.log(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    if (comment.userId.toString() !== authorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
    }

    const postId = comment.postId;

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // Remove comment ID from post's comments array
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId }
    });

    res.status(200).json({ success: true, message: 'Comment deleted Successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting comment", error: error.message });

  }
}

export const likeComment = async (req, res) => {
  try {
    const userId = req.id;
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId).populate("userId");
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      // If already liked, unlike it
      comment.likes = comment.likes.filter(id => id !== userId);
      comment.numberOfLikes -= 1;
    } else {
      // If not liked yet, like it
      comment.likes.push(userId);
      comment.numberOfLikes += 1;
    }
    await comment.save();
    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Comment unliked" : "Comment liked",
      updatedComment: comment,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while liking the comment",
      error: error.message,
    });
  }
};

export const editComment = async (req, res) => {
  try {
    const userId = req.id
    const { content } = req.body
    const commentId = req.params.id

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    // check if the user owns the comment
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this comment' });
    }

    comment.content = content;
    comment.editedAt = new Date();

    await comment.save();

    res.status(200).json({ success: true, message: 'Comment updated successfully', comment });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Comment is not edited", error: error.message })

  }
}