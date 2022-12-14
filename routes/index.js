var express = require('express');
var router = express.Router();

const userDefaultRouter = require('./usersDefault');
const cityRouter = require('./cities');
const auth = require('./auth');
const itineraryRouter = require('./itineraries');
const activitiesRouter = require('./activities');
const commentRouter = require('./comments');

/* GET home page. */
router.get('/', function(req, res, next) {
  /*headers, body*/
  res.render('index', { title: 'MyTinerary' });
});


/* Va a unir todas las rutas en index */
router.use('/cities', cityRouter);
router.use('/usersDefault', userDefaultRouter);
router.use('/auth', auth);
router.use('/itineraries', itineraryRouter);
router.use('/activities', activitiesRouter);
router.use('/comments', commentRouter);


module.exports = router;
