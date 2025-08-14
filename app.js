const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let speed = 150; // Initial speed in ms

let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";
let score = 0;
let apples = [];
let applesEaten = 0;

document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

// Spawn apple avoiding snake
function spawnApples(count) {
    apples = [];
    for (let i = 0; i < count; i++) {
        let newApple;
        do {
            newApple = {
                x: Math.floor(Math.random() * (canvas.width / box)) * box,
                y: Math.floor(Math.random() * (canvas.height / box)) * box
            };
        } while (snake.some(part => part.x === newApple.x && part.y === newApple.y));
        apples.push(newApple);
    }
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#4CAF50" : "#8BC34A";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw apples
    for (let apple of apples) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(apple.x + box / 2, apple.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Snake head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Check apple collision
    let ateApple = false;
    for (let i = apples.length - 1; i >= 0; i--) {
        if (snakeX === apples[i].x && snakeY === apples[i].y) {
            score++;
            applesEaten++;
            document.getElementById("score").innerText = score;
            apples.splice(i, 1);
            ateApple = true;

            // Increase speed after every 5 apples
            if (score % 5 === 0 && speed > 60) {
                clearInterval(game);
                speed -= 10;
                game = setInterval(draw, speed);
            }
        }
    }

    // Respawn apples
    if (ateApple && apples.length === 0) {
        if (applesEaten >= 2) {
            spawnApples(2);
        } else {
            spawnApples(1);
        }
    }

    // Add new head
    const newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);

    // If no apple eaten, remove tail
    if (!ateApple) {
        snake.pop();
    }

    // Game over conditions
    if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        collision(newHead, snake.slice(1))
    ) {
        clearInterval(game);
        alert("Game Over! Your Score: " + score);
    }
}

function collision(head, array) {
    return array.some(part => head.x === part.x && head.y === part.y);
}

// Start game
spawnApples(1);
let game = setInterval(draw, speed);
