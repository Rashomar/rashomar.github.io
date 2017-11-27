        let div = document.getElementById('cont');


        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
        let renderer = new THREE.WebGLRenderer( );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0x000000 );
        document.body.appendChild( renderer.domElement );


        // load 3d model
        let myObj;
        let loader = new THREE.ObjectLoader();
        loader.load("ferrari1.json",function ( obj ) {
              console.log( obj.rotation.x);
              myObj = obj;
              myObj.rotation.y = 1.57;
              myObj.position.x = 0;
              myObj.scale.set(1.15,1.15,1.15);
             scene.add(  myObj );
        });


        //lights
        let point = new THREE.PointLight( 0x000000, 0.7 );
                        scene.add( point );
        let ambient = new THREE.AmbientLight( 0xfff000 );
                        scene.add( ambient );

        let directionalLight = new THREE.DirectionalLight( 0xffa500, 0.8 );
        scene.add( directionalLight );
        
        

        window.addEventListener('resize', function(){
            let width = window.innerWidth;
            let heigth = window.innerHeight;
            renderer.setSize(width, heigth);
            camera.aspect = width/heigth;
            camera.updateProjectionMatrix();
        });

           
        let skyboxGeometry = new THREE.CubeGeometry(3000,2500,10000);
        let cubeMaterials = [
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("texture/front.png"), side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("texture/back.png"), side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("texture/up.png"), side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("texture/down.png"), side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("texture/right.png"), side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("texture/left.png"), side: THREE.DoubleSide})
        ]   

        let cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
        let cube = new THREE.Mesh(skyboxGeometry, cubeMaterial);
        scene.add(cube);


        let grid = new THREE.GridHelper( 100000, 20000,0x800080,0x800080 );
        grid.position.y = -3;
        scene.add(grid);


        //composer 
        let composer = new THREE.EffectComposer(renderer);

        //passes
        let renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);

        let pass1 = new THREE.GlitchPass(0);
        composer.addPass(pass1);

        let effect = new THREE.ShaderPass(THREE.FilmShader);
            effect.uniforms['nIntensity'].value = 0.2;
            effect.uniforms['sIntensity'].value = 0.3;
            effect.uniforms['sCount'].value = 1800;
            effect.uniforms['grayscale'].value = 0;

        composer.addPass(effect);

        effect.renderToScreen = true;
        cube.position.z =-4000;

           
        camera.rotation.x = 300;
        camera.position.y = 60;


        // app logic          
        function update(){
            camera.position.z -= 0.7;
            cube.position.z -=0.4;
      
            if(camera.position.y > 2){
                 myObj.position.z -= 0.719;
                camera.position.y -=0.1;
                camera.rotation.x +=0.0025;
            }
            if(!(camera.position.y > 2)){
                div.style.display = "block";
                myObj.position.z -= 0.7;
            }
        };

        // draw scene
        function  render(){
            renderer.render( scene, camera );
            composer.render();
        };

        // run game loop (update, render, repeat)
         function GameLoop(){
            requestAnimationFrame( GameLoop );
            update( );
            render( );
        };

        GameLoop( );