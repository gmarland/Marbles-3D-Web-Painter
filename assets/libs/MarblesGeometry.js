THREE.MarblesGeometry = function (voxelSize) {
	var that = this;

	this._voxelSize = voxelSize;

	return {
		getCubeGeometry: function() {
	        return new THREE.BoxGeometry(that._voxelSize, that._voxelSize, that._voxelSize);
	    },

	    getTriangleGeometry: function() {
	        var voxelGeometry = new THREE.Geometry();

	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2)*-1, (that._voxelSize/2)*-1, (that._voxelSize/2)*-1 ));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2)*-1, (that._voxelSize/2)*-1 ));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2)*-1, (that._voxelSize/2) ));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2)*-1, (that._voxelSize/2)*-1, (that._voxelSize/2)));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2), (that._voxelSize/2)));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2), (that._voxelSize/2)*-1));

	        voxelGeometry.faces.push(new THREE.Face3( 5, 1, 0));
	        voxelGeometry.faces.push(new THREE.Face3( 4, 2, 1));
	        voxelGeometry.faces.push(new THREE.Face3( 1, 5, 4));
	        voxelGeometry.faces.push(new THREE.Face3( 4, 3, 2));
	        voxelGeometry.faces.push(new THREE.Face3( 4, 0, 3));
	        voxelGeometry.faces.push(new THREE.Face3( 4, 5, 0));
	        voxelGeometry.faces.push(new THREE.Face3( 0, 1, 3));
	        voxelGeometry.faces.push(new THREE.Face3( 1, 2, 3));

	        voxelGeometry.computeFaceNormals();

	        return voxelGeometry;
	    },

	    getPyramidGeometry: function() {
	        var voxelGeometry = new THREE.Geometry();

	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2)*-1, (that._voxelSize/2)*-1, (that._voxelSize/2)*-1 ));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2)*-1, (that._voxelSize/2)*-1 ));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2)*-1, (that._voxelSize/2) ));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2)*-1, (that._voxelSize/2)*-1, (that._voxelSize/2)));
	        voxelGeometry.vertices.push(new THREE.Vector3( 0, (that._voxelSize/2), 0));

	        voxelGeometry.faces.push(new THREE.Face3( 4, 1, 0));
	        voxelGeometry.faces.push(new THREE.Face3( 4, 2, 1));
	        voxelGeometry.faces.push(new THREE.Face3( 4, 3, 2));
	        voxelGeometry.faces.push(new THREE.Face3( 4, 0, 3));
	        voxelGeometry.faces.push(new THREE.Face3( 0, 1, 3));
	        voxelGeometry.faces.push(new THREE.Face3( 1, 2, 3));

	        voxelGeometry.computeFaceNormals();

	        return voxelGeometry;
	    },

	    getCornerGeometry: function() {
	        var voxelGeometry = new THREE.Geometry();

	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2)*-1, (that._voxelSize/2)*-1, (that._voxelSize/2)*-1 ));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2)*-1, (that._voxelSize/2)*-1 ));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2)*-1, (that._voxelSize/2) ));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2)*-1, (that._voxelSize/2)*-1, (that._voxelSize/2)));
	        voxelGeometry.vertices.push(new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2), (that._voxelSize/2)*-1 ));

	        voxelGeometry.faces.push(new THREE.Face3( 4, 1, 0));
	        voxelGeometry.faces.push(new THREE.Face3( 4, 2, 1));
	        voxelGeometry.faces.push(new THREE.Face3( 4, 3, 2));
	        voxelGeometry.faces.push(new THREE.Face3( 4, 0, 3));
	        voxelGeometry.faces.push(new THREE.Face3( 0, 1, 3));
	        voxelGeometry.faces.push(new THREE.Face3( 1, 2, 3));

	        voxelGeometry.computeFaceNormals();

	        return voxelGeometry;
	    }
	}
};