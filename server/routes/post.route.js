const Router = require('express').Router;
const router = Router();
const multer = require('multer');
const path = require('path');

const { createPost, getAllNewstPosts, getPostById, getPostByUser, updatePost, deletePost, getPopularPosts, getByTag } = require('../controllers/post.controller');

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });




router.post('/create', upload.single('thumbnail'), createPost);
router.get('/get-all', getAllNewstPosts);
router.get('/get-one', getPostById);
router.get('/get-by-user', getPostByUser);
router.get('/get-popular', getPopularPosts);
router.get('/get-by-tag', getByTag);
router.put('/update', upload.single('thumbnail'), updatePost);
router.delete('/delete', deletePost);

module.exports = router;