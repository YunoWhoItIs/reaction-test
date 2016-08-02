var alphabet = "abcdefghijklmnopqrstuvwxyz";

// Arrays for scrambled string, numbers and input
var stringArr = [];
var numArr = [];
var inArr = [];
var score = 0;
var round = 1;
var speed = 150;
var endTime = 2350;
var finished = false;

// Get a random number between a specified range
function getRandomNo(min, max) {
  return Math.random() * (max - min) + min;
}

// Generate numbers to determine where the embedded numbers are placed in the string
function generateInsertPoint() {
	var pointArr = [];

	pointArr.push(getRandomNo(4, 8));
	pointArr.push(getRandomNo(9, 13));

	return pointArr;
}

// Generates array with numbers embedded in a scrambled string
function randomString() {
	var randNo, sChar;
	stringArr = [];
	numArr = [];

	// Generate number insert points
	var pArr = generateInsertPoint();

	// Generates a string 15 chars long
	for(var i = 0; i < 15; i++) {
		if((i == parseInt(pArr[0])) || (i == parseInt(pArr[1]))) {
			// Get a random number between 0 and 9
			sChar = Math.floor(getRandomNo(0, 10));

			// Store numbers
			numArr.push(sChar);
		} else {
			// Get a random alphabet character
			randNo = Math.floor(getRandomNo(0, 26));
			sChar = alphabet.charAt(randNo);
		}
		// Append char to string
		stringArr.push(sChar);
	}
}

// Change char shown in #string-display
function changeChar(c) {
	// Find the char according to the counter
	var subStr = stringArr[c];

	// Check if char is a number and change color if so
	if(!isNaN(parseInt(subStr))) {
		$("#string-display p").css("color", "#d11");
	} else {
		$("#string-display p").css("color", "#111");
	}

	// Display the string
	$("#string-display p").text(subStr);
}

// Compare user input with string numbers, increment score if a match is found
function checkNumbers(i) {
	// Push numbers into array
	inArr.push(i.charAt(0));
	inArr.push(i.charAt(1));

	// Increment score if input matches number
	for(var j = 0; j < 2; j++) {
		if(inArr[j] == numArr[j]){
			score++;
		}
	}
}

// Display a new string sequence
function newSequence() {
	var counter = 0;

	// Regenerate random string array
	randomString();

	// Change char at a set interval
	var change = setInterval(function() {changeChar(counter); counter++}, speed);

	// Stop changing after a period of time has elapsed
	setTimeout(function() {
		clearInterval(change);

		$("#string-display p").text("");
	}, endTime);
}

$(document).ready(function() {
	// Initialise stats
	$("#stat-round").text(round);
	$("#stat-speed").text(speed);

	$(document).on("click", "#input-submit", function() {
		inArr = [];

		// Get input from the page, test that it's a number
		var input = $("#input-numbers").val();

		// Stop here if input isn't a number
		if(input.match(/^[0-9]+$/)){
			checkNumbers(input);			
		} else {
			return false;
		}

		// If we haven't finished yet, go to next round
		if(round < 10) {
			round++;

			// Increase speed for later rounds
			if((round >= 4) && (round < 8)) {
				speed = 100;
				endTime = 1600;
			} else if(round >= 8) {
				speed = 50;
				endTime = 850;
			}

			// Update information
			$("#stat-round").text(round);
			$("#stat-speed").text(speed);

			newSequence();
		} else {
			// Only allow score display once
			if(finished == false) {
				console.log("finished - score: " + score);

				// Get a percentage value of the score
				var percentage = (score / 20) * 100;
				$("#string-display p").text(percentage + "%");

				finished = true;
			}
		}

		$("#input-numbers").val("");
	});

	newSequence();
});