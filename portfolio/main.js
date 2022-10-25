import './style.css'
import * as THREE from '../libs/three/three.module.js';
import { OrbitControls } from '../libs/three/jsm/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const ringsTexture = new THREE.TextureLoader().load('rings_texture2.jpg');

const geometry = new THREE.TorusGeometry(10, 2, 2, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFCF3CF, map: ringsTexture});
const torus = new THREE.Mesh(geometry, material);

torus.position.z = 15;
torus.position.setX(-25);
torus.position.y = -15;

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(100, 100, 100);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24 );
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space3.jpg');
scene.background = spaceTexture;

const sohamText = new THREE.TextureLoader().load('soham.jpg');

const soham = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshBasicMaterial({map: sohamText})

);

soham.position.x = 5;
soham.position.y = 5;
soham.position.z = 15;

scene.add(soham);

const moonTexture = new THREE.TextureLoader().load('saturn.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpeg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(5, 100, 100, 0, Math.PI * 2), 
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
    
  })
);



moon.position.z = 15;
moon.position.setX(-25);
moon.position.y = -15;

scene.add(moon);

const sunTexture = new THREE.TextureLoader().load('jupiter_texture.jpg');

const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(10, 200, 200),
  new THREE.MeshStandardMaterial({
    map: sunTexture
  })
)

jupiter.position.z = -60;
jupiter.position.x = 40;
jupiter.position.y = 0;

scene.add(jupiter);


// const sunHelper = new THREE.PointLightHelper(sunLight); 

// scene.add(sunLight, sunHelper);

// const spotHelper1 = new THREE.SpotLightHelper(brightenSun1);
// const spotHelper2 = new THREE.SpotLightHelper(brightenSun2);

function moveCamera(){

  requestAnimationFrame(moveCamera);

  // const t = document.body.getBoundingClientRect().top;

  //  torus.rotation.x += 0.02;
  //  torus.rotation.y += 0.05;
  //  torus.rotation.z += 0.02;

  // soham.rotation.y += 0.01;
  // soham.rotation.z += 0.01;

  // camera.position.z = t * -0.01;
  // camera.position.x = t * -0.0002;
  // camera.rotation.y = t * -0.0002;

  // camera.rotation.x = t * 0.1;

  // scene.rotation.x = t * 0.0005;
  // scene.rotation.y = t * 0.0005;
  // scene.rotation.z = t * 0.0005;

  scene.rotation.x +=  0.0005;
  scene.rotation.y +=  0.0005;
  scene.rotation.z +=  0.0005;

  controls.update();

  renderer.render(scene, camera);
 
}

// document.body.onscroll = moveCamera;
moveCamera();



function animate(){
  requestAnimationFrame(animate);

   torus.rotation.x += 0.01;
   torus.rotation.y += 0.005;
   torus.rotation.z += 0.01;
   soham.rotation.x += 0.01;
   soham.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();


