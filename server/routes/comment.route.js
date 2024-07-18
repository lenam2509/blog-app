const Router = require('express').Router;
const router = Router();
const { createComment, getCommentsByPostId } = require('../controllers/comment.controller');

router.post('/create-comment', createComment);
router.get('/get-comments', getCommentsByPostId);

module.exports = router;

