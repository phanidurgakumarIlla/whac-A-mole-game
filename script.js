// --- DOM Element References ---
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const startButton = document.getElementById('start-button');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');

// --- Game State Variables ---
let score = 0;
let timeLeft = 30; // 30 seconds game time
let hitHole = null; // Stores the currently visible hole element
let timerId = null; // Interval for the main countdown timer
let moleTimerId = null; // Interval for making moles appear

// --- Game Functions ---

// 1. Get a random hole element
function randomHole() {
    // Remove the 'up' class from the previous hole
    holes.forEach(hole => {
        hole.classList.remove('up');
    });

    // Pick a new random hole
    const randomIndex = Math.floor(Math.random() * holes.length);
    const randomHole = holes[randomIndex];

    // Add the 'up' class to make the mole appear
    randomHole.classList.add('up');
    hitHole = randomHole;

    return randomHole;
}

// 2. Make a mole pop up and down randomly (FAST MODE)
function moveMole() {
    // Clear any existing mole timer before starting a new one
    if (moleTimerId) clearInterval(moleTimerId);
    
    // Controls how frequently a *new* mole pops up (Faster: 0.75s)
    const POP_UP_INTERVAL = 750; 
    
    moleTimerId = setInterval(() => {
        randomHole();
        
        // Mole visibility time (Faster: 0.3s to 1.0s)
        let randomTime = Math.random() * 700 + 300; 
        
        // Use setTimeout to bring the mole down after a random time
        setTimeout(() => {
            // Check if the game is still running before hiding the mole
            if (timerId !== null) {
                 holes.forEach(hole => {
                    hole.classList.remove('up');
                });
            }
        }, randomTime);
        
    }, POP_UP_INTERVAL); 
}


// 3. Handle a player clicking (whacking) a mole
moles.forEach(mole => {
    mole.addEventListener('click', () => {
        if (mole.parentElement.classList.contains('up') && mole.parentElement === hitHole) {
            score++;
            scoreDisplay.textContent = score;
            
            // Immediately hide the mole after a hit
            mole.parentElement.classList.remove('up');
            
            // Set hitHole to null to prevent scoring multiple times on the same mole
            hitHole = null; 
        }
    });
});

// 4. Countdown timer for the game
function countDown() {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;

    if (timeLeft === 0) {
        // Stop both intervals
        clearInterval(timerId);
        clearInterval(moleTimerId);
        timerId = null; 
        moleTimerId = null;
        
        // End game message
        alert(`GAME OVER! Your final score is ${score}`);
        
        // Reset the game board and state
        startButton.textContent = "Play Again";
        startButton.disabled = false;
        holes.forEach(hole => hole.classList.remove('up'));
    }
}

// 5. Start the game function
function startGame() {
    // Reset state variables
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    startButton.disabled = true; // Disable button while game is running
    startButton.textContent = "Game In Progress...";

    // Clear any existing timers just in case
    clearInterval(timerId);
    clearInterval(moleTimerId);

    // Start the main countdown and the mole movement
    timerId = setInterval(countDown, 1000); // 1000ms = 1 second
    moveMole();
}

// --- Event Listener to Start the Game ---
startButton.addEventListener('click', startGame);