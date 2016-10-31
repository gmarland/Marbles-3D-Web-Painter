// Load npm modules
	
	var express = require("express"),
		bodyParser = require("body-parser"),
		path = require("path");

// Instantiate Express

	var app = express();
	
// Configure static paths

  	app.use("/css", express.static(__dirname + "/assets/css"));
  	app.use("/images", express.static(__dirname + "/assets/images"));
	app.use("/libs", express.static(__dirname + "/assets/libs"));	
	app.use("/third-party-libs", express.static(__dirname + "/assets/third-party-libs"));

// Configure Express

	// Configure epress
	app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
	app.use(bodyParser.json({ limit: "500mb" }));

// Create the http server
	
	var http = require("http").createServer(app).listen(8080);

// Removing www from URL routes

	app.get("/*", function(req, res, next) {
		if (req.headers.host.match(/^www\./) != null) res.redirect("http://" + req.headers.host.slice(4) + req.url, 301);
		else next();
	});

// HTML returning routes

	app.get("/", function(req,res) { 
		res.sendFile(path.join(__dirname, "/views/index.html")); 
	});	

