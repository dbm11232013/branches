const app = require('express')();
const server = require('http').Server(app);
const async = require('async');
const axios = require('axios');

server.listen('3000', () => {
    console.log('Server listening on port 3000');
});
const qa1 = 'http://admin.qa1.activebuilding.com/build.json';
const qa2 = 'http://admin.qa2.activebuilding.com/build.json';
const qa3 = 'http://admin.qa3.activebuilding.com/build.json';
const qa4 = 'http://admin.qa4.activebuilding.com/build.json';
const ocr = 'http://admin.ocr.activebuilding.com/build.json';
const sat = 'http://admin.sat.activebuilding.com/build.json';
const urls = [qa1, qa2, qa3, qa4, ocr, sat];

app.get('/', function(req, res){
    let filteredUrls = req.query.text ? urls.filter(url => url.includes(req.query.text)) : urls;
    let responseUrl = req.query.response_url;

    async.map(filteredUrls, getVersion,
        function(err, results){
            if(err) {
                console.log(err);
                return; 
            }

            let mappedResults = results.map((result)=>{
                return `*${result.server}:* _${result.branch.toUpperCase()}_\n`;
            }).join('');

            res.send(mappedResults);
        });
});

let getVersion = (url, callback) => {
    let regexp = '[a-zA-Z]{3}-[0-9]{4}|master';
    let server = url.split('.')[1];
    axios.get(url)
    .then((res) => {
        callback(null, 
            {
                'server': server,
                'branch': res.data.match(regexp)[0]
            }
        );
    })
    .catch((err) => {
        console.log(err);
    });
    
    
    
    // function(error, response, body){
    //     console.log(response);
    //     if(!error){
    //         callback(null, 
    //             {
    //                 'server': server,
    //                 'branch': body.match(regexp)[0]
    //             }
    //         );
    //     } else {
    //       console.log(error);
    //       callback(null, 
    //             {
    //                 server,
    //                 'branch': 'No build.json file'
    //             }
    //         );
    //     }
    // })
}