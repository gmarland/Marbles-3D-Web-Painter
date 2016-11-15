(function () {
    var LevelViewer = function() {
    	// ----- Private Properties

    	var that = this;

        this._shareId = null;

        this._sceneName = null;

        this._clock = null;

    	this._containerElement = null;
    	this._containerWidth = null;
    	this._containerHeight = null;

    	this._scene = null;

        this._marblesViewEngine = null;

		this._raycaster = null;
		this._mouse = null;

    	this._lights = [];

    	this._camera = null;
        this._controls = null;

    	this._renderer = null;

        this._skyboxColor = 0xefefef;
        this._skyboxOpacity = 1;

        this._basePlaneWidth = 1000;
        this._voxelSize = 10;

        // ----- Constructor

    	this.init = function(container) {
            that._clock = new THREE.Clock();

			that._containerElement = document.getElementById(container);
            that._containerWidth = document.body.clientWidth;
            that._containerHeight = document.body.clientHeight;

            that._scene = new THREE.Scene();

            that._marblesViewEngine = THREE.MarblesViewEngine(that._scene, that._voxelSize);

			that._raycaster = new THREE.Raycaster();
			that._mouse = new THREE.Vector2();

           	that._lights = that.getLighting();

            for (var i=0; i<that._lights.length; i++) that._scene.add(that._lights[i]);

            that._camera = that.getCamera(that._containerWidth, that._containerHeight);
            that._scene.add(that._camera);

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
			return new THREE.FirstPersonControls(scene, camera, (that._basePlaneWidth*1.5), domElement);
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
               if (that._controls) that._controls.update(that._clock.getDelta());
            };

            function renderScene() {
                requestAnimationFrame( renderScene );

                updateScene();

                that._renderer.render(that._scene, that._camera);
            };

            renderScene();
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

            // ----- Property Accessors

            getId: function() {
                return that._sceneId;
            },

            getShareId: function() {
                return that._shareId;
            },

            getName: function() {
                return that._sceneName;
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

            // ----- Public Methods

            load: function(sceneId) {
                var local = this;

                that._sceneId = sceneId;

                $.ajax({
                    url: "/scene/readonly/" + that._sceneId,
                    type: "GET",
                    success: function (response) {
                        if ((response != null) && (typeof response === 'object')) {
                            var minX = 0,
                                maxX = 0,
                                minY = 0,
                                maxY = 0,
                                minZ = 0,
                                maxZ = 0;
                                
                            that._sceneName = response.name;

                            that._shareId = response.shareId;

                            that._marblesViewEngine.loadScene(response.data, true);

                            if (local.onLoad) local.onLoad(true);
                        }
                        else local.onLoad(false);
                    },
                    error: function(response) {
                        if (local.onError) local.onError(response);
                    }
                });
            }
    	};
    };

    if(!window.LevelViewer) window.LevelViewer = LevelViewer;
})();