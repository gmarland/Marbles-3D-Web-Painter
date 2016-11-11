THREE.MarblesViewEngine = function (scene, voxelSize) {
	var that = this;

    this._chunkSize = 20;

	this._scene = scene;

	this._voxelSize = voxelSize;

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
        var sectionX = Math.floor(voxel.position.x/that._chunkSize),
            sectionY = Math.floor(voxel.position.y/that._chunkSize),
            sectionZ = Math.floor(voxel.position.z/that._chunkSize);

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

        return that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][voxel.color][voxel.opacity.toString()];
    }

    this.createCube = function(sceneVoxel) {
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

    this.createTriangle = function(sceneVoxel) {
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

    this.createPyramid = function(sceneVoxel) {
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

    this.createCorner = function(sceneVoxel) {
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
            sectionMesh.voxels.push(voxels[i]);

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

    		    	if (sceneVoxels[i].shape == "cube") voxels.push(that.createCube(sceneVoxels[i]));
    		    	else if (sceneVoxels[i].shape == "triangle") voxels.push(that.createTriangle(sceneVoxels[i]));
    		    	else if (sceneVoxels[i].shape == "pyramid") voxels.push(that.createPyramid(sceneVoxels[i]));
                    else if (sceneVoxels[i].shape == "corner") voxels.push(that.createCorner(sceneVoxels[i]));
    		    }

                that.loadEntireScene(voxels);
            }
		},

		getScene: function() {
			var scene = [];

            for (var x in that._sceneMeshes) {
                for (var y in that._sceneMeshes[x]) {
                    for (var z in that._sceneMeshes[x][y]) {
                        for (var color in that._sceneMeshes[x][y][z]) {
                            for (var opacity in that._sceneMeshes[x][y][z][color]) {
                                var sceneMesh = that._sceneMeshes[x][y][z][color][opacity];

                                for (var i=0; i<sceneMesh.voxels.length; i++) {
                                    scene.push({
                                        position: sceneMesh.voxels[i].position,
                                        shape: sceneMesh.voxels[i].shape,
                                        color: sceneMesh.voxels[i].color,
                                        opacity: sceneMesh.voxels[i].opacity,
                                        xRotation: sceneMesh.voxels[i].xRotation,
                                        yRotation: sceneMesh.voxels[i].yRotation
                                    });
                                }
                            }   
                        }
                    }
                }
            }

            return scene;
		},

        getVoxelAtPosition: function(position) {
            var spacePosition = {
                x: ((position.x-(that._voxelSize/2))/that._voxelSize),
                y: ((position.y-(that._voxelSize/2))/that._voxelSize),
                z: ((position.z-(that._voxelSize/2))/that._voxelSize)
            };

            var sectionX = Math.floor(spacePosition.x/that._chunkSize),
                sectionY = Math.floor(spacePosition.y/that._chunkSize),
                sectionZ = Math.floor(spacePosition.z/that._chunkSize);

            if (that._sceneMeshes[sectionX.toString()] == null) return null;
            if (that._sceneMeshes[sectionX.toString()][sectionY.toString()] == null) return null;
            if (that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()] == null) return null;

            for (var color in that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()]) {
                for (var opacity in that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][color]) {
                    var sceneMesh = that._sceneMeshes[sectionX.toString()][sectionY.toString()][sectionZ.toString()][color][opacity];

                    for (var i=0; i<sceneMesh.voxels.length; i++) {
                        if ((sceneMesh.voxels[i].position.x === spacePosition.x) &&
                            (sceneMesh.voxels[i].position.y === spacePosition.y) && 
                            (sceneMesh.voxels[i].position.z === spacePosition.z)) {
                            return sceneMesh.voxels[i];
                        }
                    }

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

            if (shape.toLowerCase() == "square") newVoxel = that.createCube(sceneVoxel);
            else if (shape.toLowerCase() == "triangle") newVoxel = that.createTriangle(sceneVoxel);
            else if (shape.toLowerCase() == "pyramid") newVoxel = that.createPyramid(sceneVoxel);
            else if (shape.toLowerCase() == "corner") newVoxel = that.createCorner(sceneVoxel);

            if (newVoxel) {        
                this.removeVoxel(position);

                var sceneMesh = that.getSceneMesh(newVoxel);

                sceneMesh.voxels.push(newVoxel);

                var geometry = new THREE.Geometry();

                for (var i=0; i<sceneMesh.voxels.length; i++) {
                    try {
                        geometry.merge(sceneMesh.voxels[i].voxelMesh.geometry, sceneMesh.voxels[i].voxelMesh.matrix);
                    }
                    catch (err) {
                        console.log(sceneMesh.voxels[i].voxelMesh, err);   
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
                var exisitingVoxel = this.getVoxelAtPosition(position);

                if (exisitingVoxel) {
                    var existingSceneMesh = that.getSceneMesh(exisitingVoxel);

                    for (var i=(existingSceneMesh.voxels.length-1); i>=0; i--) {
                        if ((existingSceneMesh.voxels[i].position.x === exisitingVoxel.position.x) &&
                            (existingSceneMesh.voxels[i].position.y === exisitingVoxel.position.y) && 
                            (existingSceneMesh.voxels[i].position.z === exisitingVoxel.position.z)) {
                            existingSceneMesh.voxels.splice(i, 1);
                        }
                    }

                    var existingGeometry = new THREE.Geometry();

                    for (var i=0; i<existingSceneMesh.voxels.length; i++) {
                        try {
                            existingGeometry.merge(existingSceneMesh.voxels[i].voxelMesh.geometry, existingSceneMesh.voxels[i].voxelMesh.matrix);
                        }
                        catch (err) {
                            console.log(existingSceneMesh.voxels[i].voxelMesh, err);   
                        }
                    }

                    existingGeometry.computeFaceNormals();

                    if (existingSceneMesh.mesh !== null) that._scene.remove(existingSceneMesh.mesh);
                    existingSceneMesh.mesh = new THREE.Mesh(existingGeometry, existingSceneMesh.material);

                    that._scene.add(existingSceneMesh.mesh);

                    existingGeometry.dispose();
                    existingGeometry = null;
                }
            }
        }
	}
};