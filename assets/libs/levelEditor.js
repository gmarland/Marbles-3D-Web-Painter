(function () {
    var LevelEditor = function() {
    	// ----- Private Properties

    	var that = this;

        this._sceneId = null;
        this._shareId = null;

        this._sceneName = null;

        this._clock = null;

    	this._containerElement = null;
    	this._containerWidth = null;
    	this._containerHeight = null;

    	this._scene = null;

        this._marblesViewEngine = null;
        this._marblesGeometry = null;

		this._raycaster = null;
		this._mouse = null;

    	this._lights = [];

    	this._camera = null;
        this._controls = null;

    	this._renderer = null;

        this._skyboxColor = 0xefefef;
        this._skyboxOpacity = 1;

        this._frame = null;

        this._basePlaneWidth = 1000;
        this._basePlaneTop = null;
        this._basePlaneBottom = null;
        this._baseGrid = null;

        // This is the rotation of the grid. h = horzontal, vz = vertical along the z axix, vx = vertical along the x axis
        this._gridRotations = [ "h", "vz", "vx" ];
        this._gridRotation = "h";

        this._positioningCube = null;

        this._voxelSize = 10;

        this._isLevelUpSelected = false;
        this._isLevelDownSelected = false;
        this._level = 0;

        this._selectedTool = "painter";
        this._selectedShape = "cube";
        this._selectedOpacity = 100;
        this._selectedColor = "#000000";

        this._isPainting = false;
        this._isErasing = false;

        this._xRotation = 0;
        this._yRotation = 0;

        this._eventManager = null;

        // ----- Constructor

    	this.init = function(container) {
            that._clock = new THREE.Clock();

			that._containerElement = document.getElementById(container);
            that._containerWidth = document.body.clientWidth;
            that._containerHeight = document.body.clientHeight;

            that._scene = new THREE.Scene();

            that._marblesViewEngine = THREE.MarblesViewEngine(that._scene, that._voxelSize);
            that._marblesGeometry = THREE.MarblesGeometry(that._voxelSize);

			that._raycaster = new THREE.Raycaster();
			that._mouse = new THREE.Vector2();

           	that._lights = that.getLighting();

            for (var i=0; i<that._lights.length; i++) that._scene.add(that._lights[i]);

            that._camera = that.getCamera(that._containerWidth, that._containerHeight);
            that._scene.add(that._camera);

            that._frame = that.getFrame();
            that._scene.add(that.getFrame());

            that._basePlaneTop = that.getBasePlaneTop();
            that._scene.add(that._basePlaneTop);

            that._basePlaneBottom = that.getBasePlaneBottom();
            that._scene.add(that._basePlaneBottom);

			that._baseGrid = that.getBaseGrid();
			that._scene.add(that._baseGrid);

			that._positioningCube = that.getPositioningVoxel();
			that._scene.add(that._positioningCube);			

			that._scene.add(that._baseGrid);

            that._renderer = that.getRenderer(that._containerWidth, that._containerHeight, that._skyboxColor, that._skyboxOpacity);
            that._containerElement.appendChild(that._renderer.domElement);

            that._controls = that.getControls(that._scene, that._camera, that._renderer.domElement);
            that._controls.setCameraPosition(0, 600, 750);
            that._controls.rotateCamera(0, that.degToRad(-45));

            that.render();

            that.bindWindowEvents();
    	};

        // ----- Scene methods

        this.getCamera = function(containerWidth, containerHeight) {
        	var fov = 75,
        		aspect = (containerWidth/containerHeight),
        		far = that._basePlaneWidth*3;

            return new THREE.PerspectiveCamera(fov, aspect, 0.1, far);
        };

       	this.getControls = function(scene, camera, domElement) {
			return new THREE.FirstPersonControls(scene, camera, (that._basePlaneWidth*1.5), domElement, function() {
                that.repositionPositioningCube();

                if (that._isPainting) that.paint();
                else if (that._isErasing) that.erase();
            });
       	};

        this.getLighting = function() {               
            var lights = [];

            var directionalLightTop = new THREE.PointLight(0xffffff, .5); 
            directionalLightTop.position.set(0, (that._basePlaneWidth/2) + (this._voxelSize*10), 0);

            lights.push(directionalLightTop);

            var directionalLightBottom = new THREE.PointLight(0xffffff, .5); 
            directionalLightBottom.position.set(0, ((that._basePlaneWidth/2)*-1) - (this._voxelSize*10), 0);

            lights.push(directionalLightBottom);

            var directionalLightFront = new THREE.PointLight(0xffffff, .25); 
            directionalLightFront.position.set(0, 0, (that._basePlaneWidth/2) + (this._voxelSize*10));

            lights.push(directionalLightFront);

            var directionalLightRight = new THREE.PointLight(0xffffff, .25); 
            directionalLightRight.position.set(((that._basePlaneWidth/2) + (this._voxelSize*10)), 0, 0);

            lights.push(directionalLightRight);

            var directionalLightBack = new THREE.PointLight(0xffffff, .25); 
            directionalLightBack.position.set(0, 0, (((that._basePlaneWidth/2) + (this._voxelSize*10))*-1));

            lights.push(directionalLightBack);

            var directionalLightLeft = new THREE.PointLight(0xffffff, .25); 
            directionalLightLeft.position.set((((that._basePlaneWidth/2) + (this._voxelSize*10))*-1), 0, 0);

            lights.push(directionalLightLeft);

            lights.push(new THREE.AmbientLight(0x666666));    

            return lights;
        };

        // ----- Rendering functions

        this.getRenderer = function(containerWidth, containerHeight, skyboxColor, skyboxOpacity) {
            var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(containerWidth, containerHeight);
            renderer.setClearColor(skyboxColor, skyboxOpacity);

            return renderer;
        };

        this.render = function() {
            var previousTime = that._clock.getElapsedTime();
            var previousLevel = that._level;

            function updateScene() {
               if (that._controls) {
                    that._controls.update(that._clock.getDelta());

                    if ((that._clock.getElapsedTime()-previousTime) >= 0.1) {
                        previousTime = that._clock.getElapsedTime();

                        if (that._level == previousLevel) {
                            if (that._isLevelUpSelected) that.setLevel((that._level+1));
                            if (that._isLevelDownSelected) that.setLevel((that._level-1));
                        }

                        previousLevel = that._level;
                    }
                }
            };

            function renderScene() {
                requestAnimationFrame( renderScene );

                updateScene();

                that._renderer.render(that._scene, that._camera);
            };

            renderScene();
        };

        // ----- Methods for creating the frame for the scene

        this.getFrame = function() {
            var frameGeometry = new THREE.BoxGeometry(that._basePlaneWidth, that._basePlaneWidth, that._basePlaneWidth);
            var edgesGeometry = new THREE.EdgesGeometry(frameGeometry); 

            var frameMaterial = new THREE.LineBasicMaterial({ 
                color: 0x000000, 
                opacity: 0.3 });

            return new THREE.LineSegments(edgesGeometry, frameMaterial);
        }

        // ----- Methods for creating base plane

        this.setLevel = function(level) {
            var maxLevel = (that._basePlaneWidth/that._voxelSize)/2,
                minLevel = ((that._basePlaneWidth/that._voxelSize)/2)*-1;

            if ((that._controls.enabled) && (level < maxLevel) && (level > minLevel)) {
                if (that._gridRotation === "h") {
                    that._basePlaneTop.position.y = (level*that._voxelSize);
                    that._basePlaneBottom.position.y = (level*that._voxelSize);
                    that._baseGrid.position.y = (level*that._voxelSize);

                    that._positioningCube.position.y = (level*that._voxelSize)+(that._voxelSize/2);
                }
                else if (that._gridRotation === "vz") {
                    that._basePlaneTop.position.z = (level*that._voxelSize)*-1;
                    that._basePlaneBottom.position.z = (level*that._voxelSize)*-1;
                    that._baseGrid.position.z = (level*that._voxelSize)*-1;

                    that._positioningCube.position.z = ((level*that._voxelSize)+(that._voxelSize/2))*-1;
                }
                else if (that._gridRotation === "vx") {
                    that._basePlaneTop.position.x = (level*that._voxelSize);
                    that._basePlaneBottom.position.x = (level*that._voxelSize);
                    that._baseGrid.position.x = (level*that._voxelSize);

                    that._positioningCube.position.x = (level*that._voxelSize)+(that._voxelSize/2);
                }

                that._level = level;

                if (that._isPainting) that.paint();
                else if (that._isErasing) that.erase();
            }
        };

        this.getBasePlaneTop = function() {
            var geometry = new THREE.PlaneBufferGeometry(that._basePlaneWidth, that._basePlaneWidth);
            geometry.rotateX( - Math.PI / 2 );

            return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        };

        this.getBasePlaneBottom = function() {
            var geometry = new THREE.PlaneBufferGeometry(that._basePlaneWidth, that._basePlaneWidth);
            geometry.rotateX(Math.PI / 2 );

            return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        };

        this.getBaseGrid = function() {
			var size = that._basePlaneWidth/2, 
				step = that._voxelSize;

			var geometry = new THREE.Geometry();

			for ( var i = - size; i <= size; i += step ) {
				geometry.vertices.push(new THREE.Vector3(-size, 0, i));
				geometry.vertices.push(new THREE.Vector3(size, 0, i));

				geometry.vertices.push(new THREE.Vector3(i, 0, - size));
				geometry.vertices.push(new THREE.Vector3(i, 0,   size));
			}

			var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.3, transparent: true } );

			return new THREE.LineSegments( geometry, material );
        };

        this.rotateGrid = function(gridRotation) {
            that._positioningCube.visible = false;

            that._level = 0;

            that._baseGrid.rotation.x = 0;
            that._baseGrid.rotation.z = 0;

            that._baseGrid.position.x = 0;
            that._baseGrid.position.y = 0;
            that._baseGrid.position.z = 0;

            that._basePlaneTop.rotation.x = 0;
            that._basePlaneTop.rotation.z = 0;

            that._basePlaneTop.position.x = 0;
            that._basePlaneTop.position.y = 0;
            that._basePlaneTop.position.z = 0;

            that._basePlaneBottom.rotation.x = 0;
            that._basePlaneBottom.rotation.z = 0;

            that._basePlaneBottom.position.x = 0;
            that._basePlaneBottom.position.y = 0;
            that._basePlaneBottom.position.z = 0;

            if (gridRotation == "vz") {
                that._baseGrid.rotation.x += (Math.PI / 2);
                that._basePlaneTop.rotation.x += (Math.PI / 2);
                that._basePlaneBottom.rotation.x += (Math.PI / 2);
            }
            else if (gridRotation == "vx") {
                that._baseGrid.rotation.z -= (Math.PI / 2);
                that._basePlaneTop.rotation.z -= (Math.PI / 2);
                that._basePlaneBottom.rotation.z -= (Math.PI / 2);
            }

            that._gridRotation = gridRotation;
        };

        // ----- Methods for setting the positioning voxel

        this.getPositioningVoxel = function() {
			var positioningGeometry;

            if (that._selectedShape == "cube") positioningGeometry = that._marblesGeometry.getCubeGeometry();
            else if (that._selectedShape == "triangle") positioningGeometry = that._marblesGeometry.getTriangleGeometry();
            else if (that._selectedShape == "pyramid") positioningGeometry = that._marblesGeometry.getPyramidGeometry();
            else if (that._selectedShape == "corner") positioningGeometry = that._marblesGeometry.getCornerGeometry();
			
            var positioningMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color(that._selectedColor), opacity: 0.5, transparent: true } );

			var positioningMesh = new THREE.Mesh(positioningGeometry, positioningMaterial);
			positioningMesh.visible = false;

			return positioningMesh;
        };

        this.updatePositioningVoxelShape = function() {
            var positioningCube = that.getPositioningVoxel()
            positioningCube.position.x = that._positioningCube.position.x;
            positioningCube.position.y = that._positioningCube.position.y;
            positioningCube.position.z = that._positioningCube.position.z;

            that.addNewPositioningCube(positioningCube);
        };

        this.updatePositioningVoxelColor = function() {
            that._positioningCube.material.color = new THREE.Color(that._selectedColor);
        };

        this.updatePositioningVoxelRotation = function() {
            that._positioningCube.rotation.x = 0;
            that._positioningCube.rotation.y = 0;
            that._positioningCube.rotation.z = 0;

            that._positioningCube.rotateY(that._xRotation);
            that._positioningCube.rotateX(that._yRotation);
        };

        this.addNewPositioningCube = function(positioningCube) {
            that._scene.remove(that._positioningCube);
            that._positioningCube.geometry.dispose();
            that._positioningCube.material.dispose();
            that._positioningCube = null;
            that._positioningCube = positioningCube;
            that._scene.add(that._positioningCube);
        };

        // ----- Mouse binding events

        this.bindWindowEvents = function() {
			window.addEventListener('resize', function(e) {
	            that._containerWidth = document.body.clientWidth;
	            that._containerHeight = document.body.clientHeight;

			    that._camera.aspect = (that._containerWidth / that._containerHeight);
			    that._camera.updateProjectionMatrix();

				that._renderer.setSize(that._containerWidth, that._containerHeight);
			}, false );

			that._containerElement.addEventListener('mousemove', that.repositionPositioningCube, false);

			that._containerElement.addEventListener('mousedown', that.mouseDown, false);

			that._containerElement.addEventListener('mouseup', that.mouseUp, false);
        };


		this.repositionPositioningCube = function(event) {
            if (that._controls.enabled) {
    			if (event) {
    				event.preventDefault();

    				that._mouse.set((event.clientX/window.innerWidth)*2-1, -(event.clientY/window.innerHeight )*2+1);
    			}

    			that._raycaster.setFromCamera(that._mouse, that._camera);

    			var intersects = that._raycaster.intersectObject(that._basePlaneTop);
                var side = "top";

                if (intersects.length === 0) {
                    intersects = that._raycaster.intersectObject(that._basePlaneBottom);
                    side = "bottom";
                }

    			if (intersects.length > 0) {
    				that._positioningCube.visible = true;

    				var intersect = intersects[0];

    				that._positioningCube.position.copy(intersect.point).add(intersect.face.normal);

                    if (that._gridRotation == "h") that._positioningCube.position.y = (that._level*that._voxelSize);
                    else if (that._gridRotation == "vx") that._positioningCube.position.x = (that._level*that._voxelSize);
                    else if (that._gridRotation == "vz") that._positioningCube.position.z = (that._level*that._voxelSize)*-1;

    				that._positioningCube.position.divideScalar(that._voxelSize).floor().multiplyScalar(that._voxelSize).addScalar((that._voxelSize/2));
                    
                    if (side == "bottom") {
                        if (that._gridRotation == "h") that._positioningCube.position.y -= that._voxelSize;
                        else if (that._gridRotation == "vx") that._positioningCube.position.x -= that._voxelSize;
                        else if (that._gridRotation == "vz") that._positioningCube.position.z -= that._voxelSize;
                    }

    				if (that._isPainting) that.paint();
                    else if (that._isErasing) that.erase();
    			}
    			else that._positioningCube.visible = false;
            }
		};

		this.mouseDown = function(event) {
            if (that._controls.enabled) {
                event.preventDefault();

                if (that.getIsLeftMouseButton(event)) {
                    if (that._selectedTool == "painter") {
                        that._isPainting = true;

                        that.paint();
                    }
                    else if (that._selectedTool == "sampler") {
                        that.sampleColor();
                    }
                }
                else if (that.getIsRightMouseButton(event)) {
                    if (that._selectedTool == "painter") {
                        that._isErasing = true;

                        that.erase();
                    }
                }

                return false;
            }
		};

		this.mouseUp = function(event) {
            if (that._controls.enabled) {
                event.preventDefault();

                if (that.getIsLeftMouseButton(event)) that._isPainting = false;
                else if (that.getIsRightMouseButton(event)) that._isErasing = false;

                return false;
            }
		};

        this.getIsLeftMouseButton = function(event) {
            event = event || window.event;

            var button = event.which || event.button;

            return button == 1;
        };

        this.getIsRightMouseButton = function(event) {
            event = event || window.event;

            var button = event.which || event.button;

            return button == 3;
        };

		//-----

        //----- Painting methods

        this.setTool = function(tool) {
            that._eventManager("toolChange", { 
                from: that._selectedTool, 
                to: tool 
            });

            that._isPainting = false;
            that._isErasing = false;

            that._selectedTool = tool;
        }


        this.paint = function() {
            if (that._positioningCube.visible) {
                var position = {
                    x: that._positioningCube.position.x,
                    y: that._positioningCube.position.y,
                    z: that._positioningCube.position.z
                };

                
                that._marblesViewEngine.addVoxel(that._selectedShape, position, that._selectedColor, that._selectedOpacity, that._xRotation, that._yRotation);
            }
        };

        this.erase = function() {
            if (that._positioningCube.visible) {
                var position = {
                    x: that._positioningCube.position.x,
                    y: that._positioningCube.position.y,
                    z: that._positioningCube.position.z
                };

                that._marblesViewEngine.removeVoxel(position);
            }
        };

        this.sampleColor = function() {
            if (that._positioningCube.visible) {
                var position = {
                    x: that._positioningCube.position.x,
                    y: that._positioningCube.position.y,
                    z: that._positioningCube.position.z
                };

                var voxel = that._marblesViewEngine.getVoxelAtPosition(position);

                if (voxel != null) {
                    that._selectedColor = voxel.color;
                    that._selectedOpacity = voxel.opacity;
                    that.updatePositioningVoxelColor();

                    that.setTool("painter");
                }
            }
        };

        this.degToRad = function(degrees) {
          return degrees * Math.PI / 180;
        };

    	return {
            onError: null,
            onLoad: null,

    		start: function(container, startColor) {
                that._selectedColor = startColor;

    			that.init(container);
    		},

            setEventManager: function(eventManager) {
                that._eventManager = eventManager;
            },

            // ----- Property Accessors

            getIsSaved: function() {
                return (that._sceneId === null);
            },

            getId: function() {
                return that._sceneId;
            },

            getShareId: function() {
                return that._shareId;
            },

            getName: function() {
                return that._sceneName;
            },

            setName: function(name) {
                that._sceneName = name;
            },

            setControlsEnabled: function(enabled) {
                that._controls.enabled = enabled;
            },

            setCameraPosition: function(position) {
                that._controls.setCameraPosition(position.x, position.y, position.z);
            },

            setCameraRotation: function(rotation) {
                that._controls.rotateCamera(rotation.x, rotation.y);
            },

            getTool: function() {
                return that._selectedTool;
            },

            setTool: function(tool) {
                that.setTool(tool);
            },

	        getLevel: function() {
	        	return that._level;
	        },

            moveLevelUp: function() {
                that.setLevel((that._level+1));
            },

            setLevelUpSelected: function(selected) {
                if (selected) that.setLevel((that._level+1));

                that._isLevelUpSelected = selected;
            },

            moveLevelDown: function() {
                that.setLevel((that._level-1));
            },

            setLevelDownSelected: function(selected) {
                if (selected) that.setLevel((that._level-1));

                that._isLevelDownSelected = selected;
            },

            setColor: function(color) {
                that._selectedColor = "#" + color;
                that.updatePositioningVoxelColor();
            },

            getColor: function() {
                return that._selectedColor;
            },

            setOpacity: function(opacity) {
                that._selectedOpacity = opacity;
            },

            getOpacity: function(opacity) {
                return that._selectedOpacity;
            },

            setShape: function(shape) {
                that._selectedShape = shape;

                that._xRotation = 0;
                that._yRotation = 0;

                that.updatePositioningVoxelShape();
            },

            rotateGridLeft: function() {
                var currentIndex = null,
                    newIndex = null;

                for (var i=0; i<that._gridRotations.length; i++) {
                    if (that._gridRotations[i] == that._gridRotation) {
                        currentIndex = i;
                        break;
                    }
                }

                if (currentIndex === null) newIndex = 0;
                else  {
                    if (currentIndex === 0) newIndex = (that._gridRotations.length-1);
                    else newIndex = (currentIndex-1);
                }

                that.rotateGrid(that._gridRotations[newIndex]);
            },

            rotateGridRight: function() {
                var currentIndex = null,
                    newIndex = null;

                for (var i=0; i<that._gridRotations.length; i++) {
                    if (that._gridRotations[i] == that._gridRotation) {
                        currentIndex = i;
                        break;
                    }
                }

                if (currentIndex === null) newIndex = 0;
                else  {
                    if (currentIndex === (that._gridRotations.length-1)) newIndex = 0;
                    else newIndex = (currentIndex+1);
                }

                that.rotateGrid(that._gridRotations[newIndex]);
            },

            setXRotation: function(deg) {
                that._xRotation += that.degToRad(deg);

                if (that._xRotation === (Math.PI*2)) that._xRotation = 0;
                else if (that._xRotation === ((Math.PI*-1)*2)) that._xRotation = 0;

                that.updatePositioningVoxelRotation();
            },

            setYRotation: function(deg) {
                that._yRotation += that.degToRad(deg);

                if (that._yRotation === (Math.PI*2)) that._yRotation = 0;
                else if (that._yRotation === ((Math.PI*-1)*2)) that._yRotation = 0;

                that.updatePositioningVoxelRotation();
            },

            // ----- Public Methods

            load: function(sceneId) {
                var local = this;

                that._sceneId = sceneId;

                $.ajax({
                    url: "/scene/" + that._sceneId,
                    type: "GET",
                    success: function (response) {
                        if ((response != null) && (typeof response === 'object')) {
                            that._sceneName = response.name;

                            that._shareId = response.shareId;

                            that._marblesViewEngine.loadScene(response.data);

                            if (local.onLoad) local.onLoad(true);
                        }
                        else local.onLoad(false);
                    },
                    error: function(response) {
                        if (local.onError) local.onError(response);
                    }
                });
            },

            save: function() {
                function guid() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                    }

                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
                }

                var local = this;

                if (that._sceneId == null) that._sceneId = guid();

                if (that._shareId == null) that._shareId = guid();

                $.ajax({
                    url: "/scene/" + that._sceneId + "/" + that._shareId,
                    type: "POST",
                    data: {
                        scene: JSON.stringify({
                            shareId: that._shareId,
                            name: that._sceneName,
                            data: that._marblesViewEngine.getScene()
                        })
                    },
                    error: function(response) {
                        if (local.onError) local.onError(response);
                    }
                });
            }
    	};
    };

    if(!window.LevelEditor) window.LevelEditor = LevelEditor;
})();