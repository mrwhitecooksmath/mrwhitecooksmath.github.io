// html document elements of interest
const indicator = document.getElementById("indicator");
const guessBox = document.getElementById("guessBox");
const clue1 = document.getElementById("clue1");
const clue2 = document.getElementById("clue2");
const clue3 = document.getElementById("clue3");
const clue4 = document.getElementById("clue4");
const clue5 = document.getElementById("clue5");
const solnLength = document.getElementById("solnLength");
const previous = document.getElementById("previous");

const correctColor = "rgb(0, 128, 255)";
const wrongColor = "rgb(255, 128, 0)";

// triggers check for guess submission
guessBox.addEventListener("keyup", submit);

let attempts = 0;               // guesses in puzzle
let target = "";                // puzzle solution
let canSubmit = true;           // prevents issue with spam

let playing = true;             // flag for in-progress puzzle
let puzzle = getPuzzle();       // puzzle = [solution, clue1, ..., clue4]

// kickstarts the puzzle
setTimeout(() => {create()}, 500);

// creates a fresh puzzle
function create() {
    // puzzle solution
    target = puzzle[0];

    // writes first two clues for puzzle
    overWrite(indicator, '⚫⚫⚫⚫⚫');
    overWrite(clue1, puzzle[1]);
    overWrite(clue2, puzzle[2]);
}

// checks if event is [enter key being released]
// calls for check against solution on guess
function submit(e) {
    if (e.keyCode == 13 && playing == true && canSubmit == true) {
        check(guessBox.value);

        // temporarily haults submission ability
        canSubmit = false;
        setTimeout(() => {canSubmit = true;}, 1000);
    }
}

// checks (valid) guess against solution
// updates various counters and calls for update to puzzle state
function check(guess) {
    // case: checks for empty guess
    if (guess == "") return;
    
    // case: checks for valid (alpha-only) submission
    let cleaned = guess.replace(/[^a-z]/gi, '');
    if (cleaned != guess) return;

    // proceeds with valid input
    guessBox.value = "";            // clear guess box
    attempts++;                     // increase attempt count

    // case: correct guess
    if (guess.toLowerCase() == target) {
        playing = false;

        // visual cue that guess was correct
        guessBox.style.background = correctColor;
        setTimeout(() => {guessBox.style.background = "white";}, 1000);

        // display solution
        overWrite(previous, "- " + target + " -");

        // update indicator
        if (attempts == 1) overWrite(indicator, '🔵⚫⚫⚫⚫');
        else if (attempts == 2) overWrite(indicator, '🟠🔵⚫⚫⚫');
        else if (attempts == 3) overWrite(indicator, '🟠🟠🔵⚫⚫');
        else if (attempts == 4) overWrite(indicator, '🟠🟠🟠🔵⚫');
        else if (attempts == 5) overWrite(indicator, '🟠🟠🟠🟠🔵');
    }
    // case: incorrect guess
    else {
        // subcase: all attempts used; shut off play
        if (attempts >= 5) playing = false;

        // update list of incorrect guesses
        // previous.textContent == ""
        else if (attempts == 1) overWrite(previous, guess.toLowerCase());
        else sideWrite(previous, ", " + guess.toLowerCase());

        // visual cue that guess was wrong
        guessBox.style.background = wrongColor;
        setTimeout(() => {guessBox.style.background = "white";}, 1000);

        // update indicator
        if (attempts == 1) overWrite(indicator, '🟠⚫⚫⚫⚫');
        else if (attempts == 2) overWrite(indicator, '🟠🟠⚫⚫⚫');
        else if (attempts == 3) overWrite(indicator, '🟠🟠🟠⚫⚫');
        else if (attempts == 4) overWrite(indicator, '🟠🟠🟠🟠⚫');
        else if (attempts == 5) {
            overWrite(previous, "- " + target + " -");
            overWrite(indicator, '🟠🟠🟠🟠🟠');
        }

        // next puzzle or prize awarded at end
        updateClues();
    }

}

