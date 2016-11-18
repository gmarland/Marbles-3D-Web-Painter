var AWS = require("aws-sdk");

exports.getClient = function(amazonKey, amazonSecret) {
	return new AWS.S3({ 
		accessKeyId: amazonKey, 
		secretAccessKey: amazonSecret,
    	signatureVersion: 'v4'
	});
};