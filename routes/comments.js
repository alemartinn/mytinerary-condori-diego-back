var express = require('express');
var router = express.Router();
const passport = require('../config/passport');

const { createComment, getAllComments, getComment, updateComment, deleteComment} = require('../controllers/commentController');

router.post('/', passport.authenticate('jwt', {session:false}), createComment);
router.get('/', getAllComments);
router.get('/:id', getComment);
router.patch('/:id', passport.authenticate('jwt', {session:false}), updateComment);
router.delete('/:id', passport.authenticate('jwt', {session:false}), deleteComment);

module.exports = router