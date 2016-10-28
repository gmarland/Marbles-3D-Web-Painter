(function () {
    var LevelEditor = function() {
    	// ----- Private Properties

    	var that = this;

    	this._containerElement = null;
    	this._containerWidth = null;
    	this._containerHeight = null;

        this._keepRenderingScene = true;

    	this._scene = null;

		this._raycaster = null;
		this._mouse = null;

    	this._directionalLight = null;
    	this._camera = null;

    	this._renderer = null;

        this._skyboxColor = 0xefefef;
        this._skyboxOpacity = 1;

        this._basePlaneWidth = 1000;
        this._basePlane = null;
        this._baseGrid = null;

        this._positioningCube = null;

        this._voxelSize = 50;

        this._level = 0;

        this.cubes = [];

        // -----

        // ----- Constructor

    	function init(container) {
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

            render();

            bindWindowEvents();
    	}

        // -----

        function getCamera(containerWidth, containerHeight) {
        	var fov = 75,
        		aspect = (containerWidth/containerHeight),
        		far = 2000;

            var positionAt = {
            	x: 0,
            	y: 600,
            	z: 750
            };

            var lookAt = {
            	x: 0,
            	y: 0,
            	z: 0
            };

            var camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, far);

            camera.position.x = positionAt.x;
            camera.position.y = positionAt.y;
            camera.position.z = positionAt.z;

            camera.lookAt(new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z));

            return camera;
        }

        function getDirectionalLight() {               
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
        }

        // ----- Methods for creating base plane

        function getBasePlane() {
			var geometry = new THREE.PlaneBufferGeometry(that._basePlaneWidth, that._basePlaneWidth);
			geometry.rotateX( - Math.PI / 2 );

			return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        }

        function getBaseGrid() {
			var size = that._basePlaneWidth/2, 
				step = that._voxelSize;

			var geometry = new THREE.Geometry();

			for ( var i = - size; i <= size; i += step ) {
				geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
				geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

				geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
				geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
			}

			var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );

			return new THREE.LineSegments( geometry, material );
        }

        function getPositioningVoxel() {
			var positioningGeometry = new THREE.BoxGeometry(that._voxelSize, that._voxelSize, that._voxelSize);
			var positioningMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );

			var positioningMesh = new THREE.Mesh(positioningGeometry, positioningMaterial);
			positioningMesh.visible = false;

			return positioningMesh;
        }

        // -----

    	function getRenderer(containerWidth, containerHeight, skyboxColor, skyboxOpacity) {
            var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(containerWidth, containerHeight);
            renderer.setClearColor(skyboxColor, skyboxOpacity);

            return renderer;
    	}

       	function render() {
            function updateScene() {
            };

            function renderScene() {
                if (that._keepRenderingScene) requestAnimationFrame( renderScene );

                updateScene();

                that._renderer.render(that._scene, that._camera);
            };

            renderScene();
        };

        //----- Mouse binding events

        function bindWindowEvents() {
			window.addEventListener('resize', function(e) {
	            that._containerWidth = document.body.clientWidth;
	            that._containerHeight = document.body.clientHeight;

			    that._camera.aspect = (that._containerWidth / that._containerHeight);
			    that._camera.updateProjectionMatrix();

				that._renderer.setSize(that._containerWidth, that._containerHeight);
			}, false );

			document.addEventListener('mousemove', repositionPositioningCube, false);
        }


		function repositionPositioningCube(event) {
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
			}
			else that._positioningCube.visible = false;
		}

		//-----

    	return {
    		start: function(container) {
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
	        		that._positioningCube.visible = false;
	        		
			    	that._basePlane.position.y = (level*that._voxelSize);
			    	that._baseGrid.position.y = (level*that._voxelSize);

			    	that._level = level;
			    }
	        }

			//-----
    	};
    };

    if(!window.LevelEditor) window.LevelEditor = LevelEditor;
})();