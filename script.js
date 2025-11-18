// sxternal puzzle bank (provided by puzzles.js)
const puzzles = PUZZLE_BANK;

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
const shareButton = document.getElementById("shareButton");
const copyNotice = document.getElementById("copyNotice");

const correctColor = "rgb(0, 128, 255)";
const wrongColor = "rgb(255, 128, 0)";

// triggers check for guess submission
guessBox.addEventListener("keyup", submit);

let attempts = 0;               // guesses in puzzle
let target = "";                // puzzle solution
let canSubmit = true;           // prevents issue with spam
let playing = true;             // flag for in-progress puzzle
let puzzle = getPuzzle();       // puzzle = [solution, clue1, ..., clue5]

// ensure share button hidden initially (if element exists)
if (shareButton) {
    shareButton.style.display = "none";
    if (copyNotice) copyNotice.style.opacity = 0;
}

// kickstarts the puzzle
setTimeout(() => { create(); }, 500);

// creates a fresh puzzle
function create() {
    // reset state
    attempts = 0;
    canSubmit = true;
    playing = true;

    // pick puzzle (puzzle variable already set at load, but refresh for safety)
    puzzle = getPuzzle();
    target = puzzle[0];

    // reset UI
    overWrite(indicator, '⚫⚫⚫⚫⚫');
    overWrite(clue1, puzzle[1]);
    overWrite(clue2, puzzle[2]);

    // hide later clues and solution length
    clue3.textContent = '-'; clue3.style.opacity = 0;
    clue4.textContent = '-'; clue4.style.opacity = 0;
    clue5.textContent = '-'; clue5.style.opacity = 0;
    solnLength.textContent = '-'; solnLength.style.opacity = 0;

    previous.textContent = '';
    previous.style.opacity = 1;

    // hide share UI
    if (shareButton) shareButton.style.display = "none";
    if (copyNotice) copyNotice.style.opacity = 0;

    // clear input
    guessBox.value = "";
    guessBox.style.background = "white";
}

// checks if event is [enter key being released]
function submit(e) {
    if (e.keyCode == 13 && playing && canSubmit) {
        check(guessBox.value);
        canSubmit = false;
        setTimeout(() => { canSubmit = true; }, 1000);
    }
}

// checks (valid) guess against solution
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
        setTimeout(() => { guessBox.style.background = "white"; }, 1000);

        // display solution
        overWrite(previous, "- " + target + " -");

        // update indicator
        if (attempts == 1) overWrite(indicator, '🔵⚫⚫⚫⚫');
        else if (attempts == 2) overWrite(indicator, '🟠🔵⚫⚫⚫');
        else if (attempts == 3) overWrite(indicator, '🟠🟠🔵⚫⚫');
        else if (attempts == 4) overWrite(indicator, '🟠🟠🟠🔵⚫');
        else if (attempts == 5) overWrite(indicator, '🟠🟠🟠🟠🔵');

        // show share button
        showShareButton();
    }
    // case: incorrect guess
    else {
        // subcase: all attempts used; shut off play
        if (attempts >= 5) playing = false;

        // update list of incorrect guesses
        if (attempts == 1) overWrite(previous, guess.toLowerCase());
        else sideWrite(previous, ", " + guess.toLowerCase());

        // visual cue that guess was wrong
        guessBox.style.background = wrongColor;
        setTimeout(() => { guessBox.style.background = "white"; }, 1000);

        // update indicator
        if (attempts == 1) overWrite(indicator, '🟠⚫⚫⚫⚫');
        else if (attempts == 2) overWrite(indicator, '🟠🟠⚫⚫⚫');
        else if (attempts == 3) overWrite(indicator, '🟠🟠🟠⚫⚫');
        else if (attempts == 4) overWrite(indicator, '🟠🟠🟠🟠⚫');
        else if (attempts == 5) {
            overWrite(previous, "- " + target + " -");
            overWrite(indicator, '🟠🟠🟠🟠🟠');
            showShareButton();
        }

        // next puzzle or prize awarded at end
        updateClues();
    }

}

// updates puzzle state based on attempts
function updateClues() {
    if (attempts == 1) {
        clue3.textContent = puzzle[3];
        clue3.style.opacity = 1;
    }
    else if (attempts == 2) {
        clue4.textContent = puzzle[4];
        clue4.style.opacity = 1;
    }
    else if (attempts == 3) {
        solnLength.textContent = (String(target.length) + " letters");
        solnLength.style.opacity = 1;
    }
    else if (attempts == 4) {
        clue5.textContent = puzzle[5];
        clue5.style.opacity = 1;
    }
}

// hides object's text content, appends to it, then reveals content again
function sideWrite(object, content) {
    object.style.opacity = 0;
    setTimeout(() => { object.textContent += content; object.style.opacity = 1; }, 1000);
}

// hides object's text content, overwrites it, then reveals content again
function overWrite(object, content) {
    // case: object not hidden
    if (object.style.opacity != 0) {
        object.style.opacity = 0;
        setTimeout(() => { object.textContent = content; object.style.opacity = 1; }, 1000);
    }
    // case: object hidden
    else {
        object.textContent = content;
        object.style.opacity = 1;
    }
}

// returns puzzle index for daily puzzles (new puzzle every calendar day)
function getPuzzleIdx(numPuzzles) {
    // launch date
    const launch = new Date(2025, 11, 18);
    const today = new Date();

    // calculate whole days since launch
    const msSinceLaunch = today.getTime() - launch.getTime();
    const daysSinceLaunch = Math.floor(msSinceLaunch / (1000 * 60 * 60 * 24));

    // cycle through puzzle bank
    return ((daysSinceLaunch % numPuzzles) + numPuzzles) % numPuzzles;
}

// returns puzzle from bank
function getPuzzle() {
    return puzzles[getPuzzleIdx(puzzles.length)];
}

// share result
function showShareButton() {
    if (!shareButton) return;
    shareButton.style.display = "inline-block";
    // ensure we don't attach multiple listeners
    if (!shareButton.dataset.listener) {
        shareButton.addEventListener("click", copyResult);
        shareButton.dataset.listener = "1";
    }
}

function copyResult() {
    const today = new Date();

    // format date as YYYY-MM-DD (clean + share-friendly)
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const shareText = `📜 The Civil Word — ${formattedDate}\n${indicator.textContent}\nthecivilword.github.io`;

    navigator.clipboard.writeText(shareText).then(() => {
        if (copyNotice) {
            copyNotice.style.opacity = 1;
            setTimeout(() => copyNotice.style.opacity = 0, 1500);
        }
    }).catch((err) => {
        // fallback: try older execCommand (rare), or alert user
        try {
            const ta = document.createElement('textarea');
            ta.value = shareText;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            if (copyNotice) {
                copyNotice.style.opacity = 1;
                setTimeout(() => copyNotice.style.opacity = 0, 1500);
            }
        } catch (e) {
            alert("Could not copy result to clipboard.");
            console.error("Copy failed:", e || err);
        }
    });
}
