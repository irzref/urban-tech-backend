// let mongoose = require('mongoose');
// var connection = mongoose.connect('mongodb://localhost:27017/botanic_dataset');

// var itemSchema = mongoose.Schema({
//     'catalogNumber': String,
//     'class': String,
//     'countryCode': String,
//     'decimalLatitude': Number,
//     'decimalLongitude': Number,
//     'family': String,
//     'gbifID': Number,
//     'genus': String,
//     'index_col': Number,
//     'kingdom': String,
//     'locality': String,
//     'occurrenceID': String,
//     'order': String,
//     'phylum': String,
//     'scientificName': String,
//     'sim_item': [Number],
//     'species': String
// });

// mongoose.connection.on('open', function(){
//     // Export Contact model
//     var Item = mongoose.model('Item', itemSchema, 'item');

//     // console.log("model ", item);

//     Item.findOne({}, function(err, item) {

//         if(err) {
//             console.log("err ", err);
//         }

//         console.log("res ", item);
//     });
// });

var rp = require('request-promise');

get_image_link = function(gbifID) {

    var options = {
        uri: "http://api.gbif.org/v1/occurrence/" + gbifID,        
        json: true
    };
    
    rp(options)
        .then(function (res) {
            console.log('test ', res.media[0].identifier);
        })
        .catch(function (err) {
            // API call failed...
        });

}

get_image_link(1144558595)
