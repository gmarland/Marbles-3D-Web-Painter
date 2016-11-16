var path = require("path"),
	fs = require("fs"); 

var amazonClient = amazon.getClient(dataStorage.key, dataStorage.secret);

function _listBucketFiles(callback) {
	var contentData = "";

	amazonClient.listObjects({Bucket: dataStorage.bucket}, function (err, data) {
		if (err) {
            logging.error("Could not list the bucket.", err );

            callback([]);
		}
		else if (callback) callback(data.Contents);
	});
}

function _getBucketFile(file, callback) {
	var contentData = "";

	amazonClient.getObject({Bucket: dataStorage.bucket, Key: file}, function (err, data) {
		if (err) {
			if (err.code == "NoSuchKey") {
				logging.error("Unable to find content", err);

				callback(null);
			}
			else {
				logging.error("Error retrieving content", err);

				callback(null);
			}
		}
		else {
			callback(JSON.parse(data.Body.toString()));
		}
	});
}


exports.getById = function(req, res) {
	var sceneId = req.params.id;

	_listBucketFiles(function(files) {
    	var fileFound = false;

    	for (var i=0; i<files.length; i++) {
    		var textParts = textHelper.removeEnd(files[i].Key, ".json").split("_");

    		if (textParts[0] == sceneId) {
    			_getBucketFile(files[i].Key, function(content) {
					if (content !== null) res.status(200).send(content);
					else res.status(500).send("The scene could not be read");
    			});

				fileFound = true;

				break;
			}
    	}

    	if (!fileFound) return res.status(200).send(null);
	});
};

exports.getReadOnlyById = function(req, res) {
	var sceneId = req.params.id;

	_listBucketFiles(function(files) {
    	var fileFound = false;

    	for (var i=0; i<files.length; i++) {
    		var textParts = textHelper.removeEnd(files[i].Key, ".json").split("_");

    		if (textParts[1] == sceneId) {
    			_getBucketFile(files[i].Key, function(content) {
					if (content !== null) res.status(200).send(content);
					else res.status(500).send("The scene could not be read");
    			});

				fileFound = true;

				break;
			}
    	}

    	if (!fileFound) return res.status(200).send(null);
	});
};

exports.save = function(req, res) {
	var sceneId = req.params.id,
		shareId = req.params.shareId;

	var configPath = sceneId + "_" + shareId + ".json";

	amazonClient.putObject({Bucket: dataStorage.bucket, Key: configPath, Body: req.body.scene}, function(err, data) {	
		if (err) res.status(500).send(err.message);
		else res.status(200).send();
	});	
};