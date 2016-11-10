THREE.MarblesViewEngine = function (scene, voxelSize) {
	var that = this;

	this._scene = scene;

	this._voxelSize = voxelSize;

    this._voxels = [];

    this._materials = {};

    this._sceneMeshes = null;

    this._marblesGeometry = THREE.MarblesGeometry(voxelSize);

    this.createMaterial = function(sceneVoxel) {
        if (that._materials[sceneVoxel.color] == null) that._materials[sceneVoxel.color] = {};

        if (that._materials[sceneVoxel.color][sceneVoxel.opacity.toString()] == null) {
            if (sceneVoxel.opacity < 100) {
                that._materials[sceneVoxel.color][sceneVoxel.opacity.toString()] = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(sceneVoxel.color), 
                    transparent: true, 
                    opacity: (sceneVoxel.opacity/100)
                });
            }
            else {
                that._materials[sceneVoxel.color][sceneVoxel.opacity.toString()] = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(sceneVoxel.color)
                });
            }
        }

        return that._materials[sceneVoxel.color][sceneVoxel.opacity];
    };

    this.createMesh = function(sceneVoxel, geometry, material) {
        var voxelMesh = new THREE.Mesh(geometry, material);

        voxelMesh.position.x = (sceneVoxel.position.x*that._voxelSize)+(that._voxelSize/2);
        voxelMesh.position.y = (sceneVoxel.position.y*that._voxelSize)+(that._voxelSize/2);
        voxelMesh.position.z = (sceneVoxel.position.z*that._voxelSize)+(that._voxelSize/2);

        if (sceneVoxel.xRotation) voxelMesh.rotateY(sceneVoxel.xRotation);
        if (sceneVoxel.yRotation) voxelMesh.rotateX(sceneVoxel.yRotation);

        voxelMesh.updateMatrix();

        return voxelMesh;
    };

    this.getSceneMesh = function(voxel) {
        var sectionX = Math.floor(voxel.position.x/10),
            sectionY = Math.floor(voxel.position.y/10),
            sectionZ = Math.floor(voxel.position.z/10);

        if (that._sceneMeshes[sectionX.toString()] == null) that._sceneMeshes[sectionX.toString()] = {};
        if (that._sceneMeshes[sectionX.toString()][sectionY.toString()] == null) that._sceneMeshes[sectionX.toString()][sectionY.toString()] = {};
        if (that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()] == null) that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()] = {};

        if (that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color] == null) that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color] = {};

        if (that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color][voxel.opacity.toString()] == null) {
            that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color][voxel.opacity.toString()] = {};

            that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color][voxel.opacity.toString()].position = { x: sectionX, y: sectionY, z: sectionZ };
            that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color][voxel.opacity.toString()].mesh = null;
            that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color][voxel.opacity.toString()].material = that.createMaterial(voxel);
            that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color][voxel.opacity.toString()].voxels = [];
        }

        that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color][voxel.opacity.toString()].voxels.push(voxel);

        return that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color][voxel.opacity.toString()];
    }

    this.addCube = function(sceneVoxel) {
        var voxelMaterial = that.createMaterial(sceneVoxel);

        var voxelMesh = that.createMesh(sceneVoxel, that._marblesGeometry.getCubeGeometry(), voxelMaterial);

        var voxel = {
            position: {
                x: sceneVoxel.position.x,
                y: sceneVoxel.position.y,
                z: sceneVoxel.position.z
            },
            shape: "cube",
            color: sceneVoxel.color,
            opacity: sceneVoxel.opacity,
            xRotation: sceneVoxel.xRotation,
            yRotation: sceneVoxel.yRotation,
            voxelMesh: voxelMesh
        }

        return voxel;
    };

    this.addTriangle = function(sceneVoxel) {
        var voxelMaterial = that.createMaterial(sceneVoxel);

        var voxelMesh = that.createMesh(sceneVoxel, that._marblesGeometry.getTriangleGeometry(), voxelMaterial);

        var voxel = {
            position: {
                x: sceneVoxel.position.x,
                y: sceneVoxel.position.y,
                z: sceneVoxel.position.z
            },
            shape: "triangle",
            color: sceneVoxel.color,
            opacity: sceneVoxel.opacity,
            xRotation: sceneVoxel.xRotation,
            yRotation: sceneVoxel.yRotation,
            voxelMesh: voxelMesh
        };

        return voxel;
    };

    this.addPyramid = function(sceneVoxel) {
        var voxelMaterial = that.createMaterial(sceneVoxel);

        var voxelMesh = that.createMesh(sceneVoxel, that._marblesGeometry.getPyramidGeometry(), voxelMaterial);

        var voxel = {
            position: {
                x: sceneVoxel.position.x,
                y: sceneVoxel.position.y,
                z: sceneVoxel.position.z
            },
            shape: "pyramid",
            color: sceneVoxel.color,
            opacity: sceneVoxel.opacity,
            xRotation: sceneVoxel.xRotation,
            yRotation: sceneVoxel.yRotation,
            voxelMesh: voxelMesh
        };

        return voxel;
    };

    this.addCorner = function(sceneVoxel) {
        var voxelMaterial = that.createMaterial(sceneVoxel);

        var voxelMesh = that.createMesh(sceneVoxel, that._marblesGeometry.getCornerGeometry(), voxelMaterial);

        var voxel = {
            position: {
                x: sceneVoxel.position.x,
                y: sceneVoxel.position.y,
                z: sceneVoxel.position.z
            },
            shape: "corner",
            color: sceneVoxel.color,
            opacity: sceneVoxel.opacity,
            xRotation: sceneVoxel.xRotation,
            yRotation: sceneVoxel.yRotation,
            voxelMesh: voxelMesh
        };

        return voxel;
    };

    this.loadEntireScene = function(voxels) {
        if (that._sceneMeshes) {
            for (var color in that._sceneMeshes) {
                for (var opacity in that._sceneMeshes[color]) {
                    that._scene.remove(new THREE.Mesh(that._sceneMeshes[color][opacity].geometry, that._sceneMeshes[color][opacity].material));
                }   
            }

            that._sceneMeshes = null;
        }

        that._sceneMeshes = {};

        var geometries = {}; 

        for (var i=0; i<voxels.length; i++) {
            var sectionMesh = that.getSceneMesh(voxels[i]);

            if (geometries[sectionMesh.position.x.toString()] == null) geometries[sectionMesh.position.x.toString()] = {};
            if (geometries[sectionMesh.position.x.toString()][sectionMesh.position.y.toString()] == null) geometries[sectionMesh.position.x.toString()][sectionMesh.position.y.toString()] = {};
            if (geometries[sectionMesh.position.x.toString()][sectionMesh.position.y.toString()][sectionMesh.position.z.toString()] == null) geometries[sectionMesh.position.x.toString()][sectionMesh.position.y.toString()][sectionMesh.position.z.toString()] = {};

            if (geometries[sectionMesh.position.x.toString()][sectionMesh.position.y.toString()][sectionMesh.position.z.toString()][voxels[i].color] == null) geometries[sectionMesh.position.x.toString()][sectionMesh.position.y.toString()][sectionMesh.position.z.toString()][voxels[i].color] = {};
            if (geometries[sectionMesh.position.x.toString()][sectionMesh.position.y.toString()][sectionMesh.position.z.toString()][voxels[i].color][voxels[i].opacity.toString()] == null) {
                geometries[sectionMesh.position.x.toString()][sectionMesh.position.y.toString()][sectionMesh.position.z.toString()][voxels[i].color][voxels[i].opacity.toString()] = new THREE.Geometry();
            }

            try {
                geometries[sectionMesh.position.x.toString()][sectionMesh.position.y.toString()][sectionMesh.position.z.toString()][voxels[i].color][voxels[i].opacity.toString()].merge(voxels[i].voxelMesh.geometry, voxels[i].voxelMesh.matrix);
            }
            catch (err) {
                console.log(voxels[i].voxelMesh.geometry, err);   
            }
        }

        for (var x in that._sceneMeshes) {
            for (var y in that._sceneMeshes[x]) {
                for (var z in that._sceneMeshes[x][y]) {
                    for (var color in that._sceneMeshes[x][y][z]) {
                        for (var opacity in that._sceneMeshes[x][y][z][color]) {
                            geometries[x][y][z][color][opacity].computeFaceNormals();

                            that._sceneMeshes[x][y][z][color][opacity].mesh = new THREE.Mesh(geometries[x][y][z][color][opacity], that._sceneMeshes[x][y][z][color][opacity].material);

                            that._scene.add(that._sceneMeshes[x][y][z][color][opacity].mesh);

                            geometries[x][y][z][color][opacity].dispose();
                            geometries[x][y][z][color][opacity] = null;
                        }   
                    }
                }
            }
        }
    }

    return {
    	loadScene: function(sceneVoxels) {
            if (sceneVoxels) {
                var voxels = [];

    		    for (var i=0; i<sceneVoxels.length; i++) {
                    if (sceneVoxels[i].opacity == null) sceneVoxels[i].opacity = 100;

    		    	if (sceneVoxels[i].shape == "cube") voxels.push(that.addCube(sceneVoxels[i]));
    		    	else if (sceneVoxels[i].shape == "triangle") voxels.push(that.addTriangle(sceneVoxels[i]));
    		    	else if (sceneVoxels[i].shape == "pyramid") voxels.push(that.addPyramid(sceneVoxels[i]));
                    else if (sceneVoxels[i].shape == "corner") voxels.push(that.addCorner(sceneVoxels[i]));
    		    }

                that.loadEntireScene(voxels);
            }
		},

		getScene: function() {
			var scene = [];

            for (var i=0; i<that._voxels.length; i++) {
                scene.push({
                    position: that._voxels[i].position,
                    shape: that._voxels[i].shape,
                    color: that._voxels[i].color,
                    opacity: that._voxels[i].opacity,
                    xRotation: that._voxels[i].xRotation,
                    yRotation: that._voxels[i].yRotation
                });
            }

            return scene;
		},

        getVoxelAtPosition: function(position) {
            var spacePosition = {
                x: ((position.x-(that._voxelSize/2))/that._voxelSize),
                y: ((position.y-(that._voxelSize/2))/that._voxelSize),
                z: ((position.z-(that._voxelSize/2))/that._voxelSize)
            };

            for (var i=0; i<that._voxels.length; i++) {
                if ((that._voxels[i].position.x === spacePosition.x) &&
                    (that._voxels[i].position.y === spacePosition.y) && 
                    (that._voxels[i].position.z === spacePosition.z)) {
                    return that._voxels[i];
                }
            }

            return null;
        },

        addVoxel : function(shape, position, selectedColor, opacity, xRotation, yRotation) {
            var spacePosition = {
                x: ((position.x-(that._voxelSize/2))/that._voxelSize),
                y: ((position.y-(that._voxelSize/2))/that._voxelSize),
                z: ((position.z-(that._voxelSize/2))/that._voxelSize)
            };

            var sceneVoxel = {
                position: {
                    x: spacePosition.x,
                    y: spacePosition.y,
                    z: spacePosition.z
                },
                color: selectedColor,
                opacity: opacity,
                xRotation: xRotation,
                yRotation: yRotation
            }

            var newVoxel;

            if (shape.toLowerCase() == "square") newVoxel = that.addCube(sceneVoxel);
            else if (shape.toLowerCase() == "triangle") newVoxel = that.addTriangle(sceneVoxel);
            else if (shape.toLowerCase() == "pyramid") newVoxel = that.addPyramid(sceneVoxel);
            else if (shape.toLowerCase() == "corner") newVoxel = that.addCorner(sceneVoxel);

            if (newVoxel) {            
                var sceneMesh = that.getSceneMesh(newVoxel);

                var existingVoxel = this.getVoxelAtPosition(position);

                if (existingVoxel != null) {
                    for (var i=(that._voxels.length-1); i>=0; i--) {
                        if ((that._voxels[i].position.x === existingVoxel.position.x) &&
                            (that._voxels[i].position.y === existingVoxel.position.y) && 
                            (that._voxels[i].position.z === existingVoxel.position.z)) {
                            that._voxels.splice(i,1);
                            break;
                        }
                    }
                }

                var geometry = new THREE.Geometry();

                try {
                    geometry.merge(newVoxel.voxelMesh.geometry, newVoxel.voxelMesh.matrix);
                }
                catch (err) {
                    console.log(newVoxel.voxelMesh, err);   
                }

                if (sceneMesh.mesh !== null) {
                    var sectionVoxels = [];

                    var sectionX = Math.floor(newVoxel.position.x/10),
                        sectionY = Math.floor(newVoxel.position.y/10),
                        sectionZ = Math.floor(newVoxel.position.z/10);

                    for (var i=0; i<that._voxels.length; i++) {
                        var currentX = Math.floor(that._voxels[i].position.x/10),
                            currentY = Math.floor(that._voxels[i].position.y/10),
                            currentZ = Math.floor(that._voxels[i].position.z/10);

                        if (((sectionX === currentX) && (sectionY === currentY) && (sectionZ === currentZ)) && 
                            (that._voxels[i].color == newVoxel.color) && (that._voxels[i].opacity == newVoxel.opacity)) {
                            sectionVoxels.push(that._voxels[i]);
                        }
                    }

                    for (var i=0; i<sectionVoxels.length; i++) {
                        try {
                            geometry.merge(sectionVoxels[i].voxelMesh.geometry, sectionVoxels[i].voxelMesh.matrix);
                        }
                        catch (err) {
                            console.log(sectionVoxels[i].voxelMesh, err);   
                        }
                    }
                }

                geometry.computeFaceNormals();

                if (sceneMesh.mesh !== null) that._scene.remove(sceneMesh.mesh);
                sceneMesh.mesh = new THREE.Mesh(geometry, sceneMesh.material);

                that._scene.add(sceneMesh.mesh);

                geometry.dispose();
                geometry = null;
            }
    	},

		removeVoxel: function(position) {
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
                        that._scene.remove(that._voxels[i].mesh);

                        that._voxels.splice(i,1);
                        break;
                    }
                }
            }
        }
	}
};