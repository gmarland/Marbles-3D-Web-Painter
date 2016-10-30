THREE.FirstPersonControls = function (scene, camera, domElement, moveFunction) {
	this._movementSpeed = 10;

	this._moveFunction = moveFunction;

    this._scene = scene;

    // Set the camera up in the object  and rotate it 90 degrees on the y (we need to do this for positioning later)
	this._camera = camera;

	this._domElement = domElement;

	this._pitchObject = new THREE.Object3D();
	this._pitchObject.add(this._camera);

	this._yawObject = new THREE.Object3D();
	this._yawObject.add( this._pitchObject );

	this._scene.add(this._yawObject);

	this.onMouseDown = function ( event ) {
		if(getIsMiddleMouseButton(event)) this.moveCamera = true;
	};

	this.onMouseUp = function ( event ) {
		if(getIsMiddleMouseButton(event)) this.moveCamera = false;
	};

    function getIsMiddleMouseButton(event) {
        event = event || window.event;

        var button = event.which || event.button;

        return button == 2;
    }

	this.onMouseMove = function ( event ) {
		var PI_2 = Math.PI / 2;

		if (this.moveCamera) {
			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0,
				movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			this._yawObject.rotation.y -= movementX * 0.004;
			this._pitchObject.rotation.x -= movementY * 0.004;
		}
	};

	this.onKeyDown = function ( event ) {
		switch ( event.keyCode ) {

			case 87: /*W*/ this.moveForward = true; break;

			case 65: /*A*/ this.moveLeft = true; break;

			case 83: /*S*/ this.moveBackward = true; break;

			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

			case 81: /*Q*/ this.rotateLeft = true; break;
			case 69: /*E*/ this.rotateRight = true; break;

			case 90: /*C*/ this.rotateDown = true; break;
			case 67: /*Z*/ this.rotateUp = true; break;
		}
	};

	this.onKeyUp = function ( event ) {
		switch ( event.keyCode ) {

			case 87: /*W*/ this.moveForward = false; break;

			case 65: /*A*/ this.moveLeft = false; break;

			case 83: /*S*/ this.moveBackward = false; break;

			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

			case 81: /*Q*/ this.rotateLeft = false; break;
			case 69: /*E*/ this.rotateRight = false; break;

			case 90: /*C*/ this.rotateDown = false; break;
			case 67: /*Z*/ this.rotateUp = false; break;

		}
	};

	this.setCameraPosition = function(x, y, z) {
		this._yawObject.position.x = x;
		this._yawObject.position.y = y;
		this._yawObject.position.z = z;
	};

	this.update = function( delta ) {
		var actionOccured = false;

		// Actions to move the camera via keyboard commands
		if (this.moveForward) {
			this._yawObject.translateZ(-this._movementSpeed);
			actionOccured = true;
		}
		
		if (this.moveBackward) {
			this._yawObject.translateZ(this._movementSpeed);
			actionOccured = true;
		}

		if (this.moveLeft) {
			this._yawObject.translateX(-this._movementSpeed);
			actionOccured = true;
		}

		if (this.moveRight) {
			this._yawObject.translateX(this._movementSpeed);
			actionOccured = true;
		}

		if (this.moveUp) {
			this._yawObject.translateY(this._movementSpeed);
			actionOccured = true;
		}
		
		if (this.moveDown) {
			this._yawObject.translateY(-this._movementSpeed);
			actionOccured = true;
		}

		if (this.rotateLeft) {
			this._yawObject.rotation.y += 0.04;
			actionOccured = true;
		}

		if (this.rotateRight) {
			this._yawObject.rotation.y -= 0.04;
			actionOccured = true;
		}

		if (this.rotateUp) {
			this._pitchObject.rotation.x -= 0.04;
			actionOccured = true;
		}

		if (this.rotateDown) {
			this._pitchObject.rotation.x += 0.04;
			actionOccured = true;
		}

		if ((actionOccured) && (this._moveFunction)) {
			this._moveFunction();
		}
	};

	this.dispose = function() {
		this._domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this._domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this._domElement.removeEventListener( 'mouseup', _onMouseUp, false );
		this._domElement.removeEventListener( 'mouseleave', _onMouseUp, false );

		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );
	}

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onMouseDown = bind( this, this.onMouseDown );
	var _onMouseUp = bind( this, this.onMouseUp );
	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );

	this._domElement.addEventListener( 'mousemove', _onMouseMove, false );
	this._domElement.addEventListener( 'mousedown', _onMouseDown, false );
	this._domElement.addEventListener( 'mouseup', _onMouseUp, false );
	this._domElement.addEventListener( 'mouseleave',_onMouseUp, false );

	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );

	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	}
};