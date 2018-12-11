var mongoose = require('mongoose');

// Setup schema
var itemSchema = mongoose.Schema({
    'catalogNumber': String,
    'class': String,
    'countryCode': String,
    'decimalLatitude': Number,
    'decimalLongitude': Number,
    'family': String,
    'gbifID': Number,
    'genus': String,
    'index_col': Number,
    'kingdom': String,
    'locality': String,
    'occurrenceID': String,
    'order': String,
    'phylum': String,
    'scientificName': String,
    'sim_item': [Number],
    'species': String
});

// Export Contact model
var Item = module.exports = mongoose.model('Item', itemSchema, 'item');


module.exports.get = function (req, res) {
    Item.findOne(function(err, item) {

        if(err) {
            res.send(err);
        }

        res.json(item);

    });
}