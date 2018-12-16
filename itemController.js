var mongoose = require('mongoose');
var rp = require('request-promise');

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
var Item = mongoose.model('Item', itemSchema, 'item');

var exports = module.exports = {};

exports.get = function (req, res) {
    Item.findOne(function(err, item) {

        if(err) {
            res.send(err);
        }

        res.json(item);

    });
}

var all_items_location_cache = null;

exports.getAllItemLocation = function (req, res) {
    
    if(!all_items_location_cache) {

        Item.find({},
            {
                '_id': 0,
                'index_col': 1,
                'decimalLatitude': 1,
                'decimalLongitude': 1
            })
            .lean()
            .exec(
                function(err, items) {
            
                    if(err) {
                        res.send(err);
                    }
            
                    all_items_location_cache = items;

                    res.json(items);
            
                }
            );

    } else {

        res.json(all_items_location_cache);
    }
    
    
}

exports.getItems = function (req, res) {
    
    // console.log("req ", req.query, req.body);

    var draw = req.query.draw || 0;
    var start = Number(req.query.start) || 0;
    var length = Number(req.query.length) || 10;

    Item.find({}).skip(start).limit(length)
        .lean()
        .exec(
            function(err, items) {
        
                if(err) {
                    res.send({
                        error: err
                    });
                } else {

                    Item.count({}, function(err, c) {
                    
                        if(err) {
                            res.send({
                                error: err
                            });
                        } else {

                            res.json({
                                draw: draw,
                                "recordsTotal": c,
                                "recordsFiltered": c,
                                data: items
                            });

                        }
                            
                    });

                }    
                                
            }
        );
}

exports.getSpeciesInfo = function (req, res) {
    var index_col = req.query.index;
    
    Item.findOne({
        index_col: index_col
    })
    .lean()
    .exec(
        function(err, item) {
    
            if(err) {
                res.send(err);
            } else {

                if(item) {

                    // get the image link
                    get_image_link(item.gbifID)
                    .then(function (result) {
                        
                        if (result.media && (result.media.length > 0)) {
                            var media = result.media[0];
                            
                            if(media.identifier) {
                                item['image'] = media.identifier;
                            }
    
                        }
                        
                        res.json(item);
                        
                    })
                    .catch(function (err) {
                        res.send(err);
                    });
    
                } else {
                    res.send(new Error("NO_DATA_FOUND"));
                }

            }
                                    
        }
    );
}

exports.getSimilarSpeciesInfoByItem = function (req, res) {
    var index_col = req.query.index;
    
    Item.findOne({
        index_col: index_col
    })
    .lean()
    .exec(
        function(err, item) {
    
            if(err) {
                res.send(err);
            }
    
            Item.find({
                index_col: {
                    $in: item.sim_item
                }
            })
            .lean()
            .exec(
                function(err, items) {
            
                    if(err) {
                        res.send(err);
                    }
            
                    res.json(items);
            
                }
            );
    
        }
    );
}

get_image_link = function(gbifID) {

    var options = {
        uri: "http://api.gbif.org/v1/occurrence/" + gbifID,        
        json: true
    };
    
    return rp(options);    

}