const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true,
        required: true
    },
    postId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);