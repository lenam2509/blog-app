const commentSchema = require('../models/comment.model');
const postSchema = require('../models/post.model');

exports.createComment = async (req, res) => {

    const { comment, postId, userId } = req.body;
    try {
        const post = await postSchema.findById(postId);
        if (!post) {
            return res.status(400).json({
                message: 'Post not found'
            });
        }
        await postSchema.findByIdAndUpdate(postId, { comments: post.comments + 1 });
        const newComment = new commentSchema({
            comment,
            postId,
            userId
        });
        await newComment.save();
        return res.status(201).json({
            message: 'Comment created successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Server error'
        });
    }
}

exports.getCommentsByPostId = async (req, res) => {
    const { postId } = req.query;
    try {
        const total = await commentSchema.countDocuments({ postId });
        const comments = await commentSchema.find({ postId })
            .sort({ created: -1 })
            .populate('userId', 'name')
            .exec();
        return res.status(200).json({
            total,
            comments
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Server error'
        });
    }
}