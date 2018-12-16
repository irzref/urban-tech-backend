// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});

var itemController = require('./itemController');

router.route('/item')
    .get(itemController.get);

router.route('/items-location')
    .get(itemController.getAllItemLocation);

router.route('/items')
    .get(itemController.getItems);

router.route('/item-info')
    .get(itemController.getSpeciesInfo);

router.route('/similar-items-info')
    .get(itemController.getSimilarSpeciesInfoByItem);

// Export API routes
module.exports = router;