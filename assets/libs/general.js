// ---- Data access methods

function getURLParam(name) {
	var urlParts = window.location.href.split("/");

	if (urlParts.length > 0) {
		var lastElements = urlParts[urlParts.length - 1].split("?");

		if (lastElements.length > 0) {
			var lastElement = lastElements[0];

			if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(lastElement)) return lastElement;
			else return null;
		}
	}	
}

function getQueryParam(name) {
    var url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    
    if (!results) return null;
    
    if (!results[2]) return null;
    
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
