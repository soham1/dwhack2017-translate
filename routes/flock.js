var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/event', function(req, res, next) {
  console.log(req.body);
  res.send('/flock/event called');
});

router.get('/config', function(req, res, next) {
  console.log(req.body);
  res.send('Thank you for installoing the app!');
});

router.get('/t2s', function(req, res, next) {
  console.log('t2s got called', JSON.stringify(req.query, null, 2));
  res.render('t2s');
});

router.get('/extract-entities', function(req, res, next) {
  console.log('extract-entities got called', JSON.stringify(req.query, null, 2));
  res.render('extract-entities');
});

module.exports = router;
