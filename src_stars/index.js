function xx () {
	var scene, camera, renderer;

	/* We need this stuff too */
	var container, aspectRatio,
		HEIGHT, WIDTH, fieldOfView,
		nearPlane, farPlane,
		mouseX, mouseY, windowHalfX,
		windowHalfY, stats, geometry,
		starStuff, materialOptions, stars;

	init();
	animate();

	function init() {
		container = document.createElement('div');
		document.body.appendChild( container );
		document.body.style.overflow = 'hidden';

		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;
		aspectRatio = WIDTH / HEIGHT;
		fieldOfView = 75;
		nearPlane = 1;
		farPlane = 1000;
		mouseX = 0;
		mouseY = 0;

		windowHalfX = WIDTH / 2;
		windowHalfY = HEIGHT / 2;

	/* 	fieldOfView — Camera frustum vertical field of view.
			aspectRatio — Camera frustum aspect ratio.
			nearPlane — Camera frustum near plane.
			farPlane — Camera frustum far plane.	

			- https://threejs.org/docs/#Reference/Cameras/PerspectiveCamera

		 	In geometry, a frustum (plural: frusta or frustums) 
		 	is the portion of a solid (normally a cone or pyramid) 
		 	that lies between two parallel planes cutting it. - wikipedia.		*/

		camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

		//Z positioning of camera

		camera.position.z = farPlane / 2;
		
		scene = new THREE.Scene({antialias:true});
		scene.fog = new THREE.FogExp2( 0x000000, 0.0003 );

		// The wizard's about to get busy.
		starForge();
		
		//check for browser Support
		if (webGLSupport()) {
			//yeah?  Right on...
			renderer = new THREE.WebGLRenderer({alpha: true});

		} else {
			//No?  Well that's okay.
			renderer = new THREE.CanvasRenderer();
		}

		renderer.setClearColor(0x000011, 1);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize( WIDTH, HEIGHT);
		container.appendChild(renderer.domElement);

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		stats.domElement.style.right = '0px';
		container.appendChild( stats.domElement );

		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener( 'mousemove', onMouseMove, false );
		
	}

	function animate() {
		requestAnimationFrame(animate);
		render();
		stats.update();
	}


	function render() {
		camera.position.x += ( mouseX - camera.position.x ) * 0.005;
		camera.position.y += ( - mouseY - camera.position.y ) * 0.005;
		camera.lookAt( scene.position );
		renderer.render(scene, camera);
	}

	function webGLSupport() {
		/* 	The wizard of webGL only bestows his gifts of power
			to the worthy.  In this case, users with browsers who 'get it'.		*/

		try {
			var canvas = document.createElement('canvas');
			return !!(window.WebGLRenderingContext && (
				canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
			);
		} catch(e) {
			// console.warn('Hey bro, for some reason we\'re not able to use webGL for this.  No biggie, we\'ll use canvas.');
			return false;
		}
	}

	function onWindowResize() {

		// Everything should resize nicely if it needs to!
	  	var WIDTH = window.innerWidth,
	  		HEIGHT = window.innerHeight;

	  	camera.aspect = aspectRatio;
	  	camera.updateProjectionMatrix();
	  	renderer.setSize(WIDTH, HEIGHT);
	}

	function starForge() {
		/* 	Yep, it's a Star Wars: Knights of the Old Republic reference,
			are you really surprised at this point? 
													*/
		var starQty = 45000;
			geometry = new THREE.SphereGeometry(1000, 100, 50);

	    	materialOptions = {
	    		size: 1.0, //I know this is the default, it's for you.  Play with it if you want.
	    		transparency: true, 
	    		opacity: 0.7
	    	};

	    	starStuff = new THREE.PointsMaterial(materialOptions);

		// The wizard gaze became stern, his jaw set, he creates the cosmos with a wave of his arms

		for (var i = 0; i < starQty; i++) {		

			var starVertex = new THREE.Vector3();
			starVertex.x = Math.random() * 2000 - 1000;
			starVertex.y = Math.random() * 2000 - 1000;
			starVertex.z = Math.random() * 2000 - 1000;

			geometry.vertices.push(starVertex);

		}


		stars = new THREE.PointCloud(geometry, starStuff);
		scene.add(stars);
	}

	function onMouseMove(e) {

		mouseX = e.clientX - windowHalfX;
		mouseY = e.clientY - windowHalfY;
	}	

};

import * as THREE from 'three';
import { gsap } from 'gsap/src';
import { makeResponsive } from './display';
import { TextPlugin } from 'gsap/all';
import { Linear } from 'gsap';

gsap.registerPlugin(TextPlugin)

const starForge = (scene) => {
	const starQty = 50000;
	const vertices = [];

	const materialOptions = {
		size: 1.0, //I know this is the default, it's for you.  Play with it if you want.
		transparency: true, 
		opacity: 0.7
	};
	// const startgeometry = new THREE.SphereGeometry(1000, 100, 50);
	const startgeometry = new THREE.BufferGeometry();
	
	// const starMaterial = new THREE.PointsMaterial(materialOptions);
	const starMaterial = new THREE.PointsMaterial( { color: 0x888888 } );

	// The wizard gaze became stern, his jaw set, he creates the cosmos with a wave of his arms
	// for (let i = 0; i < starQty; i++) {		

	// 	let starVertex = new THREE.Vector3();
	// 	starVertex.x = Math.random() * 2000 - 1000;
	// 	starVertex.y = Math.random() * 2000 - 1000;
	// 	starVertex.z = Math.random() * 2000 - 1000;

	// 	starMaterial.vertices.push(starVertex);
	// }
	
	for ( let i = 0; i < starQty; i ++ ) {
		const x = Math.random() * 2000 - 1000;
		const y = Math.random() * 2000 - 1000;
		const z = Math.random() * 2000 - 1000;
	
		vertices.push( x, y, z );
	}

	startgeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	const stars = new THREE.Points(startgeometry, starMaterial);
	scene.add(stars);
};

const pushStarsAway = (scene, camera, mouse) => {
	camera.position.x += ( mouse.mouseX - camera.position.x ) * 0.005;
	camera.position.y += ( - mouse.mouseY - camera.position.y ) * 0.005;
	camera.lookAt( scene.position );
};

export default () => {
    // CANVAS
    const canvas = document.getElementById('root');
    const heading = document.querySelector('.heading');

    // LOADER


    // RENDERED
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true
    });
	renderer.setClearColor(0x000011, 1);
    const { domElement } = renderer;

    // OBJECT

    // CAMERA
	const cameraOptions = {
		fov: 75,
		aspect: domElement.clientWidth / domElement.clientHeight,
		near: 0.1,
		far: 1000
	}
    const perspectiveCamera = new THREE.PerspectiveCamera(
		cameraOptions.fov,
		cameraOptions.aspect,
		cameraOptions.near,
		cameraOptions.far,
	);
    perspectiveCamera.position.z = cameraOptions.far / 2;

    // LIGHT

    // MOUSE
	const mouse = { mouseX: 0, mouseY: 0 };
	const onMouseMove = (e) => {
		mouse.mouseX = e.clientX - (domElement.clientWidth/2);
		mouse.mouseY = e.clientY - (domElement.clientHeight/2);
	}
	document.addEventListener('mousemove', onMouseMove);

    // AXES HELPER

    // SCENE
    const scene = new THREE.Scene();


	starForge(scene);
    // RENDER
    const render = (time) => {
	
        makeResponsive(renderer, perspectiveCamera)
		pushStarsAway(scene, perspectiveCamera, mouse);
        renderer.render(scene, perspectiveCamera);
        renderer.setAnimationLoop(render)
    };
    render();

	// tl.to(text, 0.8, {text:{value:"engaging & insightful words", padSpace:true,  ease:Linear.easeNone},delay:2});
	// tl.to(text, 0.8, {text:{value:"high-quality editorial", padSpace:true, ease:Linear.easeNone},delay:2});
	// tl.to(text, 0.8, {text:{value:"quality, bespoke content", padSpace:true, ease:Linear.easeNone},delay:2});
	// tl.to(text, 0.8, {text:{value:"quality, bespoke content", padSpace:true, ease:Linear.easeNone},delay:2});
	const tl = gsap.timeline({repeat:-1, yoyo:false, repeatDelay:0 });
	tl.to('.heading', 0.8, {text:{value:"Whats Up?", padSpace:true,  ease: Linear.easeNone},delay:2});
	tl.to('.heading', 0.8, {text:{value:"Asleep Already", padSpace:true, ease: Linear.easeNone},delay:2});
	tl.to('.heading', 0.8, {text:{value:"Hope Didn't Lose Stamina, This Time", ease: Linear.easeNone},delay:2});
	tl.to('.heading', 0.8, {text:{value:"Good Night!", padSpace:true, ease: Linear.easeNone},delay:2});

	console.log(tl);
};
