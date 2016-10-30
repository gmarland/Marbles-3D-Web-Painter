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

        this._selectedColor = "#000000";

        this._cubes = [];

        // -----

        // ----- Constructor

    	var init = function(container) {
            that._clock = new THREE.Clock();

			that._containerElement = document.getElementById(container);
            that._containerWidth = document.body.clientWidth;
            that._containerHeight = document.body.clientHeight;

            that._scene = new THREE.Scene();

			that._raycaster = new THREE.Raycaster();
			that._mouse = new THREE.Vector2();

           	that._directionalLight = getDirectionalLight();
            that._scene.add(that._directionalLight);

            that._camera = getCamera(that._containerWidth, that._containerHeight);
            that._scene.add(that._camera);

            that._basePlane = getBasePlane();
			that._scene.add(that._basePlane);

			that._baseGrid = getBaseGrid();
			that._scene.add(that._baseGrid);

			that._positioningCube = getPositioningVoxel();
			that._scene.add(that._positioningCube);			

			that._scene.add(that._baseGrid);

            that._renderer = getRenderer(that._containerWidth, that._containerHeight, that._skyboxColor, that._skyboxOpacity);
            that._containerElement.appendChild(that._renderer.domElement);

            that._controls = getControls(that._scene, that._camera, that._renderer.domElement);
            that._controls.setCameraPosition(0, 600, 750);

            render();

            bindWindowEvents();
    	};

        // -----

        var getCamera = function(containerWidth, containerHeight) {
        	var fov = 75,
        		aspect = (containerWidth/containerHeight),
        		far = 2000;

            return new THREE.PerspectiveCamera(fov, aspect, 0.1, far);
        };

       	var getControls = function(scene, camera, domElement) {
			return new THREE.FirstPersonControls(scene, camera, domElement, function() {
                repositionPositioningCube();

                if (that._isPainting) paint();
                else if (that._isErasing) erase();
            });
       	};

        var getDirectionalLight = function() {               
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

        var getBasePlane = function() {
			var geometry = new THREE.PlaneBufferGeometry(that._basePlaneWidth, that._basePlaneWidth);
			geometry.rotateX( - Math.PI / 2 );

			return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        };

        var getBaseGrid = function() {
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

        var getPositioningVoxel = function() {
			var positioningGeometry = new THREE.BoxGeometry(that._voxelSize, that._voxelSize, that._voxelSize);
			var positioningMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color(that._selectedColor), opacity: 0.5, transparent: true } );

			var positioningMesh = new THREE.Mesh(positioningGeometry, positioningMaterial);
			positioningMesh.visible = false;

			return positioningMesh;
        };

        var updatePositioningVoxelColor = function() {
            that._positioningCube.material.color = new THREE.Color(that._selectedColor);
        };

        // -----

    	var getRenderer = function(containerWidth, containerHeight, skyboxColor, skyboxOpacity) {
            var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(containerWidth, containerHeight);
            renderer.setClearColor(skyboxColor, skyboxOpacity);

            return renderer;
    	};

       	var render = function() {
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

        var bindWindowEvents = function() {
			window.addEventListener('resize', function(e) {
	            that._containerWidth = document.body.clientWidth;
	            that._containerHeight = document.body.clientHeight;

			    that._camera.aspect = (that._containerWidth / that._containerHeight);
			    that._camera.updateProjectionMatrix();

				that._renderer.setSize(that._containerWidth, that._containerHeight);
			}, false );

			document.addEventListener('mousemove', repositionPositioningCube, false);

			document.addEventListener('mousedown', mouseDown, false);

			document.addEventListener('mouseup', mouseUp, false);
        };


		var repositionPositioningCube = function(event) {
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

				if (that._isPainting) paint();
                else if (that._isErasing) erase();
			}
			else that._positioningCube.visible = false;
		};

		var mouseDown = function(event) {
            event.preventDefault();

            if (getIsLeftMouseButton(event)) {
                that._isPainting = true;

                paint();
            }
            else if (getIsRightMouseButton(event)) {
                that._isErasing = true;

                erase();
            }

            return false;
		};

		var mouseUp = function(event) {
            event.preventDefault();

            if (getIsLeftMouseButton(event)) that._isPainting = false;
            else if (getIsRightMouseButton(event)) that._isErasing = false;

            return false;
		};

        var getIsLeftMouseButton = function(event) {
            event = event || window.event;

            var button = event.which || event.button;

            return button == 1;
        };

        var getIsRightMouseButton = function(event) {
            event = event || window.event;

            var button = event.which || event.button;

            return button == 3;
        };

		//-----

        //----- Painting methods

        var paint = function() {
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

                for (var i=0; i<that._cubes.length; i++) {
                    if ((that._cubes[i].position.x === spacePosition.x) &&
                        (that._cubes[i].position.y === spacePosition.y) && 
                        (that._cubes[i].position.z === spacePosition.z)) {
                        positionExists = true;

                        break;
                    }
                }

                if (positionExists) erase(position);

    			var voxelGeometry = new THREE.BoxGeometry(that._voxelSize, that._voxelSize, that._voxelSize);
    			var voxelMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(that._selectedColor) });

    			var voxelMesh = new THREE.Mesh(voxelGeometry, voxelMaterial);
    			voxelMesh.position.x = position.x;
    			voxelMesh.position.y = position.y;
    			voxelMesh.position.z = position.z;

    			that._scene.add(voxelMesh);

    	        that._cubes.push({
                    position: {
                        x: spacePosition.x,
                        y: spacePosition.y,
                        z: spacePosition.z
                    },
                    color: that._selectedColor,
                    mesh: voxelMesh
                });
            }
        };

        var erase = function(spacePosition) {
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

                for (var i=(that._cubes.length-1); i>=0; i--) {
                    if ((that._cubes[i].position.x === spacePosition.x) &&
                        (that._cubes[i].position.y === spacePosition.y) && 
                        (that._cubes[i].position.z === spacePosition.z)) {
                        that._scene.remove(that._cubes[i].mesh);;

                        that._cubes.splice(i,1);
                        break;
                    }
                }
            }
        }


    	return {
    		start: function(container, startColor) {
                that._selectedColor = startColor;

    			init(container);
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

                    if (that._isPainting) paint();
                    else if (that._isErasing) erase();
			    }
	        },

            setColor: function(color) {
                that._selectedColor = "#" + color;
                updatePositioningVoxelColor();
            },

            getColor: function() {
                return that._selectedColor;
            }
    	};
    };

    if(!window.LevelEditor) window.LevelEditor = LevelEditor;
})();