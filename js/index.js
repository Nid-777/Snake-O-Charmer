// Function to generate a random position within the game board
function getRandomPosition() {
    let a = 2;
    let b = 16;
    return { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
}

// Game constants and variables
let direction = { x: 0, y: 0 };
const foodSound = new Audio('foodSound.mp3');
const moveSound = new Audio("snake-hissing.mp3");
let speed = 10;
let lastPaintTime = 0;
let snakeArr = [getRandomPosition()]; // Random initial position for the snake
let food = getRandomPosition(); // Random initial position for the food
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highScore').innerHTML = "High Score: " + highScore;

// Ensure food is not placed on the snake's initial position
while (food.x === snakeArr[0].x && food.y === snakeArr[0].y) {
    food = getRandomPosition();
}

// Game function
function main(ctime) {
    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If snake bumps into itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If snake bumps into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array and food
    if (isCollide(snakeArr)) {
        direction = { x: 0, y: 0 };
        alert("Game Over! Press any key to play again.");
        snakeArr = [getRandomPosition()]; // Reset to a new random position
        food = getRandomPosition(); // Reset to a new random position

        // Ensure food is not placed on the snake's initial position
        while (food.x === snakeArr[0].x && food.y === snakeArr[0].y) {
            food = getRandomPosition();
        }

        score = 0;
        document.getElementById('score').innerHTML = "Score: " + score;
        return;
    }

    // If snake has eaten the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        document.getElementById('score').innerHTML = "Score: " + score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').innerHTML = "High Score: " + highScore;
        }

        snakeArr.unshift({ x: snakeArr[0].x + direction.x, y: snakeArr[0].y + direction.y });
        food = getRandomPosition();

        // Ensure food is not placed on the snake
        while (snakeArr.some(segment => segment.x === food.x && segment.y === food.y)) {
            food = getRandomPosition();
        }
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += direction.x;
    snakeArr[0].y += direction.y;

    // Part 2: Render the snake and food
    const board = document.querySelector('.board');
    board.innerHTML = "";

    // Display the snake
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    // Display the food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            direction = { x: 1, y: 0 };
            break;
        default:
            break;
    }
});
