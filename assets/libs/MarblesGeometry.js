THREE.MarblesGeometry = function (voxelSize) {
	var that = this;

	this._voxelSize = voxelSize;

	this._getCubeGeometry = function() {
		var cube = new THREE.BoxGeometry(that._voxelSize, that._voxelSize, that._voxelSize);

        var voxelGeometry = new THREE.Geometry();

        for (var i=0; i<cube.vertices.length; i++) {
        	voxelGeometry.vertices.push(cube.vertices[i]);
        }

        for (var i=0; i<cube.faces.length; i++) {
        	voxelGeometry.faces.push(cube.faces[i]);
        }

        voxelGeometry.computeFaceNormals();

	  	return voxelGeometry;
    };

	this._getTriangleGeometry = function() {
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
    };


    this.getCornerGeometry = function() {
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
    };

    this.getPyramidGeometry = function() {
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
    };

	this._cubeGeometry = this._getCubeGeometry();
	this._triangleGeometry = this._getTriangleGeometry();
	this._cornerGeometry = this.getCornerGeometry();
	this._pyramidGeometry = this.getPyramidGeometry();

	return {
		getCubeGeometry: function() {
	        return that._cubeGeometry.clone();
	    },

	    getTriangleGeometry: function() {
	        return that._triangleGeometry.clone();
	    },

	    getCornerGeometry: function() {
	        return that._cornerGeometry.clone();
	    },

	    getPyramidGeometry: function() {
	        return that._pyramidGeometry.clone();
	    }
	}
};