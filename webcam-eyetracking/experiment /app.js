/// load modules 
var express = require("express");
// instanitate the app
var app = express();
const body_parser = require("body-parser");
const envirPORT = 3000;

app.set('port', (process.env.PORT || envirPORT));

// static
app.use(express.static(__dirname + '/public'));
app.use(body_parser.json({ limit: "50mb" }));


app.get("/", function (request, response) {
    response.render("index.html");
})

 app.listen(app.get('port'), function () {
     console.log(`listening to port: ${envirPORT}`);
 });


