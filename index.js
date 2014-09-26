$(document).ready(function() {
  var WIDTH = document.body.clientWidth;
  var HEIGHT = document.body.clientHeight;

  var VIEW_ANGLE = 45;
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 0.1;
  var FAR = 10000;

  var renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x212121, 1);

  var $container = $('#glcontainer');
  $container.append(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.z = 300;

  $(window).on('resize', function() {
    WIDTH = document.body.clientWidth;
    HEIGHT = document.body.clientHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix()
  });

  var scene = new THREE.Scene();
  scene.add(camera);

  var lightProperties = [
    {
      color: 0xFF0000,
      x: 150,
      y: -210,
      z: 0
    },
    {
      color: 0x00FF00,
      x: -150,
      y: -210,
      z: 0
    },
    {
      color: 0x0000FF,
      x: 0,
      y: 300,
      z: 0
    },
    {
      color: 0xFFFFFF,
      x: 0,
      y: 0,
      z: 300
    },
  ];
  for (var i = 0; i < lightProperties.length; i++) {
    var pointLight = new THREE.PointLight(lightProperties[i].color);
    pointLight.position.set(lightProperties[i].x, lightProperties[i].y, lightProperties[i].z);
    scene.add(pointLight);
  }

  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(0, 150, 0);
  scene.add(spotLight);

  var SIZE = 50;
  var geometry = new THREE.TetrahedronGeometry(SIZE, 1);

  var materialProperties = [
    {
      color: 0xFFFF00,
      transparent: true,
      opacity: 0.8
    },
    {
      color: 0x00FFFF,
      transparent: true,
      opacity: 0.8
    },
    {
      color: 0xFF00FF,
      transparent: true,
      opacity: 0.8
    }
  ];

  var X = new THREE.Vector3(1, 0, 0);
  var Y = new THREE.Vector3(0, 1, 0);
  var Z = new THREE.Vector3(0, 0, 1);

  var torii = [];
  for (var i = 0; i < materialProperties.length; i++) {
    torii.push(new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(materialProperties[i])));
    scene.add(torii[i]);
  }

  torii[0].rotateOnAxis(X, 90);
  torii[1].rotateOnAxis(Y, 90);
  torii[2].rotateOnAxis(Z, 90);

  var speed = 0.007;

  function animate(timestamp) {
    for (var i = 0; i < torii.length; i++) {
      torii[i].rotateOnAxis(X, speed);
      torii[i].rotateOnAxis(Y, speed);
      torii[i].rotateOnAxis(Z, speed);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
});
