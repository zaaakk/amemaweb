const THREE = window.THREE;

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x000000, 1500, 2100 );

var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
scene.add( ambientLight );
var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
			
const camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2100 );
camera.position.z = 1500;
camera.add( pointLight );
scene.add(camera);
const cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
cameraOrtho.position.z = 10;

const sceneOrtho = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = 'anonymous';
const mapA = textureLoader.load( "https://cdn.glitch.com/e4030d4f-d24d-4d27-9745-9b07ee47048b%2Froly2.png?1515955143668", createHUDSprites );
const mapB = textureLoader.load( "https://cdn.glitch.com/e4030d4f-d24d-4d27-9745-9b07ee47048b%2Froly2.png?1515955143668" );
const mapC = textureLoader.load( "https://cdn.glitch.com/e4030d4f-d24d-4d27-9745-9b07ee47048b%2Froly2.png?1515955143668" );
const materialB = new THREE.SpriteMaterial( { map: mapB, color: 0xffffff, fog: true } );
const materialC = new THREE.SpriteMaterial( { map: mapC, color: 0xffffff, fog: true } );

const amount = 200;
const radius = 500;
const group  = new THREE.Group();
for ( var a = 0; a < amount; a ++ ) {
  let x = Math.random() - 0.5;
	let y = Math.random() - 0.5;
	let z = Math.random() - 0.5;
	var material;
	if ( z < 0 ) {
		material = materialB.clone();
	} else {
		material = materialC.clone();
		material.color.setHSL( 0.5 * Math.random(), 0.75, 0.5 );
		material.map.offset.set( -0.5, -0.5 );
		material.map.repeat.set( 2, 2 );
	}
	var sprite = new THREE.Sprite( material );
	sprite.position.set( x, y, z );
	sprite.position.normalize();
	sprite.position.multiplyScalar( radius );
	group.add( sprite );
}
scene.add( group );


var planetexture, material, plane;

planetexture = textureLoader.load( "https://cdn.glitch.com/e4030d4f-d24d-4d27-9745-9b07ee47048b%2Fimage.png?1515953602485" );

// assuming you want the texture to repeat in both directions:
planetexture.wrapS = THREE.RepeatWrapping; 
planetexture.wrapT = THREE.RepeatWrapping;

// how many times to repeat in each direction; the default is (1,1),
//   which is probably why your example wasn't working
planetexture.repeat.set( 4, 4 ); 

material = new THREE.MeshLambertMaterial({ map : planetexture });
plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 3500), material);
plane.material.side = THREE.DoubleSide;
plane.position.x = 0;
plane.position.z = 0;

// rotation.z is rotation around the z-axis, measured in radians (rather than degrees)
// Math.PI = 180 degrees, Math.PI / 2 = 90 degrees, etc.
plane.rotation.z = Math.PI / 2;

scene.add(plane);

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var animate = function () {
  console.log(camera.position);
  console.log(plane.position);
  camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( scene.position );

  requestAnimationFrame( animate );
	render();
};

document.onmousemove = function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
}

function render() {
  var time = Date.now() / 1000;
	for ( var i = 0, l = group.children.length; i < l; i ++ ) {
		var sprite = group.children[ i ];
		var material = sprite.material;
		var scale = Math.sin( time + sprite.position.x * 0.01 ) * 0.3 + 1.0;
		var imageWidth = 1;
		var imageHeight = 1;
		if ( material.map && material.map.image && material.map.image.width ) {
			imageWidth = material.map.image.width;
			imageHeight = material.map.image.height;
		}
		sprite.material.rotation += 0.1 * ( i / l );
		sprite.scale.set( scale * imageWidth, scale * imageHeight, 1.0 );
		if ( material.map !== mapC ) {
			material.opacity = Math.sin( time + sprite.position.x * 0.01 ) * 0.4 + 0.6;
		}
	}
	group.rotation.x = time * 0.5;
	group.rotation.y = time * 0.75;
	group.rotation.z = time * 1.0;
	renderer.clear();
	renderer.render( scene, camera );
	renderer.clearDepth();
	renderer.render( sceneOrtho, cameraOrtho );
}

var spriteTL, spriteTR, spriteBL, spriteBR, spriteC;

//sprite stuff
function createHUDSprites ( texture ) {
	var material = new THREE.SpriteMaterial( { map: texture } );
	var width = material.map.image.width;
	var height = material.map.image.height;
	spriteTL = new THREE.Sprite( material );
	spriteTL.scale.set( width, height, 1 );
	sceneOrtho.add( spriteTL );
  spriteTR = new THREE.Sprite( material );
	spriteTR.scale.set( width, height, 1 );
	sceneOrtho.add( spriteTR );
	spriteBL = new THREE.Sprite( material );
	spriteBL.scale.set( width, height, 1 );
	sceneOrtho.add( spriteBL );
  spriteBR = new THREE.Sprite( material );
	spriteBR.scale.set( width, height, 1 );
	sceneOrtho.add( spriteBR );
	spriteC = new THREE.Sprite( material );
	spriteC.scale.set( width, height, 1 );
	sceneOrtho.add( spriteC );
	updateHUDSprites();
}

function updateHUDSprites() {
	var width = window.innerWidth / 2;
	var height = window.innerHeight / 2;
	var material = spriteTL.material;
	var imageWidth = material.map.image.width / 2;
	var imageHeight = material.map.image.height / 2;
	spriteTL.position.set( - width + imageWidth,   height - imageHeight, 1 ); // top left
	spriteTR.position.set(   width - imageWidth,   height - imageHeight, 1 ); // top right
	spriteBL.position.set( - width + imageWidth, - height + imageHeight, 1 ); // bottom left
	spriteBR.position.set(   width - imageWidth, - height + imageHeight, 1 ); // bottom right
	spriteC.position.set( 0, 0, 1 ); // center
}

animate();