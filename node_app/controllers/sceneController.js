var path = require("path"); 

exports.save = function(req, res) {
	var sceneId = req.params.id;

	path.exists(sceneId + ".json", function(exists) { 
		if (exists) { 
		// do something 
		} 
	}); 
};
