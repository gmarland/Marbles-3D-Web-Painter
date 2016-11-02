exports.removeEnd = function(str, stringToRemove) {
	return str.substring( 0, str.indexOf(stringToRemove) );
}