import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
function Material(textureLink, r, g, b) {
	let texture = new THREE.TextureLoader().load(textureLink);
	texture.magFilter = THREE.NearestFilter;
	let material = new THREE.MeshLambertMaterial({
		map: texture,
		transparent: false,
		color: `rgb(${r},${g},${b})`,
	});
	return material;
}
const renderer = new THREE.WebGLRenderer({
	alpha: true,
	precision: "lowp",
	antialias: true,
	powerPreference: "high-performance",
});
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const blockWireframe = new THREE.WireframeGeometry(blockGeometry);
const lineMaterial = new THREE.LineBasicMaterial({
	transparent: false,
	linewidth: 2,
	color: 0xffffff,
});
const blockOutlines = new THREE.LineSegments(blockWireframe, lineMaterial);
blockOutlines.position.set(0,0,0);
const grass = new THREE.Mesh(
	blockGeometry,
	Material("textures/grass.jpg", 140, 200, 50),
);
const dirt = new THREE.Mesh(
	blockGeometry,
	Material("textures/dirt.jpg", 100, 80, 40),
);
const stone = new THREE.Mesh(
	blockGeometry,
	Material("textures/stone.webp", 100, 100, 100),
);
const glowstone = new THREE.Mesh(
	blockGeometry,
	Material("textures/glowstone.jpeg", 200, 200, 200),
);
glowstone.receiveShadow = false;
glowstone.castShadow = false;
let glowstoneLight = new THREE.PointLight("rgb(255, 255, 80)", 5, 20, 2);
//glowstoneLight.castShadow = true;
glowstone.add(glowstoneLight);
const bedrock = new THREE.Mesh(
	blockGeometry,
	Material("textures/s.webp", 50, 50, 50),
);
const camera = new THREE.PerspectiveCamera(
	70,
	renderer.domElement.clientWidth / renderer.domElement.clientHeight,
	0.1,
	10000,
);
const controls = new PointerLockControls(camera, renderer.domElement);
let created = 0;
const load = document.querySelector("h3");
// Scene init
const scene = new THREE.Scene();
const Create = async (mapParams = {size: 20}) => {
	const map = new Map();
	for (let x = 0; x < mapParams.size; x++) {
		for (let y = 0; y < 256; y++) {
			for (let z = 0; z < mapParams.size; z++) {
				let block;
				if (y > 64) {
					block = null;
				} else if (y === 64) {
					block = grass.clone();
					block.name = "grass";
					scene.add(block);
				} else if (y > 60) {
					block = dirt.clone();
					block.name = "dirt";
				} else if (y !== 0) {
					block = stone.clone();
					block.name = "stone";
				} else {
					block = bedrock.clone();
					block.name = "bedrock";
				}
				created += 1;
				if (created % Math.pow(mapParams.size, 2) * 4096 === 0) {
					load.innerText = `Loading: ${created}/` + mapParams.size * 256 * mapParams.size;
					await new Promise(resolve => setTimeout(resolve, 0))
				}
				/*let wire = blockOutlines.clone();
				wire.position.set(x, y, z);
				scene.add(wire);*/
				if (!block) continue
				block.castShadow = true;
				block.receiveShadow = true;
				block.position.set(x, y, z);
				map.set(`${x};${y};${z}`, block);
			}
		}
	}
	return map;
}
const map = await Create({ size: 20 });
const Hlight = new THREE.AmbientLight("rgb(255, 255, 255)", 0.1);
const light = new THREE.DirectionalLight("rgb(255, 255, 255)", 3);
light.castShadow = false
light.position.set(50, 100, 50)
light.rotateX(Math.PI / 4)
scene.add(Hlight);
scene.add(light);
blockOutlines.name = undefined
scene.add(blockOutlines);
//scene.background = null; //new THREE.Color(100, 100, 200);
document.getElementById("loading").style.display = "none";
// Post init
const raycaster = new THREE.Raycaster(undefined, undefined, undefined, 8);
const pointer = new THREE.Vector2(0, 0);
const FPS = document.querySelector("h1");
const Position = document.querySelector("h2");
camera.position.set(3, 66, 3);
renderer.render(scene, camera);
const clock = new THREE.Clock();
clock.start();
var selectedBlock, blockPlacementPosition = new THREE.Vector3(0, 0, 0), selectedBlockToPlace = grass;
var keyDowned = new Map();
const CheckPlayerCollision = (playerCoords) => {
	if (map.has(`${Math.round(playerCoords.x)};${Math.round(playerCoords.y)};${Math.round(playerCoords.z)}`)) return true;
	return map.has(`${Math.round(playerCoords.x)};${Math.round(playerCoords.y - 1)};${Math.round(playerCoords.z)}`);
}
const CheckPlayerFalling = (playerCoords) => {
	if (map.has(`${Math.round(playerCoords.x)};${Math.round(playerCoords.y - 2)};${Math.round(playerCoords.z)}`)) return;
	playerCoords.y -= 1;
}
var inTheAir = false;
function KeyHandle(dif) {
	dif *= 1/60;
	keyDowned.forEach((_, key) => {
		let fakeCam = camera.clone(), coords;
		switch (key) {
			case "Space":
				if (inTheAir) break;
				inTheAir = true;
				coords = fakeCam.position;
				coords.y += 1;
				if (CheckPlayerCollision(coords)) break;
				camera.position.set(camera.position.x, coords.y, camera.position.z);
				setTimeout(() => {
					inTheAir = false;
					coords = camera.position.clone();
					coords.y -= 1;
					if (CheckPlayerCollision(coords)) return;
					camera.position.set(camera.position.x, coords.y, camera.position.z);
				}, 500)
				break;
			//case "ShiftLeft":
			case "ArrowUp":
			case "KeyW":
				coords = fakeCam.translateZ(-dif * 2).position;
				if (CheckPlayerCollision(coords)) break;
				camera.position.set(coords.x, camera.position.y, coords.z);
				break;
			case "ArrowDown":
			case "KeyS":
				coords = fakeCam.translateZ(dif * 2).position;
				if (CheckPlayerCollision(coords)) break;
				camera.position.set(coords.x, camera.position.y, coords.z);
				break;
			case "ArrowLeft":
			case "KeyA":
				coords = fakeCam.translateX(-dif * 2).position;
				if (CheckPlayerCollision(coords)) break;
				camera.position.set(coords.x, camera.position.y, coords.z);
				break;
			case "ArrowRight":
			case "KeyD":
				coords = fakeCam.translateX(dif * 2).position;
				if (CheckPlayerCollision(coords)) break;
				camera.position.set(coords.x, camera.position.y, coords.z);
				break;
			case "Digit1":
				selectedBlockToPlace = grass;
				break;
			case "Digit2":
				selectedBlockToPlace = dirt;
				break;
			case "Digit3":
				selectedBlockToPlace = stone;
				break;
			case "Digit4":
				selectedBlockToPlace = glowstone;
				break;
		}
	});
	Position.innerText =
		`X: ${Math.round(camera.position.x * 100) / 100}` +
		`\nY: ${Math.round(camera.position.y * 100) / 100}` +
		`\nZ: ${Math.round(camera.position.z * 100) / 100}` +
		`\nR(X): ${Math.round(camera.rotation.x * 100) / 100}` +
		`\nR(Y): ${Math.round(camera.rotation.y * 100) / 100}` +
		`\nR(Z): ${Math.round(camera.rotation.z * 100) / 100}`;
}
function PlaceBlock() {
	let placedBlock = selectedBlockToPlace.clone();
	placedBlock.position.set(blockPlacementPosition.x, blockPlacementPosition.y, blockPlacementPosition.z);
	map.set(`${placedBlock.position.x};${placedBlock.position.y};${placedBlock.position.z}`, placedBlock);
	scene.add(placedBlock);
}
function Raycast() {
	raycaster.setFromCamera(pointer, camera);
	let sceneObjects = scene.children.filter(_ => _.name !== undefined);
	let intersects = raycaster.intersectObjects(sceneObjects);
	if (intersects.length === 0) return
	selectedBlock = intersects[0].object;
	blockPlacementPosition = selectedBlock.position.clone().add(intersects[0].face.normal);
	blockOutlines.position.set(selectedBlock.position.x, selectedBlock.position.y, selectedBlock.position.z)
}
function animate() {
	let dif = clock.getDelta() / (1 / 60);
	FPS.innerText = Math.round(60 / dif) + "FPS";
	Raycast();
	KeyHandle(dif);
	if (!inTheAir) CheckPlayerFalling(camera.position);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}
