const router = require('express').Router();
const user = require('./user');

/* GET home page. */
router.get('/', (req, res) => {
	res.status(200).json({ message: 'Connected!' });
});

router.use('/user', user);

module.exports = router;
