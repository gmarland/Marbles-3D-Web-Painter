var fs = require("fs"); 

exports.get = function(req, res) {
	var sceneId = req.params.id;

	var configPath = dataStorage.path + sceneId + ".json";

	var configExists = path.existsSync(configPath);

	if (configExists) {
		fs.readFile(configPath, 'utf8', function (err, data) {
		  if (err) {
	    	logging.error("Error reading scene", ex);

			return res.status(500).send("The scene could not be saved");
		  }
		  else res.status(200).send(JSON.parse(data));
		});
	}
	else return res.status(200).send({});
};

exports.save = function(req, res) {
	var sceneId = req.params.id;

	var configPath = dataStorage.path + sceneId + ".json";

	var configExists = path.existsSync(configPath);

	if (configExists) fs.unlinkSync(configPath);

	fs.writeFile(configPath, req.body.scene, function(err) {
	    if(err) {
	    	logging.error("Error saving scene", ex);

			res.status(500).send("The scene could not be saved");
		}
		else res.status(200).send();
	}); 
};