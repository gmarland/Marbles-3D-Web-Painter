(function () {
    var LevelEditor = function() {
    	// ----- Private Properties

    	var that = this;

        this._clock = null;

    	this._containerElement = null;
    	this._containerWidth = null;
    	this._containerHeight = null;

        this._keepRenderingScene = true;

    	this._scene = null;

		this._raycaster = null;
		this._mouse = null;

    	this._directionalLight = null;

    	this._camera = null;
        this._controls = null;

    	this._renderer = null;

        this._skyboxColor = 0xefefef;
        this._skyboxOpacity = 1;

        this._basePlaneWidth = 1000;
        this._basePlane = null;
        this._baseGrid = null;

        this._positioningCube = null;

        this._voxelSize = 10;

        this._level = 0;

        this._isPainting = false;
        this._isErasing = false;

        this._selectedShape = "square";
        this._selectedColor = "#000000";

        this._xRotation = 0;
        this._yRotation = 0;

        this._voxels = [];

        // -----

        // ----- Constructor

    	this.init = function(container) {
            that._clock = new THREE.Clock();

			that._containerElement = document.getElementById(container);
            that._containerWidth = document.body.clientWidth;
            that._containerHeight = document.body.clientHeight;

            that._scene = new THREE.Scene();

			that._raycaster = new THREE.Raycaster();
			that._mouse = new THREE.Vector2();

           	that._directionalLight = that.getDirectionalLight();
            that._scene.add(that._directionalLight);

            that._camera = that.getCamera(that._containerWidth, that._containerHeight);
            that._scene.add(that._camera);

            that._basePlane = that.getBasePlane();
			that._scene.add(that._basePlane);

			that._baseGrid = that.getBaseGrid();
			that._scene.add(that._baseGrid);

			that._positioningCube = that.getPositioningVoxel();
			that._scene.add(that._positioningCube);			

			that._scene.add(that._baseGrid);

            that._renderer = that.getRenderer(that._containerWidth, that._containerHeight, that._skyboxColor, that._skyboxOpacity);
            that._containerElement.appendChild(that._renderer.domElement);

            that._controls = that.getControls(that._scene, that._camera, that._renderer.domElement);
            that._controls.setCameraPosition(0, 600, 750);

            that.render();

            that.bindWindowEvents();
    	};

        // -----

        this.getCamera = function(containerWidth, containerHeight) {
        	var fov = 75,
        		aspect = (containerWidth/containerHeight),
        		far = 2000;

            return new THREE.PerspectiveCamera(fov, aspect, 0.1, far);
        };

       	this.getControls = function(scene, camera, domElement) {
			return new THREE.FirstPersonControls(scene, camera, domElement, function() {
                that.repositionPositioningCube();

                if (that._isPainting) that.paint();
                else if (that._isErasing) that.erase();
            });
       	};

        this.getDirectionalLight = function() {               
        	var color = 0xffffff,
        		intensity = 1.0;

            var positionAt = {
            	x: 0,
            	y: 1000,
            	z: 1000
            };

            var directionalLight = new THREE.PointLight(color, intensity); 
            directionalLight.position.set(positionAt.x, positionAt.y, positionAt.z);

            return directionalLight;
        };

        // ----- Methods for creating base plane

        this.getBasePlane = function() {
			var geometry = new THREE.PlaneBufferGeometry(that._basePlaneWidth, that._basePlaneWidth);
			geometry.rotateX( - Math.PI / 2 );

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
        }

        this.getPositioningVoxel = function() {
			var positioningGeometry = new THREE.BoxGeometry(that._voxelSize, that._voxelSize, that._voxelSize);
			var positioningMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color(that._selectedColor), opacity: 0.5, transparent: true } );

			var positioningMesh = new THREE.Mesh(positioningGeometry, positioningMaterial);
			positioningMesh.visible = false;

			return positioningMesh;
        };

        this.updatePositioningVoxelColor = function() {
            that._positioningCube.material.color = new THREE.Color(that._selectedColor);
        };

        // -----

    	this.getRenderer = function(containerWidth, containerHeight, skyboxColor, skyboxOpacity) {
            var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(containerWidth, containerHeight);
            renderer.setClearColor(skyboxColor, skyboxOpacity);

            return renderer;
    	};

       	this.render = function() {
            function updateScene() {
               if (that._controls) that._controls.update(that._clock.getDelta());
            };

            function renderScene() {
                if (that._keepRenderingScene) requestAnimationFrame( renderScene );

                updateScene();

                that._renderer.render(that._scene, that._camera);
            };

            renderScene();
        };

        //----- Mouse binding events

        this.bindWindowEvents = function() {
			window.addEventListener('resize', function(e) {
	            that._containerWidth = document.body.clientWidth;
	            that._containerHeight = document.body.clientHeight;

			    that._camera.aspect = (that._containerWidth / that._containerHeight);
			    that._camera.updateProjectionMatrix();

				that._renderer.setSize(that._containerWidth, that._containerHeight);
			}, false );

			document.addEventListener('mousemove', that.repositionPositioningCube, false);

			document.addEventListener('mousedown', that.mouseDown, false);

			document.addEventListener('mouseup', that.mouseUp, false);
        };


		this.repositionPositioningCube = function(event) {
			if (event) {
				event.preventDefault();

				that._mouse.set((event.clientX/window.innerWidth)*2-1, -(event.clientY/window.innerHeight )*2+1);
			}

			that._raycaster.setFromCamera(that._mouse, that._camera);

			var intersects = that._raycaster.intersectObject(that._basePlane);

			if ( intersects.length > 0 ) {
				that._positioningCube.visible = true;

				var intersect = intersects[0];

				that._positioningCube.position.copy( intersect.point ).add( intersect.face.normal );
				that._positioningCube.position.divideScalar(that._voxelSize).floor().multiplyScalar(that._voxelSize).addScalar((that._voxelSize/2));

				if (that._isPainting) that.paint();
                else if (that._isErasing) that.erase();
			}
			else that._positioningCube.visible = false;
		};

		this.mouseDown = function(event) {
            event.preventDefault();

            if (that.getIsLeftMouseButton(event)) {
                that._isPainting = true;

                that.paint();
            }
            else if (that.getIsRightMouseButton(event)) {
                that._isErasing = true;

                that.erase();
            }

            return false;
		};

		this.mouseUp = function(event) {
            event.preventDefault();

            if (that.getIsLeftMouseButton(event)) that._isPainting = false;
            else if (that.getIsRightMouseButton(event)) that._isErasing = false;

            return false;
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

        this.paint = function() {
            if (that._positioningCube.visible) {
                var position = {
                    x: that._positioningCube.position.x,
                    y: that._positioningCube.position.y,
                    z: that._positioningCube.position.z
                };
                
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

                if (positionExists) that.erase(position);

                if (that._selectedShape.toLowerCase() == "square") that._voxels.push(that.addCube(position, spacePosition));
                else if (that._selectedShape.toLowerCase() == "triangle") that._voxels.push(that.addTriangle(position, spacePosition));
                else if (that._selectedShape.toLowerCase() == "pyramid") that._voxels.push(that.addPyramid(position, spacePosition));
            }
        };

        this.addCube = function(position, spacePosition) {
            var voxelGeometry = new THREE.BoxGeometry(that._voxelSize, that._voxelSize, that._voxelSize);
            var voxelMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(that._selectedColor) });

            var voxelMesh = new THREE.Mesh(voxelGeometry, voxelMaterial);
            voxelMesh.position.x = position.x;
            voxelMesh.position.y = position.y;
            voxelMesh.position.z = position.z;

            voxelMesh.rotation.y = that._xRotation;
            voxelMesh.rotation.x = that._yRotation;

            that._scene.add(voxelMesh);

            return {
                position: {
                    x: spacePosition.x,
                    y: spacePosition.y,
                    z: spacePosition.z
                },
                shape: "cube",
                color: that._selectedColor,
                xRotation: that._xRotation,
                yRotation: that._yRotation,
                mesh: voxelMesh
            };
        }

        this.addTriangle = function(position, spacePosition) {
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

            var voxelMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(that._selectedColor) });

            var voxelMesh = new THREE.Mesh(voxelGeometry, voxelMaterial);
            voxelMesh.position.x = position.x;
            voxelMesh.position.y = position.y;
            voxelMesh.position.z = position.z;

            voxelMesh.rotation.y = that._xRotation;
            voxelMesh.rotation.x = that._yRotation;

            that._scene.add(voxelMesh);

            return {
                position: {
                    x: spacePosition.x,
                    y: spacePosition.y,
                    z: spacePosition.z
                },
                shape: "triangle",
                color: that._selectedColor,
                xRotation: that._xRotation,
                yRotation: that._yRotation,
                mesh: voxelMesh
            };
        };

        this.addPyramid = function(position, spacePosition) {
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

            var voxelMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(that._selectedColor) });

            var voxelMesh = new THREE.Mesh(voxelGeometry, voxelMaterial);
            voxelMesh.position.x = position.x;
            voxelMesh.position.y = position.y;
            voxelMesh.position.z = position.z;

            voxelMesh.rotation.y = that._xRotation;
            voxelMesh.rotation.x = that._yRotation;

            that._scene.add(voxelMesh);

            return {
                position: {
                    x: spacePosition.x,
                    y: spacePosition.y,
                    z: spacePosition.z
                },
                shape: "pyramid",
                color: that._selectedColor,
                xRotation: that._xRotation,
                yRotation: that._yRotation,
                mesh: voxelMesh
            };
        };

        this.erase = function(spacePosition) {
            var position = null;

            if (spacePosition != null) {
                position = spacePosition;
            }
            else {
                if (that._positioningCube.visible) {
                    var position = {
                        x: that._positioningCube.position.x,
                        y: that._positioningCube.position.y,
                        z: that._positioningCube.position.z
                    };
                }
            }

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
        };

        this.degToRad = function(degrees) {
          return degrees * Math.PI / 180;
        };

    	return {
    		start: function(container, startColor) {
                that._selectedColor = startColor;

    			that.init(container);
    		},

	        // ----- Public Methods

	        startRendering: function() {
	            that._keepRenderingScene = true;

	            render();
	        },

	        stopRendering: function() {
	            that._keepRenderingScene = false;
	        },

	        getLevel: function() {
	        	return that._level;
	        },

	        setLevel: function(level) {
	        	if (level >= 0) {
			    	that._basePlane.position.y = (level*that._voxelSize);
			    	that._baseGrid.position.y = (level*that._voxelSize);

	        		that._positioningCube.position.y = (level*that._voxelSize)+(that._voxelSize/2);

			    	that._level = level;

                    if (that._isPainting) that.paint();
                    else if (that._isErasing) that.erase();
			    }
	        },

            setColor: function(color) {
                that._selectedColor = "#" + color;
                that.updatePositioningVoxelColor();
            },

            getColor: function() {
                return that._selectedColor;
            },

            setShape: function(shape) {
                that._selectedShape = shape;

                that._xRotation = 0;
                that._yRotation = 0;
            },

            setXRotation: function(deg) {
                that._xRotation += that.degToRad(deg);

                if (that._xRotation === (Math.PI*2)) that._xRotation = 0;
                else if (that._xRotation === ((Math.PI*-1)*2)) that._xRotation = 0;
            },

            setYRotation: function(deg) {
                that._yRotation += that.degToRad(deg);

                if (that._yRotation === (Math.PI*2)) that._yRotation = 0;
                else if (that._yRotation === ((Math.PI*-1)*2)) that._yRotation = 0;
            }
    	};
    };

    if(!window.LevelEditor) window.LevelEditor = LevelEditor;
})();