scene.onBeforeRender = () => //camera.position.y = 66;
document.onkeydown = event => keyDowned.set(event.code, true);
document.onkeyup = event => keyDowned.delete(event.code);
document.onmousedown = (event) => {
	controls.lock();
	switch (event.button) {
		case 0:
			if (!selectedBlock) return
			let sbPos = selectedBlock.position;
			if (map.get(`${sbPos.x + 1};${sbPos.y};${sbPos.z}`)) scene.add(map.get(`${sbPos.x + 1};${sbPos.y};${sbPos.z}`));
			if (map.get(`${sbPos.x - 1};${sbPos.y};${sbPos.z}`)) scene.add(map.get(`${sbPos.x - 1};${sbPos.y};${sbPos.z}`));
			if (map.get(`${sbPos.x};${sbPos.y + 1};${sbPos.z}`)) scene.add(map.get(`${sbPos.x};${sbPos.y + 1};${sbPos.z}`));
			if (map.get(`${sbPos.x};${sbPos.y - 1};${sbPos.z}`)) scene.add(map.get(`${sbPos.x};${sbPos.y - 1};${sbPos.z}`));
			if (map.get(`${sbPos.x};${sbPos.y};${sbPos.z + 1}`)) scene.add(map.get(`${sbPos.x};${sbPos.y};${sbPos.z + 1}`));
			if (map.get(`${sbPos.x};${sbPos.y};${sbPos.z - 1}`)) scene.add(map.get(`${sbPos.x};${sbPos.y};${sbPos.z - 1}`));
			scene.remove(selectedBlock);
			map.delete(`${sbPos.x};${sbPos.y};${sbPos.z}`);
			break;
		default:
			PlaceBlock();
			break;
	}
}
document.onresize = () => {
	camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
	camera.updateProjectionMatrix();
}
renderer.setAnimationLoop(animate);
//document.getElementById("save").onclick = Save;
