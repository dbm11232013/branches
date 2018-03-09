const express = require('express');
const request = require('request');
const expressApp     = express();
const async = require('async');

expressApp.use(express.static('public'));
expressApp.listen('3701');
let branches = [];
// const qa1 = 'http://admin.qa1.activebuilding.com/build.json';
const qa2 = 'http://admin.qa2.activebuilding.com/build.json';
// const qa3 = 'http://admin.qa3.activebuilding.com/build.json';
// const qa4 = 'http://admin.qa4.activebuilding.com/build.json';
// const ocr = 'http://admin.ocr.activebuilding.com/build.json';
// const sat = 'http://admin.sat.activebuilding.com/build.json';
// const urls = [qa1, qa2, qa3, qa4, ocr, sat];
const urls = [qa2];

expressApp.get('/branches', function(req, res){
    console.log(req);
    async.map(urls, getVersion,
        function(err, results){
            if(err) {
                console.log(err);
                return; 
            }
            res.send(results);
        });
});

let getVersion = (url, callback) => {
    let regexp = '[a-zA-Z]{3}-[0-9]{4}';
    let server = url.split('.')[1];
    request(url, function(error, response, body){
        if(!error){
            callback(null, {[server]: body.match(regexp)[0]});
        } else {
          console.log(error);
          callback(null, {[server]: 'No build.json file'});
        }
    })
}