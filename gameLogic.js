// Variables
// Canvas
var canvas, canvasContext;
// Ball
var ballX, ballY, ballSpeedX;
// Paddle
const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
var paddleX;
// Mouseposition
var mouseX;
var mouseY;

// Bricks
const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
var brickGrid = new Array(BRICK_COLS);

function brickReset() {
	for(var i=0; i<BRICK_COLS * BRICK_ROWS; i++) {
		brickGrid[i] = true;
	} // end of for each brick
} // end of brickReset func

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');	
	// Setup
	var framesPerSecond = 30;
	ballX = 75;
	ballSpeedX = 5;
	ballY = 75;
	ballSpeedY = 7;
	paddleX = 400;

	setInterval(updateAll, 1000/framesPerSecond);
	canvas.addEventListener('mousemove', updateMousePos);
	brickReset();
}

function updateMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

	paddleX = mouseX - PADDLE_WIDTH / 2;
}

function updateAll(){
	moveAll();
	drawAll();
}

// Snaps
function rowColToArrayIndex(col, row){
	return col + BRICK_COLS * row;
}

function drawBricks(){
	//colorRect(0,0, BRICK_W, BRICK_H, 'orange');
	//colorRect(BRICK_W,0, BRICK_W, BRICK_H, 'magenta');
	for(var eachRow = 0; eachRow < BRICK_ROWS; eachRow++){
		for(var eachCol = 0; eachCol < BRICK_COLS; eachCol++){
			var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
			//console.log("index: " + eachRow + " ," + eachCol + ": " + brickGrid[arrayIndex] +  " #" + arrayIndex);
			color = ['blue', 'red', 'purple', 'orange', 'cyan', 'magenta', 'brown'];
			if(brickGrid[arrayIndex]){
				colorRect(eachCol * BRICK_W, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, color[eachRow]);
			}
		}
	}
}

function drawAll(){
	colorRect(0,0, canvas.width, canvas.height, 'black'); // clear screen
	colorCircle(ballX, ballY, 10, 'white'); // draw ball

	colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'blue');

	drawBricks();

	var mouseBrickCol = Math.floor(mouseX / BRICK_W);
	var mouseBrickRow = Math.floor(mouseY / BRICK_H);
	var brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol,mouseBrickRow);
	colorText(mouseBrickCol + " ," + mouseBrickRow + ":" + brickIndexUnderMouse, mouseX, mouseY, 'green');

}

function colorText(showWords, textX, textY, fillColor){
	canvasContext.font = '20pt Calibri';
	canvasContext.fillStyle = fillColor;
	if(textX > 700){
		canvasContext.fillText(showWords, textX - 100, textY);
	}
	else {
		canvasContext.fillText(showWords, textX, textY);	
	}
	
}	

function ballReset() {
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function moveAll(){
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX > canvas.width){ // right side
		ballSpeedX *= -1;
	}

	if(ballY > canvas.height){ // bottom edge
		ballReset();
	}

	if(ballY < 0){ // top edge
		ballSpeedY *= -1;
	}

	if(ballX < 0){ // left side
		ballSpeedX *= -1;
	}

	var ballBrickCol = Math.floor(ballX / BRICK_W);
	var ballBrickRow = Math.floor(ballY / BRICK_H);

	if(brickIndexUnderMouse >= 0 && brickIndexUnderMouse < BRICK_COLS * BRICK_ROWS){
		brickGrid[brickIndexUnderMouse] = false;
	}

	var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
	var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
	var paddleLeftEdgeX = paddleX;
	var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

	if(	ballY > paddleTopEdgeY - 5 && //below the top of paddle
		ballY < paddleBottomEdgeY && // above bottom of paddle
		ballX > paddleLeftEdgeX && // right of the left side of the paddle
		ballX < paddleRightEdgeX){ // left of the right side of the paddle

		ballSpeedY *= -1;

		var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
		var ballDisFromPaddleCenterX = ballX - centerOfPaddleX;
		ballSpeedX = ballDisFromPaddleCenterX * 0.35;
	}
}

function colorRect(topLeftX, topeLeftY, boxWidth, boxHeigth, fillColor){
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX, topeLeftY, boxWidth, boxHeigth);
}

function colorCircle(centerX, centerY, radius, fillColor){
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();
}