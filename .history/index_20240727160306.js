const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = 'https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png';

// General settings
let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = canvas.width / 10;

let index = 0;
let bestScore = 0;
let flight;
let flyHeight;
let currentScore;
let pipes = [];

// Adjust canvas size to full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);
    pipes = Array(3).fill().map((_, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
    index++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);

    // Pipes
    if (gamePlaying) {
        pipes.forEach(pipe => {
            pipe[0] -= speed;
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

            if (pipe[0] <= -pipeWidth) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);
                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
            }

            if (pipe[0] <= cTenth + size[0] && 
                pipe[0] + pipeWidth >= cTenth && 
                (pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1])) {
                gamePlaying = false;
                setup();
            }
        });
    }

    // Draw bird
    if (gamePlaying) {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
    } else {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, (canvas.width / 2) - size[0] / 2, flyHeight, ...size);
        flyHeight = (canvas.height / 2) - (size[1] / 2);
        ctx.font = "bold 30px courier";
        ctx.fillText(`Best score: ${bestScore}`, 85, 245);
        ctx.fillText('Click to play', 90, 535);
    }

    document.getElementById('bestScore').textContent = `Best: ${bestScore}`;
    document.getElementById('currentScore').textContent = `Current: ${currentScore}`;

    window.requestAnimationFrame(render);
}

// Adjust canvas size when the window is resized
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Launch setup
setup();
img.onload = render;

// Start game
document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;
