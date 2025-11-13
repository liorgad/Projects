var express = require('express')

var app = express()


app.get('/search', function(req, res){
    
    var req_results = req.query.results;
    var req_include_tabs = req.query.include_tabs;

    var r = {        
        results : req_results,
        include_tabs: req_include_tabs
    };

    res.send(r);
});



app.listen(process.argv[2])