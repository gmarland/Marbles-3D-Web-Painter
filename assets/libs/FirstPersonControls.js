THREE.FirstPersonControls = function (scene, camera, maxDistance, readOnly, domElement, moveFunction) {
	this.enabled = true;

	this._readOnly = readOnly;

	this._movementSpeed = 10;

	this._moveFunction = moveFunction;

    this._scene = scene;

	this._camera = camera;

	this._maxDistance = maxDistance;	

	this._domElement = domElement;

	this._pitchObject = new THREE.Object3D();
	this._pitchObject.add(this._camera);

	this._yawObject = new THREE.Object3D();
	this._yawObject.add( this._pitchObject );

	this._scene.add(this._yawObject);

	this.onMouseDown = function ( event ) {
		if ((this.enabled) && (this.getIsMiddleMouseButton(event))) this.moveCamera = true;
		else if ((this.enabled) && (this._readOnly) && (this.getIsLeftMouseButton(event))) this.moveCamera = true;
	};

	this.onMouseUp = function ( event ) {
		if ((this.enabled) && (this.getIsMiddleMouseButton(event))) this.moveCamera = false;
		else if ((this.enabled) && (this._readOnly) && (this.getIsLeftMouseButton(event))) this.moveCamera = false;
	};

    this.getIsMiddleMouseButton = function(event) {
        event = event || window.event;

        var button = event.which || event.button;

        return button == 2;
    }

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

	this.onMouseMove = function ( event ) {
		if (this.moveCamera) {
			var PI_2 = Math.PI / 2;

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0,
				movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			// making the movement more natural for read only drawings
			if (this._readOnly) {
				this._yawObject.rotation.y += movementX * 0.004;
				this._pitchObject.rotation.x += movementY * 0.004;
			}
			else {
				this._yawObject.rotation.y -= movementX * 0.004;
				this._pitchObject.rotation.x -= movementY * 0.004;
			}
		}
	};

	this.onKeyDown = function ( event ) {
		if (this.enabled) {
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
				case 88: /*X*/ this.rotateUp = true; break;
			}

			// we want to move with arrow keys too if we're readonly
			if (this._readOnly) {
				switch ( event.keyCode ) {
					case 38: /*Up*/ this.moveForward = true; break;

					case 37: /*Left*/ this.moveLeft = true; break;

					case 40: /*Down*/ this.moveBackward = true; break;

					case 39: /*Right*/ this.moveRight = true; break;
				}
			}
		}
	};

	this.onKeyUp = function ( event ) {
		if (this.enabled) {
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
				case 88: /*X*/ this.rotateUp = false; break;
			}

			// we want to move with arrow keys too if we're readonly
			if (this._readOnly) {
				switch ( event.keyCode ) {
					case 38: /*Up*/ this.moveForward = false; break;

					case 37: /*Left*/ this.moveLeft = false; break;

					case 40: /*Down*/ this.moveBackward = false; break;

					case 39: /*Right*/ this.moveRight = false; break;
				}
			}
		}
	};

	this.setCameraPosition = function(x, y, z) {
		this._yawObject.position.x = x;
		this._yawObject.position.y = y;
		this._yawObject.position.z = z;
	};

	this.rotateCamera = function(x, y) {
		this._yawObject.rotation.y += x;
		this._pitchObject.rotation.x += y;

	}

	this.getCameraPosition = function() {
		return {
			position: {
				x: this._yawObject.position.x,
				y: this._yawObject.position.y,
				z:this._yawObject.position.z
			},
			rotation: {
				x: this._yawObject.rotation.y,
				y: this._pitchObject.rotation.x
			}
		}
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

		if (this._yawObject.position.z < (this._maxDistance*-1)) this._yawObject.position.z = (this._maxDistance*-1);
		if (this._yawObject.position.z > this._maxDistance) this._yawObject.position.z = this._maxDistance;

		if (this.moveLeft) {
			this._yawObject.translateX(-this._movementSpeed);
			actionOccured = true;
		}

		if (this.moveRight) {
			this._yawObject.translateX(this._movementSpeed);
			actionOccured = true;
		}

		if (this._yawObject.position.x < (this._maxDistance*-1)) this._yawObject.position.x = (this._maxDistance*-1);
		if (this._yawObject.position.x > this._maxDistance) this._yawObject.position.x = this._maxDistance;

		if (this.moveUp) {
			this._yawObject.translateY(this._movementSpeed);
			actionOccured = true;
		}
		
		if (this.moveDown) {
			this._yawObject.translateY(-this._movementSpeed);
			actionOccured = true;
		}

		if (this._yawObject.position.y < (this._maxDistance*-1)) this._yawObject.position.y = (this._maxDistance*-1);
		if (this._yawObject.position.y > this._maxDistance) this._yawObject.position.y = this._maxDistance;

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

		if ((actionOccured) && (this._moveFunction))  this._moveFunction();
	};

	this.cancelMovement = function() {
		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.moveUp = false;
		this.moveDown = false;
		this.rotateLeft = false;
		this.rotateRight = false;
		this.rotateUp = false;
		this.rotateDown = false;
	};

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onMouseDown = bind( this, this.onMouseDown );
	var _onMouseUp = bind( this, this.onMouseUp );
	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );

	this._domElement.addEventListener( 'mousemove', _onMouseMove, false );
	this._domElement.addEventListener( 'mousedown', _onMouseDown, false );
	this._domElement.addEventListener( 'mouseup', _onMouseUp, false );
	this._domElement.addEventListener( 'mouseleave',_onMouseUp, false );

	$(document).add($(parent.document)).on('keydown', _onKeyDown);
	$(document).add($(parent.document)).on('keyup', _onKeyUp);

	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	}
};