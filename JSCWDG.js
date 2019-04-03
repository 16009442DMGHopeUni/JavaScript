var createScene = function() 
{
    // Scene Initilisation
    var scene = new BABYLON.Scene(engine);

    // Camera Setup and Limit
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(1000, 1000, 1000));
    camera.attachControl(canvas, true);
    camera.panningDistanceLimit = 100;
    camera.upperBetaLimit = 80.00;
	camera.lowerBetaLimit = 20.00;
	camera.lowerRadiusLimit = 300;
	camera.upperRadiusLimit = 1200;
                              
    // Light
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    var pl = new BABYLON.PointLight("pl", new BABYLON.Vector3(0, 0, 0), scene);
    pl.diffuse = new BABYLON.Color3(1, 1, 1);
    pl.specular = new BABYLON.Color3(1, 1, 0.8);
    pl.intensity = 0.95;
    pl.position = camera.position;
    
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Panel
    var panel = new BABYLON.GUI.StackPanel();  
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM  
    advancedTexture.addControl(panel); 

    // Pause Button
    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Pause");
    button1.width = "150px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() 
    {
        alert("Click Ok to Resume");
    });
    panel.addControl(button1);

    var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Test");
    button2.width = "150px"
    button2.height = "40px";
    button2.color = "white";
    button2.cornerRadius = 20;
    button2.background = "blue"; 
    panel.addControl(button2);

	//Keyboard Observables
    scene.onKeyboardObservable.add((kbInfo) => 
    {
        switch (kbInfo.type) 
        {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
            console.log("KEY DOWN: ", kbInfo.event.key);
            break;
            case BABYLON.KeyboardEventTypes.KEYUP:
            console.log("KEY UP: ", kbInfo.event.keyCode);
            break;
        }
    });
    
	//Mouse Observables
    scene.onPointerObservable.add((pointerInfo) => 
    {
        switch (pointerInfo.type) 
        {
            case BABYLON.PointerEventTypes.POINTERDOWN:
            console.log("POINTER DOWN");
            break;
            case BABYLON.PointerEventTypes.POINTERUP:
            console.log("POINTER UP");
            break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
            console.log("POINTER MOVE");
            break;
            case BABYLON.PointerEventTypes.POINTERWHEEL:
            console.log("POINTER WHEEL");
            break;
            case BABYLON.PointerEventTypes.POINTERPICK:
            console.log("POINTER PICK");
            break;
            case BABYLON.PointerEventTypes.POINTERTAP:
            console.log("POINTER TAP");
            break;
            case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
            console.log("POINTER DOUBLE-TAP");
            break;
        }
    });
    
	//Gizmo Initilisation
    var gizmoManager = new BABYLON.GizmoManager(scene);
    var utilLayer = new BABYLON.UtilityLayerRenderer(scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.scaleGizmoEnabled = true;         ///RESTRICT Scale Size 
    gizmoManager.boundingBoxGizmoEnabled = true;
    gizmoManager.snapDistance=Math.PI/8;            //Restricts rotation speed
    gizmoManager.gizmos.scaleGizmo.snapDistance = 0.0003;
  
    // Modify gizmos based on keypress
    document.onkeydown = (e)=>{
        if(e.key == 'w' || e.key == 'e'|| e.key == 'r'|| e.key == 'q'){
            // Switch gizmo type
            gizmoManager.positionGizmoEnabled = false;
            gizmoManager.rotationGizmoEnabled = false;
            gizmoManager.scaleGizmoEnabled = false;
            gizmoManager.boundingBoxGizmoEnabled = false;
            if(e.key == 'w'){
                gizmoManager.positionGizmoEnabled = true;
            }
            if(e.key == 'e'){
                gizmoManager.rotationGizmoEnabled = true;
            }
            if(e.key == 'r'){
                gizmoManager.scaleGizmoEnabled = true;
            }
            if(e.key == 'q'){
                gizmoManager.boundingBoxGizmoEnabled = true;
            }
        }
    }

	//Skybox
    var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.dds", scene);
    var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 4000.0, scene);
    hdrSkybox.isPickable = false;
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	hdrSkyboxMaterial.microSurface = 1.0;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;
	
	//Advanced Meshes//
	// Metal Sphere
    var sphereMetal = BABYLON.Mesh.CreateSphere("sphereMetal", 48, 50.0, scene);
    sphereMetal.translate(new BABYLON.Vector3(100, 50, 0), 3);
	// Texture
	var metal = new BABYLON.PBRMaterial("metal", scene);
    metal.reflectionTexture = hdrTexture;
    metal.microSurface = 0.96;
    metal.reflectivityColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    metal.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);
    sphereMetal.material = metal;
	
	// Glass Sphere
    var sphereGlass = BABYLON.Mesh.CreateSphere("sphereGlass", 48, 50.0, scene);
    sphereGlass.translate(new BABYLON.Vector3(70, 50, 0), 3);
	// Texture
	var glass = new BABYLON.PBRMaterial("glass", scene);
    glass.reflectionTexture = hdrTexture;
    glass.refractionTexture = hdrTexture;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.microSurface = 1;
    glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    glass.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    sphereGlass.material = glass;
	
	// Plastic Sphere
    var spherePlastic = BABYLON.Mesh.CreateSphere("spherePlastic", 48, 50.0, scene);
    spherePlastic.translate(new BABYLON.Vector3(50, 50, 0), 3);
	// Texture
	var plastic = new BABYLON.PBRMaterial("plastic", scene);
    plastic.reflectionTexture = hdrTexture;
    plastic.microSurface = 0.96;
	plastic.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
	plastic.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);
    spherePlastic.material = plastic;
	
	// Ground
    var woodPlank = BABYLON.MeshBuilder.CreateBox("plane", { width: 1000, height: 10.0, depth: 1000 }, scene);
	// Texture
	var wood = new BABYLON.PBRMaterial("wood", scene);
    wood.reflectionTexture = hdrTexture;
    wood.environmentIntensity = 1;
    wood.specularIntensity = 0.3;
    wood.reflectivityTexture = new BABYLON.Texture("textures/reflectivity.png", scene);
    wood.useMicroSurfaceFromReflectivityMapAlpha = true;
    wood.albedoColor = BABYLON.Color3.White();
    wood.albedoTexture = new BABYLON.Texture("textures/albedo.png", scene);
    woodPlank.material = wood;

	// Layered Box
    var multiBox = BABYLON.Mesh.CreateBox("box01", 50, scene);
    multiBox.position = new BABYLON.Vector3(100, 100, 0);
	// Image URL
    var stoneDiffURL = "http://i.imgur.com/VSbN3Fc.png";
    var stoneNHURL = "http://i.imgur.com/zVGaZNi.png";
	// Texture
    var stoneDiffuseTexture = new BABYLON.Texture(stoneDiffURL, scene);
    var stoneNormalsHeightTexture = new BABYLON.Texture(stoneNHURL, scene);
    var normalsHeightTexture = stoneNormalsHeightTexture;
	// Material
    var material = new BABYLON.StandardMaterial("mtl01", scene);
    material.diffuseTexture = stoneDiffuseTexture;
    material.bumpTexture = stoneNormalsHeightTexture;
    material.useParallax = true;
    material.useParallaxOcclusion = true;
    material.parallaxScaleBias = 0.1;
    material.specularPower = 1000.0;
    material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    multiBox.material = material;
    

	//Meshes//
	// Immovable Sphere
    var sphereRadius = 38.0;
    var sphere = BABYLON.Mesh.CreateSphere("sphere", 10, sphereRadius * 2.0, scene);
    var matSphere = new BABYLON.StandardMaterial("ms", scene);
    matSphere.diffuseColor = BABYLON.Color3.Blue();
    matSphere.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);
    sphere.material = matSphere;

	// Particle Box
    var box = BABYLON.MeshBuilder.CreateBox("b", {size: 4}, scene);
                
	// Red Sphere						
    var redMat = new BABYLON.StandardMaterial("ground", scene);
    redMat.diffuseColor = new BABYLON.Color3.Red();
    redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    redMat.emissiveColor = BABYLON.Color3.Red();
    redMat.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", scene);
	redMat.diffuseTexture = new BABYLON.Texture("http://i.imgur.com/Wk1cGEq.png", scene);
	redMat.bumpTexture = new BABYLON.Texture("http://i.imgur.com/wGyk6os.png", scene);	
    var redSphere = BABYLON.MeshBuilder.CreateSphere("red", {diameter:80}, scene);
    redSphere.material = redMat;
    redSphere.position.y = 300;
    redSphere.position.x -= 150;
                                    
	// Green Sphere
    var greenMat = new BABYLON.StandardMaterial("greenGround", scene);
    greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    greenMat.emissiveColor = BABYLON.Color3.Green();
    greenMat.diffuseTexture = new BABYLON.Texture("textures/rock.png", scene);
  
    greenMat.diffuseTexture = new BABYLON.Texture("http://i.imgur.com/Wk1cGEq.png", scene);
	greenMat.bumpTexture = new BABYLON.Texture("http://i.imgur.com/wGyk6os.png", scene);	
    var greenSphere = BABYLON.MeshBuilder.CreateSphere("green", {diameter:80}, scene);
    greenSphere.material = greenMat;
    greenSphere.position.y = 150;
    greenSphere.position.x -= 300;

	// Blue Sphere
    var blueMat = new BABYLON.StandardMaterial("blueGround", scene);
    blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    blueMat.emissiveColor = BABYLON.Color3.Blue();
    blueMat.diffuseTexture = new BABYLON.Texture("textures/stars.png", scene);
    var blueSphere = BABYLON.MeshBuilder.CreateSphere("blue", {diameter:80}, scene);
    blueSphere.material = blueMat;
    blueSphere.position.y = 150;
    blueSphere.position.x -= 400;
	
	// Attach Meshes to Gizmo Manager
    gizmoManager.attachableMeshes = [blueSphere, greenSphere, redSphere, sphere, multiBox, sphereMetal, sphereGlass, spherePlastic];

    // Particle system
    var particleNb = 800;
    var SPS = new BABYLON.SolidParticleSystem('SPS', scene, {particleIntersection: true});
    SPS.addShape(box, particleNb);
    box.dispose();
    var mesh = SPS.buildMesh();
    SPS.isAlwaysVisible = true;
    var redHit=0;
                                
    // Position of immovable Sphere & Particle Emitter
    mesh.position.y = 150.0;
    mesh.position.x = -0.0;
    var sphereAltitude = mesh.position.y / 0.5;
    sphere.position.y = sphereAltitude;
                                
    // shared variables
    var speed = 10.9;                  // particle max speed			
    var cone = 0.4;                   // emitter aperture				
    var gravity = -speed / 100;       // gravity						
    var restitution = 0.98;           // energy restitution
    var k = 0.0;
    var sign = 1;

    //Temporary Positions for particles
	// current particle world position
    var tmpPosBox = BABYLON.Vector3.Zero(); 
	var tmpPosRedSphere = BABYLON.Vector3.Zero();  
	var tmpPosSphere = BABYLON.Vector3.Zero();
	var tmpPosGreenSphere = BABYLON.Vector3.Zero(); 
	var tmpPosBlueSphere = BABYLON.Vector3.Zero();
    var tmpPosMetalSphere = BABYLON.Vector3.Zero();
    var tmpPosGlassSphere = BABYLON.Vector3.Zero();
    var tmpPosPlasticSphere = BABYLON.Vector3.Zero();
	
	// current sphere normal on intersection point
    var tmpNormalBox = BABYLON.Vector3.Zero(); 
	var tmpNormalRedSphere = BABYLON.Vector3.Zero();
	var tmpNormalSphere = BABYLON.Vector3.Zero();
	var tmpNormalGreenSphere = BABYLON.Vector3.Zero();
	var tmpNormalBlueSphere = BABYLON.Vector3.Zero();
    var tmpNormalMetalSphere = BABYLON.Vector3.Zero();
	var tmpNormalGlassSphere = BABYLON.Vector3.Zero();
    var tmpNormalPlasticSphere = BABYLON.Vector3.Zero();
	
	// current dot product
    var tmpDotBox = 0.0;                            
	var tmpDotRedSphere = 0.0; 
    var tmpDotSphere = 0.0;
	var tmpDotGreenSphere = 0.0;
	var tmpDotBlueSphere = 0.0;
    var tmpDotMetalSphere = 0.0;
    var tmpDotGlassSphere = 0.0;
    var tmpDotPlasticSphere = 0.0;
        
	// SPS initialization : just recycle all
    SPS.initParticles = function()
    {
        for (var p = 0; p < SPS.nbParticles; p++) 
        {
            SPS.recycleParticle(SPS.particles[p]);
        }
    };
                                
	// recycle : reset the particle at the emitter origin
    SPS.recycleParticle = function(particle) 
    {
        particle.position.x = 0;
        particle.position.y = 0;
        particle.position.z = 0;
        //particle.velocity.x = Math.random() * speed;
        particle.velocity.x=(Math.random()-0.5)*cone*speed;
        particle.velocity.y = (Math.random() - 0.5) * cone * speed;
        particle.velocity.z = (Math.random() - 0.5) * cone * speed;
        particle.rotation.x = Math.random() * Math.PI;
        particle.rotation.y = Math.random() * Math.PI;
        particle.rotation.z = Math.random() * Math.PI;
        particle.color.r = 0.0;
        particle.color.g = 1.0;
        particle.color.b = 0.9;
        particle.color.a = 1.0;
    };
                                
	// particle behavior
    SPS.updateParticle = function(particle) 
    {  
		// recycle if touched the ground
        if ((particle.position.y + mesh.position.y) < woodPlank.position.y) 
        {
            this.recycleParticle(particle);
        }
                                    
		// update velocity, rotation and position
        particle.velocity.y += gravity;                         // apply gravity to y
        (particle.position).addInPlace(particle.velocity);      // update particle new position
        sign = (particle.idx % 2 == 0) ? 1 : -1;                // rotation sign and then new value
        particle.rotation.z += 0.1 * sign;
        particle.rotation.x += 0.05 * sign;
        particle.rotation.y += 0.008 * sign;
                                
	//Mesh Intersections
	if (particle.intersectsMesh(sphereMetal)) 
	{
		particle.position.addToRef(mesh.position, tmpPosMetalSphere);                  
		tmpPosMetalSphere.subtractToRef(sphereMetal.position, tmpNormalMetalSphere);                   
		tmpNormalMetalSphere.normalize();                                              
		tmpDotMetalSphere = BABYLON.Vector3.Dot(particle.velocity, tmpNormalMetalSphere);   
        
		// bounce result computation
		particle.velocity.x = -particle.velocity.x + 2.0 * tmpDotMetalSphere * tmpNormalMetalSphere.x;
		particle.velocity.y = -particle.velocity.y + 2.0 * tmpDotMetalSphere * tmpNormalMetalSphere.y;
		particle.velocity.z = -particle.velocity.z + 4.0 * tmpDotMetalSphere * tmpNormalMetalSphere.z;
		particle.velocity.scaleInPlace(restitution);                     
		
		particle.color.r = 0.5;
		particle.color.g = 0.1;
		particle.color.b = 0.1;
		particle.color.a = 1.0;   
	}

	if (particle.intersectsMesh(sphereGlass)) 
	{
		particle.position.addToRef(mesh.position, tmpPosGlassSphere);                  
		tmpPosGlassSphere.subtractToRef(sphereGlass.position, tmpNormalGlassSphere);                   
		tmpNormalGlassSphere.normalize();                                              
		tmpDotGlassSphere = BABYLON.Vector3.Dot(particle.velocity, tmpNormalGlassSphere);   
        
		// bounce result computation
		particle.velocity.x = -particle.velocity.x + 2.0 * tmpDotGlassSphere * tmpNormalGlassSphere.x;
		particle.velocity.y = -particle.velocity.y + 2.0 * tmpDotGlassSphere * tmpNormalGlassSphere.y;
		particle.velocity.z = -particle.velocity.z + 2.0 * tmpDotGlassSphere * tmpNormalGlassSphere.z;
		particle.velocity.scaleInPlace(restitution);                     

		particle.color.r = 0.0;
		particle.color.g = 0.5;
		particle.color.b = 0.1;
		particle.color.a = 1.0;   
	}

	if (particle.intersectsMesh(spherePlastic)) 
	{
		particle.position.addToRef(mesh.position, tmpPosPlasticSphere);                  
		tmpPosPlasticSphere.subtractToRef(spherePlastic.position, tmpNormalPlasticSphere);                   
		tmpNormalPlasticSphere.normalize();                                              
		tmpDotPlasticSphere = BABYLON.Vector3.Dot(particle.velocity, tmpNormalPlasticSphere);   
        
		// bounce result computation
		particle.velocity.x = -particle.velocity.x + 2.0 * tmpDotPlasticSphere * tmpNormalPlasticSphere.x;
		particle.velocity.y = -particle.velocity.y + 2.0 * tmpDotPlasticSphere * tmpNormalPlasticSphere.y;
		particle.velocity.z = -particle.velocity.z + 2.0 * tmpDotPlasticSphere * tmpNormalPlasticSphere.z;
		particle.velocity.scaleInPlace(restitution);                     

		particle.color.r = 0.0;
		particle.color.g = 0.0;
		particle.color.b = 0.5;
		particle.color.a = 1.0;   
	}

	if (particle.intersectsMesh(multiBox)) 
	{
		particle.position.addToRef(mesh.position, tmpPosBox);                  // particle World position
		tmpPosBox.subtractToRef(multiBox.position, tmpNormalBox);                   // normal to the sphere
		tmpNormalBox.normalize();                                              // normalize the sphere normal
		tmpDotBox = BABYLON.Vector3.Dot(particle.velocity, tmpNormalBox);   
        
		// bounce result computation
		particle.velocity.x = -particle.velocity.x + 2.0 * tmpDotBox * tmpNormalBox.x;
		particle.velocity.y = -particle.velocity.y + 2.0 * tmpDotBox * tmpNormalBox.y;
		particle.velocity.z = -particle.velocity.z + 2.0 * tmpDotBox * tmpNormalBox.z;
		particle.velocity.scaleInPlace(restitution);                                    // aply restitution
  
		particle.color.r = 0.0;
		particle.color.g = 0.0;
		particle.color.b = 0.1;
		particle.color.a = 1.0;
	}

	if (particle.intersectsMesh(redSphere)) 
	{
		redHit++;
		particle.position.addToRef(mesh.position, tmpPosRedSphere);                  
		tmpPosRedSphere.subtractToRef(redSphere.position, tmpNormalRedSphere);       
		tmpNormalRedSphere.normalize();                                                      
		tmpDotRedSphere = BABYLON.Vector3.Dot(particle.velocity, tmpNormalRedSphere);           
		
		// bounce result computation
        particle.velocity.x = -particle.velocity.x + 2.0 * tmpDotRedSphere * tmpNormalRedSphere.x;
		particle.velocity.y = -particle.velocity.y + 2.0 * tmpDotRedSphere * tmpNormalRedSphere.y;
		particle.velocity.z = -particle.velocity.z + 2.0 * tmpDotRedSphere * tmpNormalRedSphere.z;
		particle.velocity.scaleInPlace(restitution);                      
            
		particle.color.r = 5.0;
		particle.color.g = 0.0;
		particle.color.b = 0.0;
		particle.color.a = 1.0;
    
	}
	console.log('redHit')
                         
	if (particle.intersectsMesh(sphere)) 
	{
		particle.position.addToRef(mesh.position, tmpPosSphere);                  
		tmpPosSphere.subtractToRef(sphere.position, tmpNormalSphere);                   
		tmpNormalSphere.normalize();                                              
		tmpDotSphere = BABYLON.Vector3.Dot(particle.velocity, tmpNormalSphere);   
        
		// bounce result computation
		particle.velocity.x = -particle.velocity.x + 2.0 * tmpDotSphere * tmpNormalSphere.x;
		particle.velocity.y = -particle.velocity.y + 2.0 * tmpDotSphere * tmpNormalSphere.y;
		particle.velocity.z = -particle.velocity.z + 2.0 * tmpDotSphere * tmpNormalSphere.z;
		particle.velocity.scaleInPlace(restitution);                     

		particle.color.r = 0.0;
		particle.color.g = 0.0;
		particle.color.b = 0.5;
		particle.color.a = 1.0;   
	}

	if (particle.intersectsMesh(blueSphere)) 
	{
		particle.position.addToRef(mesh.position, tmpPosBlueSphere);                  
		tmpPosBlueSphere.subtractToRef(blueSphere.position, tmpNormalBlueSphere);                   
		tmpNormalBlueSphere.normalize();                                              
		tmpDotBlueSphere = BABYLON.Vector3.Dot(particle.velocity, tmpNormalBlueSphere);   
        
		// bounce result computation
		particle.velocity.x = -particle.velocity.x + 2.0 * tmpDotBlueSphere * tmpNormalBlueSphere.x;
		particle.velocity.y = -particle.velocity.y + 2.0 * tmpDotBlueSphere * tmpNormalBlueSphere.y;
		particle.velocity.z = -particle.velocity.z + 2.0 * tmpDotBlueSphere * tmpNormalBlueSphere.z;
		particle.velocity.scaleInPlace(restitution);                      
   
		particle.color.r = 0.0;
		particle.color.g = 0.0;
		particle.color.b = 5.0;
		particle.color.a = 1.0;    
	}

	if (particle.intersectsMesh(greenSphere)) 
	{
		particle.position.addToRef(mesh.position, tmpPosGreenSphere);                  
		tmpPosGreenSphere.subtractToRef(greenSphere.position, tmpNormalGreenSphere);                   
		tmpNormalGreenSphere.normalize();                                              
		tmpDotGreenSphere = BABYLON.Vector3.Dot(particle.velocity, tmpNormalGreenSphere);   
        
		// bounce result computation
		particle.velocity.x = -particle.velocity.x + 2.0 * tmpDotGreenSphere * tmpNormalGreenSphere.x;
		particle.velocity.y = -particle.velocity.y + 2.0 * tmpDotGreenSphere * tmpNormalGreenSphere.y;
		particle.velocity.z = -particle.velocity.z + 2.0 * tmpDotGreenSphere * tmpNormalGreenSphere.z;
		particle.velocity.scaleInPlace(restitution);                     
    
		particle.color.r = 0.0;
		particle.color.g = 5.0;
		particle.color.b = 0.0;
		particle.color.a = 1.0;     
	}};
                              
	// init all particle values
	SPS.initParticles();
                                
	//scene.debugLayer.show();
	// animation
	scene.registerBeforeRender(function() 
	{
		SPS.setParticles();
		sphere.position.x = 20.0 * Math.sin(k);
		sphere.position.z = 10.0 * Math.sin(k * 6.0);
		sphere.position.y = 5.0 * Math.sin(k * 10) + sphereAltitude;
		k += 0.00;
	});                          
	return scene;
};