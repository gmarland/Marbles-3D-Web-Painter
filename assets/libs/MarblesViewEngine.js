THREE.MarblesViewEngine = function (scene, voxelSize) {
	var that = this;

    this._chunkSize = 100;

	this._scene = scene;

	this._voxelSize = voxelSize;

    this._materials = {};

    this._sceneMeshes = {};
    this._scenePositions = {};

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
        if (that._sceneMeshes[voxel.color] == null) that._sceneMeshes[voxel.color] = {};

        if (that._sceneMeshes[voxel.color][voxel.opacity.toString()] == null) {
            that._sceneMeshes[voxel.color][voxel.opacity.toString()] = {};

            that._sceneMeshes[voxel.color][voxel.opacity.toString()].material = that.createMaterial(voxel);
            that._sceneMeshes[voxel.color][voxel.opacity.toString()].meshes = [];
        }

        return that._sceneMeshes[voxel.color][voxel.opacity.toString()];
    }

    this.getScenePosition = function(position) {
        if (that._scenePositions[position.x.toString()] == null) that._scenePositions[position.x.toString()] = {};
        if (that._scenePositions[position.x.toString()][position.y.toString()] == null) that._scenePositions[position.x.toString()][position.y.toString()] = {};
        if (that._scenePositions[position.x.toString()][position.y.toString()][position.z.toString()] == null) that._scenePositions[position.x.toString()][position.y.toString()][position.z.toString()] = {
            voxel: null
        };

        return that._scenePositions[position.x.toString()][position.y.toString()][position.z.toString()];
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
        var geometries = {}; 

        for (var i=0; i<voxels.length; i++) {
            var sectionMesh = that.getSceneMesh(voxels[i]);

            if ((sectionMesh.meshes.length === 0) || (sectionMesh.meshes[(sectionMesh.meshes.length-1)].voxels.length >= that._chunkSize)) {
                sectionMesh.meshes.push({
                    voxels: [],
                    mesh: null
                });
            }

            sectionMesh.meshes[(sectionMesh.meshes.length-1)].voxels.push(voxels[i]);

            voxels[i].meshSection = sectionMesh.meshes.length;

            var scenePosition = that.getScenePosition(voxels[i].position);
            scenePosition.voxel = voxels[i];

            if (geometries[voxels[i].color] == null) geometries[voxels[i].color] = {};
            if (geometries[voxels[i].color][voxels[i].opacity.toString()] == null) {
                geometries[voxels[i].color][voxels[i].opacity.toString()] = {};
                geometries[voxels[i].color][voxels[i].opacity.toString()].meshes = [];
            }

            if (geometries[voxels[i].color][voxels[i].opacity.toString()].meshes.length < voxels[i].meshSection) {
                geometries[voxels[i].color][voxels[i].opacity.toString()].meshes.push(new THREE.Geometry());
            }

            try {
                geometries[voxels[i].color][voxels[i].opacity.toString()].meshes[(voxels[i].meshSection-1)].merge(voxels[i].voxelMesh.geometry, voxels[i].voxelMesh.matrix);
            }
            catch (err) {
                console.log(voxels[i].voxelMesh.geometry, err);   
            }
        }

        for (var color in that._sceneMeshes) {
            for (var opacity in that._sceneMeshes[color]) {
                for (var j=0; j<that._sceneMeshes[color][opacity].meshes.length; j++) {
                    geometries[color][opacity].meshes[j].computeFaceNormals();

                    var mesh = new THREE.Mesh(geometries[color][opacity].meshes[j], that._sceneMeshes[color][opacity].material);
                    
                    that._sceneMeshes[color][opacity].meshes[j].mesh = mesh;
                    that._scene.add(mesh);
                }

                for (var j=0; j<geometries[color][opacity].meshes.length; j++) {
                    geometries[color][opacity].meshes[j].dispose();
                    geometries[color][opacity].meshes[j] = null;
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

            for (var color in that._sceneMeshes) {
                for (var opacity in that._sceneMeshes[color]) {
                    var sceneMesh = that._sceneMeshes[color][opacity];

                    for (var i=0; i<sceneMesh.meshes.length; i++) {
                        for (var i=0; i<sceneMesh.meshes[i].voxels.length; i++) {
                            scene.push({
                                position: sceneMesh.meshes[i].voxels[j].position,
                                shape: sceneMesh.meshes[i].voxels[j].shape,
                                color: sceneMesh.voxels[j].color,
                                opacity: sceneMesh.meshes[i].voxels[j].opacity,
                                xRotation: sceneMesh.meshes[i].voxels[j].xRotation,
                                yRotation: sceneMesh.meshes[i].voxels[j].yRotation
                            });
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

            return that.getScenePosition(spacePosition).voxel;
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

                var sectionMesh = that.getSceneMesh(newVoxel);

                if ((sectionMesh.meshes.length === 0) || (sectionMesh.meshes[(sectionMesh.meshes.length-1)].voxels.length >= that._chunkSize)) {
                    sectionMesh.meshes.push({
                        voxels: [],
                        mesh: null
                    });
                }

                sectionMesh.meshes[(sectionMesh.meshes.length-1)].voxels.push(newVoxel);

                newVoxel.meshSection = sectionMesh.meshes.length;

                var scenePosition = that.getScenePosition(newVoxel.position);
                scenePosition.voxel = newVoxel;

                var geometry = new THREE.Geometry();

                for (var i=0; i<sectionMesh.meshes[(sectionMesh.meshes.length-1)].voxels.length; i++) {
                    try {
                        geometry.merge(sectionMesh.meshes[(sectionMesh.meshes.length-1)].voxels[i].voxelMesh.geometry, sectionMesh.meshes[(sectionMesh.meshes.length-1)].voxels[i].voxelMesh.matrix);
                    }
                    catch (err) {
                        console.log(sectionMesh.meshes[(sectionMesh.meshes.length-1)].voxels[i].voxelMesh, err);   
                    }
                }

                geometry.computeFaceNormals();

                if (sectionMesh.meshes[(sectionMesh.meshes.length-1)].mesh !== null) that._scene.remove(sectionMesh.meshes[(sectionMesh.meshes.length-1)].mesh);
                sectionMesh.meshes[(sectionMesh.meshes.length-1)].mesh = new THREE.Mesh(geometry, sectionMesh.material);

                that._scene.add(sectionMesh.meshes[(sectionMesh.meshes.length-1)].mesh);

                geometry.dispose();
                geometry = null;
            }
    	},

		removeVoxel: function(position) {
            if (position !== null) {    
                var exisitingVoxel = this.getVoxelAtPosition(position);

                if (exisitingVoxel != null) {
                    var sceneMesh = that.getSceneMesh(exisitingVoxel);

                    var meshArrayPositions = sceneMesh.meshes.splice((exisitingVoxel.meshSection-1), 1);

                    if (meshArrayPositions.length > 0) {
                        var meshArray = meshArrayPositions[0];

                        for (var i=(meshArray.voxels.length-1); i>=0; i--) {
                            if ((meshArray.voxels[i].position.x == exisitingVoxel.position.x) && 
                                (meshArray.voxels[i].position.y == exisitingVoxel.position.y) && 
                                (meshArray.voxels[i].position.z == exisitingVoxel.position.z)) {
                                meshArray.voxels.splice(i, 1);
                            }
                        }

                        if (meshArray.voxels.length > 0) {
                            for (var i=0; i<meshArray.voxels.length; i++) {
                                if ((sceneMesh.meshes.length === 0) || (sceneMesh.meshes[(sceneMesh.meshes.length-1)].voxels.length >= that._chunkSize)) {
                                    sceneMesh.meshes.push({
                                        voxels: [],
                                        mesh: null
                                    });
                                }

                                sceneMesh.meshes[(sceneMesh.meshes.length-1)].voxels.push(meshArray.voxels[i]);
                            }

                            for (var i=0; i<sceneMesh.meshes.length; i++) {
                                for (var j=0; j<sceneMesh.meshes[i].voxels.length; j++) {
                                    sceneMesh.meshes[i].voxels[j].meshSection = (i+1);
                                }
                            }

                            if (sceneMesh.meshes.length >= 2) {
                                var existingGeometry = new THREE.Geometry();

                                for (var i=0; i<sceneMesh.meshes[(sceneMesh.meshes.length-2)].voxels.length; i++) {
                                    try {
                                        existingGeometry.merge(sceneMesh.meshes[(sceneMesh.meshes.length-2)].voxels[i].voxelMesh.geometry, sceneMesh.meshes[(sceneMesh.meshes.length-2)].voxels[i].voxelMesh.matrix);
                                    }
                                    catch (err) {
                                        console.log(sceneMesh.meshes[(sceneMesh.meshes.length-2)].voxels[i].voxelMesh, err);   
                                    }
                                }
                            }

                            if (sceneMesh.meshes.length >= 1) {
                                var newGeometry = new THREE.Geometry();

                                for (var i=0; i<sceneMesh.meshes[(sceneMesh.meshes.length-1)].voxels.length; i++) {
                                    try {
                                        newGeometry.merge(sceneMesh.meshes[(sceneMesh.meshes.length-1)].voxels[i].voxelMesh.geometry, sceneMesh.meshes[(sceneMesh.meshes.length-1)].voxels[i].voxelMesh.matrix);
                                    }
                                    catch (err) {
                                        console.log(sceneMesh.meshes[(sceneMesh.meshes.length-1)].voxels[i].voxelMesh, err);   
                                    }
                                }
                            }

                            if (sceneMesh.meshes.length >= 2) {
                                var existingMesh = new THREE.Mesh(existingGeometry, sceneMesh.material);

                                that._scene.remove(sceneMesh.meshes[(sceneMesh.meshes.length-2)].mesh);
                                that._scene.add(existingMesh);

                                sceneMesh.meshes[(sceneMesh.meshes.length-2)].mesh = null;
                                sceneMesh.meshes[(sceneMesh.meshes.length-2)].mesh = existingMesh;
                            }
                            
                            if (sceneMesh.meshes.length >= 1) {
                                var newMesh = new THREE.Mesh(newGeometry, sceneMesh.material);
                                if (meshArray.mesh !== null) that._scene.remove(meshArray.mesh);
                                that._scene.add(newMesh);

                                sceneMesh.meshes[(sceneMesh.meshes.length-1)].mesh = newMesh;
                            }
                        }
                    }
                }
            }
        }
	}
};