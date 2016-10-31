THREE.MarbleViewEngine = function (sceneVoxels, voxelSize, scene, voxels) {
    this.addCube = function(sceneVoxel) {
        var voxelGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
        var voxelMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(sceneVoxel.color) });

        var voxelMesh = new THREE.Mesh(voxelGeometry, voxelMaterial);
        voxelMesh.position.x = (sceneVoxel.position.x*voxelSize)+(voxelSize/2);
        voxelMesh.position.y = (sceneVoxel.position.y*voxelSize)+(voxelSize/2);
        voxelMesh.position.z = (sceneVoxel.position.z*voxelSize)+(voxelSize/2);

        if (sceneVoxel.xRotation) voxelMesh.rotation.y = sceneVoxel.xRotation;
        if (sceneVoxel.yRotation) voxelMesh.rotation.x = sceneVoxel.yRotation;

        scene.add(voxelMesh);

        if (voxels) {
	        voxels.push({
	            position: {
	                x: sceneVoxel.position.x,
	                y: sceneVoxel.position.y,
	                z: sceneVoxel.position.z
	            },
	            shape: "cube",
	            color: sceneVoxel.color,
	            xRotation: sceneVoxel.xRotation,
	            yRotation: sceneVoxel.yRotation,
	            mesh: voxelMesh
	        });
	    }
    }

    this.addTriangle = function(sceneVoxel) {
        var voxelGeometry = new THREE.Geometry();

        voxelGeometry.vertices = [
            new THREE.Vector3( (voxelSize/2)*-1, (voxelSize/2)*-1, (voxelSize/2)*-1 ),
            new THREE.Vector3( (voxelSize/2), (voxelSize/2)*-1, (voxelSize/2)*-1 ),
            new THREE.Vector3( (voxelSize/2), (voxelSize/2)*-1, (voxelSize/2) ),
            new THREE.Vector3( (voxelSize/2)*-1, (voxelSize/2)*-1, (voxelSize/2)),
            new THREE.Vector3( (voxelSize/2), (voxelSize/2), (voxelSize/2)),
            new THREE.Vector3( (voxelSize/2), (voxelSize/2), (voxelSize/2)*-1)
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

        var voxelMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(sceneVoxel.color) });

        var voxelMesh = new THREE.Mesh(voxelGeometry, voxelMaterial);
        voxelMesh.position.x = (sceneVoxel.position.x*voxelSize)+(voxelSize/2);
        voxelMesh.position.y = (sceneVoxel.position.y*voxelSize)+(voxelSize/2);
        voxelMesh.position.z = (sceneVoxel.position.z*voxelSize)+(voxelSize/2);

        if (sceneVoxel.xRotation) voxelMesh.rotation.y = sceneVoxel.xRotation;
        if (sceneVoxel.yRotation) voxelMesh.rotation.x = sceneVoxel.yRotation;

        scene.add(voxelMesh);

        if (voxels) {
	        voxels.push({
	            position: {
	                x: sceneVoxel.position.x,
	                y: sceneVoxel.position.y,
	                z: sceneVoxel.position.z
	            },
	            shape: "triangle",
	            color: sceneVoxel.color,
	            xRotation: sceneVoxel.xRotation,
	            yRotation: sceneVoxel.yRotation,
	            mesh: voxelMesh
	        });
        }
    };

    this.addPyramid = function(sceneVoxel) {
        var voxelGeometry = new THREE.Geometry();

        voxelGeometry.vertices = [
            new THREE.Vector3( (voxelSize/2)*-1, (voxelSize/2)*-1, (voxelSize/2)*-1 ),
            new THREE.Vector3( (voxelSize/2), (voxelSize/2)*-1, (voxelSize/2)*-1 ),
            new THREE.Vector3( (voxelSize/2), (voxelSize/2)*-1, (voxelSize/2) ),
            new THREE.Vector3( (voxelSize/2)*-1, (voxelSize/2)*-1, (voxelSize/2)),
            new THREE.Vector3( 0, (voxelSize/2), 0)
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

        var voxelMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(sceneVoxel.color) });

        var voxelMesh = new THREE.Mesh(voxelGeometry, voxelMaterial);
        voxelMesh.position.x = (sceneVoxel.position.x*voxelSize)+(voxelSize/2);
        voxelMesh.position.y = (sceneVoxel.position.y*voxelSize)+(voxelSize/2);
        voxelMesh.position.z = (sceneVoxel.position.z*voxelSize)+(voxelSize/2);

        if (sceneVoxel.xRotation) voxelMesh.rotation.y = sceneVoxel.xRotation;
        if (sceneVoxel.yRotation) voxelMesh.rotation.x = sceneVoxel.yRotation;

        scene.add(voxelMesh);
        
        if (voxels) {
	        voxels.push({
	            position: {
	                x: sceneVoxel.position.x,
	                y: sceneVoxel.position.y,
	                z: sceneVoxel.position.z
	            },
	            shape: "pyramid",
	            color: sceneVoxel.color,
	            xRotation: sceneVoxel.xRotation,
	            yRotation: sceneVoxel.yRotation,
	            mesh: voxelMesh
	        });
	    }
    };

    for (var i=0; i<sceneVoxels.length; i++) {
    	if (sceneVoxels[i].shape == "cube") this.addCube(sceneVoxels[i]);
    	else if (sceneVoxels[i].shape == "triangle") this.addTriangle(sceneVoxels[i]);
    	else if (sceneVoxels[i].shape == "pyramid") this.addPyramid(sceneVoxels[i]);
    }
};