// updates puzzle state based on attempts
function updateClues() {
    // case: 1 incorrect guess
    if (attempts == 1) {
        clue3.textContent = puzzle[3];
        clue3.style.opacity = 1;
    }
    // case: 2 incorrect guesses
    else if (attempts == 2) {
        clue4.textContent = puzzle[4];
        clue4.style.opacity = 1;
    }
    // case: 3 incorrect guesses
    else if (attempts == 3) {
        solnLength.textContent = (String(target.length) + " letters");
        solnLength.style.opacity = 1;
    }
    // case: 4 incorrect guesses
    else if (attempts == 4) {
        clue5.textContent = puzzle[5];
        clue5.style.opacity = 1;
    }
}

// hides object's text content, appends to it, then reveals content again
function sideWrite(object, content) {
    object.style.opacity = 0;
    setTimeout(() => {object.textContent += content; object.style.opacity = 1;}, 1000);
}

// hides object's text content, overwrites it, then reveals content again
function overWrite(object, content) {
    // case: object not hidden
    if (object.style.opacity != 0) {
        object.style.opacity = 0;
        setTimeout(() => {object.textContent = content; object.style.opacity = 1;}, 1000);
    }
    // case: object hidden
    else {
        object.textContent = content;
        object.style.opacity = 1;
    }
}

// returns puzzle index
// new puzzle every mon, wed, fri; launch 02/06/2023
function getPuzzleIdx(numPuzzles) {
    // launch date and load date
    let launch = new Date(2023, 1, 6, 0, 0, 0, 0);
    // test load values below
    // let load = new Date(2023, 3, 5, 23, 0, 0, 0);
    let load = new Date();

    // weeks since launch
    let msSinceLaunch = Math.abs(load.getTime() - launch.getTime());
    let wkSinceLaunch = Math.floor(msSinceLaunch / (1000*60*60*24*7));

    let dayofWeek = load.getDay();
    let delta = 0;

    // puzzle number of current week
    if (dayofWeek == 1 || dayofWeek == 2) delta = 0;
    else if (dayofWeek == 3 || dayofWeek == 4) delta = 1;
    else delta = 2;

    // day's puzzle index
    return ((3 * wkSinceLaunch + delta) % numPuzzles); 
}

// returns puzzle from bank of puzzles
// no peeking :)
function getPuzzle() {
    let puzzles = [['wind', 'brass', 'prevailing', 'circular', 'river', 'airstream'],
    ['pilot', 'operate', 'wing', 'television', 'original', 'navigator'],
    ['contract', 'disease', 'bottleneck', 'manuscript', 'law', 'decrease'],
    ['rifle', 'fire', 'unauthorized', 'boring', 'loot', 'firearm'],
    ['dive', 'jackknife', 'disreputable', 'cliff', 'headlong', 'snorkel'],
    ['entrance', 'movement', 'hypnosis', 'hatchway', 'captivate', 'arrival'],
    ['ward', 'danger', 'maternity', 'guard', 'district', 'protect'],
    ['spell', 'hex', 'characters', 'indicate', 'magical', 'word'],
    ['bear', 'investing', 'birth', 'unpleasant', 'omnivorous', 'endure'],
    ['console', 'control', 'calm', 'computer', 'support', 'game'],
    ['branch', 'fork', 'executive', 'biology', 'diverge', 'limb'],
    ['spring', 'forward', 'metal', 'bloom', 'elastic', 'season'],
    ['desert', 'expose', 'biome', 'army', 'ditch', 'arid'],
    ['yield', 'annual', 'stress', 'relinquish', 'net', 'production'],
    ['monarch', 'czar', 'orange', 'flight', 'milkweed', 'larvae'],
    ['cricket', 'insect', 'european', 'team', 'bat', 'orthopterous'],
    ['object', 'dissent', 'tangible', 'raise', 'entity', 'disapprove'],
    ['present', 'tense', 'introduce', 'birthday', 'moment', 'gift'],
    ['tender', 'beef', 'love', 'exchange', 'fare', 'untoughened'],
    ['compound', 'union', 'interest', 'residence', 'combination', 'chemical'],
    ['bark', 'protective', 'noise', 'wooden', 'cover', 'canine'],
    ['subject', 'domain', 'force', 'knowledge', 'investigation', 'conditional'],
    ['relay', 'communicate', 'race', 'switch', 'circuit', 'baton'],
    ['collect', 'thoughts', 'accumulate', 'payable', 'evidence', 'gather']];

    return puzzles[getPuzzleIdx(puzzles.length)];
}