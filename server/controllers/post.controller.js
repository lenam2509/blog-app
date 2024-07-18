const postModel = require('../models/post.model');
const userModel = require('../models/user.model');

exports.createPost = async (req, res) => {
    const { title, body, postedBy, tag } = req.body;
    const thumbnail = req.file.path;
    console.log(thumbnail);
    try {
        const post = new postModel({
            title,
            body,
            thumbnail,
            postedBy,
            tag
        });
        await post.save();
        return res.status(201).json({
            message: 'Post created successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Server error'
        });
    }
}

exports.getAllNewstPosts = async (req, res) => {
    const { page, limit } = req.query;
    try {
        const totalPosts = await postModel.countDocuments();
        const posts = await postModel.find()
            .sort({ created: -1 })
            .skip((parseInt(page) - 1) * (limit ? parseInt(limit) : 2))
            .limit(limit ? parseInt(limit) : 2)
            .populate('postedBy', 'name')
            .exec();
        return res.status(200).json({
            posts,
            total: totalPosts,
            limit: parseInt(limit) || 2,
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Server error'
        });
    }
}

exports.getPopularPosts = async (req, res) => {
    // get all post have comments > 0 and limit 5
    try {
        const posts = await postModel.find({ comments: { $gt: 0 } })
            .sort({ created: -1 })
            .limit(5)
            .populate('postedBy', 'name')
            .exec();
        return res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Server error'
        });
    }
}

exports.getPostById = async (req, res) => {
    const { id } = req.query;
    try {
        const post = await postModel.findById(id).populate('postedBy', 'name').exec();
        return res.status(200).json(post);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Server error'
        });
    }
}

exports.getPostByUser = async (req, res) => {
    const { id, page } = req.query;
    try {
        const totalPosts = await postModel.countDocuments({ postedBy: id });
        const posts = await postModel.find({ postedBy: id })
            .sort({ created: -1 })
            .skip((parseInt(page) - 1) * 5)
            .limit(5)
            .populate('postedBy', 'name')
            .exec();
        return res.status(200).json(
            {
                posts,
                currentPage: parseInt(page),
                total: totalPosts,
                limit: 5
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Server error'
        });
    }
}

exports.getByTag = async (req, res) => {
    const { tag, page } = req.query;
    try {
        const totalPosts = await postModel.countDocuments({ tag });
        const posts = await postModel.find({ tag })
            .sort({ created: -1 })
            .skip((parseInt(page) - 1) * 2)
            .limit(2)
            .populate('postedBy', 'name')
            .exec();
        return res.status(200).json(
            {
                posts,
                currentPage: parseInt(page),
                total: totalPosts,
                limit: 2
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Server error'
        });
    }

}

exports.updatePost = async (req, res) => {
    const { id } = req.query;
    const { title, body, } = req.body;
    const thumbnail = req.file?.path;
    try {
        if (thumbnail) {
            await postModel.findByIdAndUpdate(id, { title, body, thumbnail });
        }
        else {
            await postModel.findByIdAndUpdate(id, { title, body });
        }
        return res.status(200).json({
            message: 'Post updated successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Server error'
        });
    }
}

exports.deletePost = async (req, res) => {
    const { id } = req.query;
    try {
        await postModel.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Server error'
        });
    }

}