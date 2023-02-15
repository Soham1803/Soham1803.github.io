import * as THREE from '../../libs/three125/three.module.js';
import { OrbitControls } from '../../libs/three125/OrbitControls.js';
import { GLTFLoader } from '../../libs/three125/GLTFLoader.js';
import { Stats } from '../../libs/stats.module.js';
import { CanvasUI } from '../../libs/three125/CanvasUI.js'
import { ARButton } from '../../libs/ARButton.js';
import { LoadingBar } from '../../libs/LoadingBar.js';
import { Player } from '../../libs/three125/Player.js';
import { ControllerGestures } from '../../libs/three125/ControllerGestures.js'; 

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 20 );
		
		this.scene = new THREE.Scene();
        
        this.scene.add(this.camera);
       
		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 3.5, 0);
        this.controls.update();
        
        this.stats = new Stats();
        document.body.appendChild( this.stats.dom );
        
        this.origin = new THREE.Vector3();
        this.euler = new THREE.Euler();
        this.quaternion = new THREE.Quaternion();
        
        this.initScene();
        this.setupXR();
        
        window.addEventListener('resize', this.resize.bind(this) );
	}	
    
    initScene(){
        this.loadingBar = new LoadingBar();

        this.textureAssetsPath = '../../assets/textures/dynamite/';
        const textureLoader = new THREE.TextureLoader().setPath(this.textureAssetsPath);


        const hoodie_color = textureLoader.load('hoodie.jpg');
        const hoodie_normal = textureLoader.load('normal_texture.jpg')
        const hoodie_metal = textureLoader.load('hoodie_shine.jpg')
        const pants_color = textureLoader.load('pants.jpg');
        const pants_normal = textureLoader.load('pant-normal.jpg');
        const pants_metal = textureLoader.load('pant-shine.jpg');
        const shoes_color = textureLoader.load('shoes.jpg');
        const shoes_normal = textureLoader.load('shoes-normal.jpg');
        const shoes_metal = textureLoader.load('shoes-shine.jpg');
        const face = textureLoader.load('nose-mouth.jpg');
        const eye = textureLoader.load('eye-left.jpg');
        const glasses = textureLoader.load('glasses.jpg');
        const hair_color = textureLoader.load('hair-texture.jpg');
        const hair_normal = textureLoader.load('hair_normal.jpg');
        const body_color = textureLoader.load('lips.jpg');
        const body_normal = textureLoader.load('body-normal-texture.jpg');
        const teeth = textureLoader.load('teeth.jpg');

        this.textureDesigns = [
            {map: body_color, normalMap: body_normal, metalnessMap: null},
            {map: glasses, normalMap: null, metalnessMap: null},
            {map: hair_color, normalMap: hair_normal, metalnessMap: null},
            {map: pants_color, normalMap: pants_normal, metalnessMap: pants_metal},
            {map: shoes_color, normalMap: shoes_normal, metalnessMap: shoes_metal},
            {map: hoodie_color, normalMap: hoodie_normal, metalnessMap: hoodie_metal},
            {map: eye, normalMap: null, metalnessMap: null},
            {map: eye, normalMap: null, metalnessMap: null},
            {map: face, normalMap: null, metalnessMap: null},
            {map: teeth, normalMap: null, metalnessMap: null}

    ]
        
        this.assetsPath = '../../assets/';
        const loader = new GLTFLoader().setPath(this.assetsPath);
		const self = this;
		
		// Load a GLTF resource
		loader.load(
			// resource URL
			`Dynamite-by-me.glb`,
			// called when the resource is loaded
			function ( gltf ) {
				const object = gltf.scene.children[0];

                object.getObjectByName('Wolf3D_Body').material =new THREE.MeshStandardMaterial(self.textureDesigns[0]);
                
                object.getObjectByName('Wolf3D_Glasses').material = new THREE.MeshStandardMaterial(self.textureDesigns[1]);
                
                object.getObjectByName('Wolf3D_Hair').material = new THREE.MeshStandardMaterial(self.textureDesigns[2]);
            
                object.getObjectByName('Wolf3D_Outfit_Bottom').material = new THREE.MeshStandardMaterial(self.textureDesigns[3]);
            
                object.getObjectByName('Wolf3D_Outfit_Footwear').material = new THREE.MeshStandardMaterial(self.textureDesigns[4]);
                
                object.getObjectByName('Wolf3D_Outfit_Top').material = new THREE.MeshStandardMaterial(self.textureDesigns[5]);
                
                object.getObjectByName('EyeLeft').material = new THREE.MeshStandardMaterial(self.textureDesigns[6]);

                object.getObjectByName('EyeRight').material = new THREE.MeshStandardMaterial(self.textureDesigns[7]);

                object.getObjectByName('Wolf3D_Head').material = new THREE.MeshStandardMaterial(self.textureDesigns[8]);

                object.getObjectByName('Wolf3D_Teeth').material = new THREE.MeshStandardMaterial(self.textureDesigns[9]);

				
				object.traverse(function(child){
                    
					if (child.isMesh){                        
                        child.material.metalness = 0;
                        child.material.roughness = 1;
					}
				});
				
				const options = {
					object: object,
					speed: 0.5,
					animations: gltf.animations,
					clip: gltf.animations[0],
					app: self,
					name: 'YouCut_20230211_204607246',
					npc: false
				};
				
				self.soham = new Player(options);
                self.soham.object.visible = false;
				
				self.soham.action = 'YouCut_20230211_204607246';
				const scale = 0.003;
				self.soham.object.scale.set(scale, scale, scale); 
				
                self.loadingBar.visible = false;
			},
			// called while loading is progressing
			function ( xhr ) {

				self.loadingBar.progress = (xhr.loaded / xhr.total);

			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened' );
                console.log(error);

			}
		);
        
        this.createUI();
    }
    
    createUI() {
        
        const config = {
            panelSize: { width: 0.15, height: 0.038 },
            height: 128,
            info:{ type: "text" }
        }
        const content = {
            info: "Debug info"
        }
        
        const ui = new CanvasUI( content, config );
        
        this.ui = ui;
    }
    
    setupXR(){
        this.renderer.xr.enabled = true; 
        
        const self = this;
        let controller, controller1;
        
        function onSessionStart(){
            self.ui.mesh.position.set( 0, -0.15, -0.3 );
            self.camera.add( self.ui.mesh );
        }
        
        function onSessionEnd(){
            self.camera.remove( self.ui.mesh );
        }
        
        const btn = new ARButton( this.renderer, { onSessionStart, onSessionEnd });//, sessionInit: { optionalFeatures: { 'dom-overlay' }, domOverlay: { root: document.body } } } );
        
        this.gestures = new ControllerGestures( this.renderer );
        this.gestures.addEventListener( 'tap', (ev)=>{
            //console.log( 'tap' ); 
            self.ui.updateElement('info', 'tap' );
            if (!self.soham.object.visible){
                self.soham.object.visible = true;
                self.soham.object.position.set( 0, -0.3, -0.5 ).add( ev.position );
                self.scene.add( self.soham.object ); 
            }
        });
        this.gestures.addEventListener( 'doubletap', (ev)=>{
            //console.log( 'doubletap'); 
            self.ui.updateElement('info', 'doubletap' );
        });
        this.gestures.addEventListener( 'press', (ev)=>{
            //console.log( 'press' );    
            self.ui.updateElement('info', 'press' );
        });
        this.gestures.addEventListener( 'pan', (ev)=>{
            //console.log( ev );
            if (ev.initialise !== undefined){
                self.startPosition = self.soham.object.position.clone();
            }else{
                const pos = self.startPosition.clone().add( ev.delta.multiplyScalar(3) );
                self.soham.object.position.copy( pos );
                self.ui.updateElement('info', `pan x:${ev.delta.x.toFixed(3)}, y:${ev.delta.y.toFixed(3)}, x:${ev.delta.z.toFixed(3)}` );
            } 
        });
        this.gestures.addEventListener( 'swipe', (ev)=>{
            //console.log( ev );   
            self.ui.updateElement('info', `swipe ${ev.direction}` );
            if (self.soham.object.visible){
                self.soham.object.visible = false;
                self.scene.remove( self.soham.object ); 
            }
        });
        this.gestures.addEventListener( 'pinch', (ev)=>{
            //console.log( ev );  
            if (ev.initialise !== undefined){
                self.startScale = self.soham.object.scale.clone();
            }else{
                const scale = self.startScale.clone().multiplyScalar(ev.scale);
                self.soham.object.scale.copy( scale );
                self.ui.updateElement('info', `pinch delta:${ev.delta.toFixed(3)} scale:${ev.scale.toFixed(2)}` );
            }
        });
        this.gestures.addEventListener( 'rotate', (ev)=>{
            //      sconsole.log( ev ); 
            if (ev.initialise !== undefined){
                self.startQuaternion = self.soham.object.quaternion.clone();
            }else{
                self.soham.object.quaternion.copy( self.startQuaternion );
                self.soham.object.rotateY( ev.theta );
                self.ui.updateElement('info', `rotate ${ev.theta.toFixed(3)}`  );
            }
        });
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        const dt = this.clock.getDelta();
        this.stats.update();
        if ( this.renderer.xr.isPresenting ){
            this.gestures.update();
            this.ui.update();
        }
        if ( this.soham !== undefined ) this.soham.update(dt);
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };