const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    comments: {
        type: Number,
        default: 0
    },
    tag:{
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);