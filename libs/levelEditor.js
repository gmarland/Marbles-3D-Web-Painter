(function () {
    var LevelEditor = function() {
    	// ----- Internal properties

    	var that = this;

    	this._containerElement = null;
    	this._containerWidth = null;
    	this._containerHeight = null;

        this._keepRenderingScene = true;

    	this._scene = null;
    	this._directionalLight = null;
    	this._camera = null;

    	this._renderer = null;

        this._skyboxColor = 0xefefef;
        this._skyboxOpacity = 1;

        this._basePlane = null;
        this._baseGrid = null;

        // -----

        // ----- Constructor

    	function init(container) {
			that._containerElement = document.getElementById(container);
            that._containerWidth = document.body.clientWidth;
            that._containerHeight = document.body.clientHeight;

            that._scene = getScene();

           	that._directionalLight = getDirectionalLight();
            that._scene.add(that._directionalLight);

            that._camera = getCamera(that._containerWidth, that._containerHeight);
            that._scene.add(that._camera);

            that._basePlane = getBasePlane();
			that._scene.add(that._basePlane);

			that._baseGrid = getBaseGrid();
			that._scene.add(that._baseGrid);

			that._scene.add(that._baseGrid);

            that._renderer = getRenderer(that._containerWidth, that._containerHeight, that._skyboxColor, that._skyboxOpacity);
            that._containerElement.appendChild(that._renderer.domElement);

            render();

            bindEvents();
    	}

        // -----

    	function getScene() {
            return new THREE.Scene();
    	}

        function getCamera(containerWidth, containerHeight) {
        	var fov = 75,
        		aspect = (containerWidth/containerHeight),
        		far = 2000;

            var positionAt = {
            	x: 0,
            	y: 750,
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
			var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
			geometry.rotateX( - Math.PI / 2 );

			return new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
        }

        function getBaseGrid() {
			var size = 500, step = 50;

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

        function bindEvents() {
			window.addEventListener('resize', function(e) {
	            that._containerWidth = document.body.clientWidth;
	            that._containerHeight = document.body.clientHeight;

			    that._camera.aspect = (that._containerWidth / that._containerHeight);
			    that._camera.updateProjectionMatrix();

				that._renderer.setSize(that._containerWidth, that._containerHeight);
			}, false );
        }

        // ----- Public Methods

        LevelEditor.prototype.startRendering = function() {
            that._keepRenderingScene = true;

            render();
        };

        LevelEditor.prototype.stopRendering = function() {
            that._keepRenderingScene = false;
        };

    	return {
    		start: function(container) {
    			init(container);
    		}
    	};
    };

    if(!window.LevelEditor) window.LevelEditor = LevelEditor;
})();