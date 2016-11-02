var path = require("path"),
	fs = require("fs"); 

exports.getById = function(req, res) {
	var sceneId = req.params.id;

	fs.readdir(dataStorage.path, function( err, files ) {
        if( err ) {
            logging.error( "Could not list the directory.", err );

			return res.status(500).send("The scene could not be read");
        }
        else {
        	var fileFound = false;

        	for (var i=0; i<files.length; i++) {
        		var textParts = textHelper.removeEnd(files[i], ".json").split("_");

        		if (textParts[0] == sceneId) {
					var configPath = dataStorage.path + files[i];

					var configExists = fs.existsSync(configPath);

					if (configExists) {
						fs.readFile(configPath, 'utf8', function (err, data) {
						  if (err) {
					    	logging.error("Error reading scene", err);

							return res.status(500).send("The scene could not be read");
						  }
						  else res.status(200).send(JSON.parse(data));
						});
					}
					else return res.status(200).send(null);

					fileFound = true;

					break;
				}
        	}

        	if (!fileFound) return res.status(200).send(null);
		}
	});
};

exports.save = function(req, res) {
	var sceneId = req.params.id,
		shareId = req.params.shareId;

	var configPath = dataStorage.path + sceneId + "_" + shareId + ".json";

	var configExists = fs.existsSync(configPath);

	if (configExists) fs.unlinkSync(configPath);

	fs.writeFile(configPath, req.body.scene, function(err) {
	    if(err) {
	    	logging.error("Error saving scene", ex);

			res.status(500).send("The scene could not be saved");
		}
		else res.status(200).send();
	}); 
};