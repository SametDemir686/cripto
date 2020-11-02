let cnv;


function setup() {
  	cnv = createCanvas(windowWidth, windowHeight);
	noLoop();
}

function windowResized() {
  	resizeCanvas(windowWidth, windowHeight);
}

function reset() {
	let element = document.getElementById("pnlTotal");
	var rowCount = element.rows.length;
	for (var i = rowCount - 1; i > 0; i--) {
		element.deleteRow(i);
	}
}

async function run() {
	reset();
	console.log(calculateOption(13700, 13500, 0.483, 0, 49.2));
}

function setTotalCapitalStart(value) {
	totalCapitalStart = parseFloat(value);
}

function setTotalCapitalEnd(value) {
	totalCapitalEnd = parseFloat(value);
}

function setTotalCapitalIncrement(value) {
	totalCapitalIncrement = parseFloat(value);
}

function setLevarageStart(value) {
	levarageStart = parseFloat(value);
}

function setLevarageEnd(value) {
	levarageEnd = parseFloat(value);
}

function setLevarageIncrement(value) {
	levarageIncrement = parseFloat(value);
}

function setExitStart(value) {
	exitStart = parseFloat(value);
}

function setExitEnd(value) {
	exitEnd = parseFloat(value);
}

function setExitIncrement(value) {
	exitIncrement = parseFloat(value);
}

function setPutNoStart(value) {
	putNoStart = parseFloat(value);
}

function setPutNoEnd(value) {
	putNoEnd = parseFloat(value);
}

function setPutNoIncrement(value) {
	putNoIncrement = parseFloat(value);
}

function setCallNoStart(value) {    callNoStart = parseFloat(value);}
function setCallNoEnd(value) {      callNoEnd = parseFloat(value);}
function setCallNoIncrement(value) {callNoIncrement = parseFloat(value);}

function setMoveNoStart(value) {    moveNoStart = parseFloat(value);}
function setMoveNoEnd(value) {      moveNoEnd = parseFloat(value);}
function setMoveNoIncrement(value) {moveNoIncrement = parseFloat(value);}

function setEntry(value) {
	entry = value;
}