const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');

const Land = require('../modules/sketch/land/Land').default;
const Water = require('../modules/sketch/land/Water').default;

export default function() {
  // ==========
  // Define common variables
  //
  const resolution = new THREE.Vector2();
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  const clock = new THREE.Clock({
    autoStart: false
  });

  camera.far = 1000;
  camera.setFocalLength(50);

  // ==========
  // Define unique variables
  //
  const randomH = Math.random();
  const land = new Land(randomH);
  const water = new Water(randomH);

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    water.render(time);
    renderer.render(scene, camera);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
    camera.aspect = resolution.x / resolution.y;
    camera.updateProjectionMatrix();
  };
  const resizeWindow = () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    renderer.setSize(resolution.x, resolution.y);
  };
  const on = () => {
    window.addEventListener('resize', debounce(resizeWindow, 1000));
  };

  // ==========
  // Initialize
  //
  renderer.setClearColor(0xeeeeee, 1.0);
  camera.position.set(350, 450, 350);
  camera.lookAt(new THREE.Vector3(0, 30, 0));

  land.createObj();
  water.createObj();

  scene.add(land.obj);
  scene.add(water.obj);

  on();
  resizeWindow();

  clock.start();
  renderLoop();
}