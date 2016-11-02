THREE.MarbleViewEngine = function (scene, voxelSize) {
	var that = this;

	this._scene = scene;

	this._voxelSize = voxelSize;

    this._voxels = [];

    this.addCube = function(sceneVoxel) {
        var voxelGeometry = new THREE.BoxGeometry(that._voxelSize, that._voxelSize, that._voxelSize);
        var voxelMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(sceneVoxel.color) });

        var voxelMesh = new THREE.Mesh(voxelGeometry, voxelMaterial);
        voxelMesh.position.x = (sceneVoxel.position.x*that._voxelSize)+(that._voxelSize/2);
        voxelMesh.position.y = (sceneVoxel.position.y*that._voxelSize)+(that._voxelSize/2);
        voxelMesh.position.z = (sceneVoxel.position.z*that._voxelSize)+(that._voxelSize/2);

        if (sceneVoxel.xRotation) voxelMesh.rotation.y = sceneVoxel.xRotation;
        if (sceneVoxel.yRotation) voxelMesh.rotation.x = sceneVoxel.yRotation;

        that._scene.add(voxelMesh);

        if (that._voxels) {
	        that._voxels.push({
	            position: {
	                x: sceneVoxel.position.x,
	                y: sceneVoxel.position.y,
	                z: sceneVoxel.position.z
	            },
	            shape: "cube",
	            color: sceneVoxel.color,
	            xRotation: sceneVoxel.xRotation,
	            yRotation: sceneVoxel.yRotation,
	            mesh: voxelMesh
	        });
	    }
    }

    this.addTriangle = function(sceneVoxel) {
        var voxelGeometry = new THREE.Geometry();

        voxelGeometry.vertices = [
            new THREE.Vector3( (that._voxelSize/2)*-1, (that._voxelSize/2)*-1, (that._voxelSize/2)*-1 ),
            new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2)*-1, (that._voxelSize/2)*-1 ),
            new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2)*-1, (that._voxelSize/2) ),
            new THREE.Vector3( (that._voxelSize/2)*-1, (that._voxelSize/2)*-1, (that._voxelSize/2)),
            new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2), (that._voxelSize/2)),
            new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2), (that._voxelSize/2)*-1)
        ];

        voxelGeometry.faces = [
            new THREE.Face3( 5, 1, 0),
            new THREE.Face3( 4, 2, 1),
            new THREE.Face3( 1, 5, 4),
            new THREE.Face3( 4, 3, 2),
            new THREE.Face3( 4, 0, 3),
            new THREE.Face3( 4, 5, 0),
            new THREE.Face3( 0, 1, 3),
            new THREE.Face3( 1, 2, 3)
        ];    

        voxelGeometry.computeFaceNormals();

        var voxelMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(sceneVoxel.color) });

        var voxelMesh = new THREE.Mesh(voxelGeometry, voxelMaterial);
        voxelMesh.position.x = (sceneVoxel.position.x*that._voxelSize)+(that._voxelSize/2);
        voxelMesh.position.y = (sceneVoxel.position.y*that._voxelSize)+(that._voxelSize/2);
        voxelMesh.position.z = (sceneVoxel.position.z*that._voxelSize)+(that._voxelSize/2);

        if (sceneVoxel.xRotation) voxelMesh.rotation.y = sceneVoxel.xRotation;
        if (sceneVoxel.yRotation) voxelMesh.rotation.x = sceneVoxel.yRotation;

        that._scene.add(voxelMesh);

        if (that._voxels) {
	        that._voxels.push({
	            position: {
	                x: sceneVoxel.position.x,
	                y: sceneVoxel.position.y,
	                z: sceneVoxel.position.z
	            },
	            shape: "triangle",
	            color: sceneVoxel.color,
	            xRotation: sceneVoxel.xRotation,
	            yRotation: sceneVoxel.yRotation,
	            mesh: voxelMesh
	        });
        }
    };

    this.addPyramid = function(sceneVoxel) {
        var voxelGeometry = new THREE.Geometry();

        voxelGeometry.vertices = [
            new THREE.Vector3( (that._voxelSize/2)*-1, (that._voxelSize/2)*-1, (that._voxelSize/2)*-1 ),
            new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2)*-1, (that._voxelSize/2)*-1 ),
            new THREE.Vector3( (that._voxelSize/2), (that._voxelSize/2)*-1, (that._voxelSize/2) ),
            new THREE.Vector3( (that._voxelSize/2)*-1, (that._voxelSize/2)*-1, (that._voxelSize/2)),
            new THREE.Vector3( 0, (that._voxelSize/2), 0)
        ];

        voxelGeometry.faces = [
            new THREE.Face3( 4, 1, 0),
            new THREE.Face3( 4, 2, 1),
            new THREE.Face3( 4, 3, 2),
            new THREE.Face3( 4, 0, 3),
            new THREE.Face3( 0, 1, 3),
            new THREE.Face3( 1, 2, 3)
        ];    

        voxelGeometry.computeFaceNormals();

        var voxelMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(sceneVoxel.color) });

        var voxelMesh = new THREE.Mesh(voxelGeometry, voxelMaterial);
        voxelMesh.position.x = (sceneVoxel.position.x*that._voxelSize)+(that._voxelSize/2);
        voxelMesh.position.y = (sceneVoxel.position.y*that._voxelSize)+(that._voxelSize/2);
        voxelMesh.position.z = (sceneVoxel.position.z*that._voxelSize)+(that._voxelSize/2);

        if (sceneVoxel.xRotation) voxelMesh.rotation.y = sceneVoxel.xRotation;
        if (sceneVoxel.yRotation) voxelMesh.rotation.x = sceneVoxel.yRotation;

        that._scene.add(voxelMesh);
        
        if (that._voxels) {
	        that._voxels.push({
	            position: {
	                x: sceneVoxel.position.x,
	                y: sceneVoxel.position.y,
	                z: sceneVoxel.position.z
	            },
	            shape: "pyramid",
	            color: sceneVoxel.color,
	            xRotation: sceneVoxel.xRotation,
	            yRotation: sceneVoxel.yRotation,
	            mesh: voxelMesh
	        });
	    }
    };

    return {
    	loadScene: function(sceneVoxels) {
            if (sceneVoxels) {
    		    for (var i=0; i<sceneVoxels.length; i++) {
    		    	if (sceneVoxels[i].shape == "cube") that.addCube(sceneVoxels[i]);
    		    	else if (sceneVoxels[i].shape == "triangle") that.addTriangle(sceneVoxels[i]);
    		    	else if (sceneVoxels[i].shape == "pyramid") that.addPyramid(sceneVoxels[i]);
    		    }
            }
		},

		getScene: function() {
			var scene = [];

            for (var i=0; i<that._voxels.length; i++) {
                scene.push({
                    position: that._voxels[i].position,
                    shape: that._voxels[i].shape,
                    color: that._voxels[i].color,
                    xRotation: that._voxels[i].xRotation,
                    yRotation: that._voxels[i].yRotation
                });
            }

            return scene;
		},

        paint : function(shape, position, selectedColor, xRotation, yRotation) {
            var spacePosition = {
                x: ((position.x-(that._voxelSize/2))/that._voxelSize),
                y: ((position.y-(that._voxelSize/2))/that._voxelSize),
                z: ((position.z-(that._voxelSize/2))/that._voxelSize)
            };

            var positionExists = false;

            for (var i=0; i<that._voxels.length; i++) {
                if ((that._voxels[i].position.x === spacePosition.x) &&
                    (that._voxels[i].position.y === spacePosition.y) && 
                    (that._voxels[i].position.z === spacePosition.z)) {
                    positionExists = true;

                    break;
                }
            }

            if (positionExists) this.erase(position);

            var sceneVoxel = {
                position: {
                    x: spacePosition.x,
                    y: spacePosition.y,
                    z: spacePosition.z
                },
                color: selectedColor,
                xRotation: xRotation,
                yRotation: yRotation
            }

            if (shape.toLowerCase() == "square") that.addCube(sceneVoxel);
            else if (shape.toLowerCase() == "triangle") that.addTriangle(sceneVoxel);
            else if (shape.toLowerCase() == "pyramid") that.addPyramid(sceneVoxel);
    	},

		erase: function(position) {
            if (position !== null) {
                var spacePosition = {
                    x: ((position.x-(that._voxelSize/2))/that._voxelSize),
                    y: ((position.y-(that._voxelSize/2))/that._voxelSize),
                    z: ((position.z-(that._voxelSize/2))/that._voxelSize)
                };

                for (var i=(that._voxels.length-1); i>=0; i--) {
                    if ((that._voxels[i].position.x === spacePosition.x) &&
                        (that._voxels[i].position.y === spacePosition.y) && 
                        (that._voxels[i].position.z === spacePosition.z)) {
                        that._scene.remove(that._voxels[i].mesh);;

                        that._voxels.splice(i,1);
                        break;
                    }
                }
            }
        }
	}
};