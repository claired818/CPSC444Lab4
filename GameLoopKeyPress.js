import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, -7.9, 15);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scoreMessage = document.createElement("div");
scoreMessage.style.position = "fixed";
scoreMessage.style.top = "24px";
scoreMessage.style.left = "24px";
scoreMessage.style.fontFamily = "sans-serif";
scoreMessage.style.fontSize = "24px";
scoreMessage.style.fontWeight = "bold";
scoreMessage.style.color = "#ffffff";
scoreMessage.style.textShadow = "2px 2px 4px #000000";
scoreMessage.style.zIndex = "1";
document.body.appendChild(scoreMessage);

const winMessage = document.createElement("div");
winMessage.style.position = "fixed";
winMessage.style.top = "24px";
winMessage.style.left = "24px";
winMessage.style.fontFamily = "sans-serif";
winMessage.style.fontSize = "24px";
winMessage.style.fontWeight = "bold";
winMessage.style.color = "#ffffff";
winMessage.style.textShadow = "2px 2px 4px #000000";
winMessage.style.zIndex = "1";
document.body.appendChild(winMessage);

const lossMessage = document.createElement("div");
lossMessage.style.position = "fixed";
lossMessage.style.top = "24px";
lossMessage.style.left = "24px";
lossMessage.style.fontFamily = "sans-serif";
lossMessage.style.fontSize = "24px";
lossMessage.style.fontWeight = "bold";
lossMessage.style.color = "#ffffff";
lossMessage.style.textShadow = "2px 2px 4px #000000";
lossMessage.style.zIndex = "1";
document.body.appendChild(lossMessage);

// Ground Plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});

const plane = new THREE.Mesh(
    planeGeometry,
    planeMaterial
);

plane.rotation.x = -Math.PI / 2;
plane.position.y = -8;
scene.add(plane);

// Lights
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.6
);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    1
);

directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Player Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({color: "#a3ffff"});

const player = new THREE.Mesh(
    cubeGeometry,
    playerMaterial
);

player.position.set(0, -7.5, 8);
scene.add(player);

const obstacleMaterial = new THREE.MeshStandardMaterial({color: "#ffb1d1"});
const obstacles = [];

function spawnObstacle() {
    const position = [Math.random() * 15.6 - 7.8, 5, 8];

    const obstacle = new THREE.Mesh(cubeGeometry, obstacleMaterial);
    obstacle.position.set(...position);
    scene.add(obstacle);
    obstacles.push(obstacle);
}

// Keyboard State Object
const keys = {};

// Key Down
window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

// Key Up
window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// Movement Speed
const speed = 0.1;
const playerBounds = new THREE.Box3();
const objectBounds = new THREE.Box3();

let score = 0;
function updateScoreMessage() {
    scoreMessage.textContent = `Score: ${score}`;
}

function displayWinMessage(){
    winMessage.textContent = "You win!";
    winMessage.style.top = "50%";
    winMessage.style.right = "auto";
    winMessage.style.left = "50%";
    winMessage.style.transform = "translate(-50%, -50%)";
    winMessage.style.width = "100%";
    winMessage.style.textAlign = "center";
    winMessage.style.fontSize = "15vw";
    winMessage.style.color = "#80ffff";
}

function displayLossMessage(){
    lossMessage.textContent = "GAME OVER";
    lossMessage.style.top = "50%";
    lossMessage.style.right = "auto";
    lossMessage.style.left = "50%";
    lossMessage.style.transform = "translate(-50%, -50%)";
    lossMessage.style.width = "100%";
    lossMessage.style.textAlign = "center";
    lossMessage.style.fontSize = "15vw";
    lossMessage.style.color = "#f0cf65";
}

let collision = false;
function handleCollisions() {
    playerBounds.setFromObject(player);

    obstacles.forEach((object) => {
        objectBounds.setFromObject(object);
        let collided = playerBounds.intersectsBox(objectBounds);

        if (collided) {
            displayLossMessage();
            collision = true;
        }
    });
}

let lastSpawn = 0;
// Animation Loop
function animate() {

    requestAnimationFrame(animate);

    if (!collision){
        updateScoreMessage();

        // AD Controls
        if (keys["a"] && player.position.x > -14.4) {
            player.position.x -= speed;
        }

        if (keys["d"] && player.position.x < 14.4) {
            player.position.x += speed;
        }

        // Arrow Key Controls
        if (keys["arrowleft"] && player.position.x > -14.4) {
            player.position.x -= speed;
        }

        if (keys["arrowright"] && player.position.x < 14.4) {
            player.position.x += speed;
        }
    

        const currentTime = performance.now();
        if(currentTime - lastSpawn > 1000){
            spawnObstacle();
            lastSpawn = currentTime;
            
            score++;
        }

        for (let obstacle of obstacles) {
            obstacle.position.y -= 0.05;

            if (obstacle.position.y < -9) {
                scene.remove(obstacle);
                obstacles.splice(obstacles.indexOf(obstacle), 1);
            }
        }
    }

    handleCollisions();

    // if (obstacles.length == 0) {
    //     displayWinMessage();
    // }

    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});