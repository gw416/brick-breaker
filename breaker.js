const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#alert')
const blockWidth = 100
const blockHeight = 20
const boardWidth = 560
const boardHeight = 500
const ballDiameter = 20
const userStartPos = [230,50]
const ballStartPos = [270,110]
const position = document.getElementById('grid').getBoundingClientRect();
const xOffset = position.left + 1;
let currentPosition = userStartPos
let ballCurrentPosition =  ballStartPos
let xDirection = 2
let yDirection = 2
let timerId

// Block Class definition
class Block {
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis,yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight =[xAxis + blockWidth, yAxis + blockHeight]
    }
}

const blocks = [
    new Block(10,470), new Block(120,470), new Block(230,470), new Block(340,470), new Block(450,470),
    new Block(10,440), new Block(120,440), new Block(230,440), new Block(340,440), new Block(450,440),
    new Block(10,410), new Block(120,410), new Block(230,410), new Block(340,410), new Block(450,410),
    new Block(10,380), new Block(120,380), new Block(230,380), new Block(340,380), new Block(450,380)
]

function addBlocksToGrid(){
    for(let i=0; i<blocks.length;i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px' // xAxis
        block.style.bottom = blocks[i].bottomLeft[1] + 'px' // yAxis
        grid.appendChild(block)
    }
}

function removeAllBlocksFromGrid() {
    clearInterval(timerId)
    const allBlocks = Array.from(document.querySelectorAll('.block'))
    for(let i=0; i<allBlocks.length; i++) {
        allBlocks[i].classList.remove('block')
        blocks.splice(i, 1)
    }
}

function drawUser() { 
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}

function moveUser(e) {
    if(e.pageX > xOffset && e.pageX < xOffset + (boardWidth - blockWidth)) {
        currentPosition[0] = e.pageX - xOffset;
        drawUser()
    }
}

function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}

function checkForCollisions() { 
    // Check for Block Collision
    for(let i=0; i<blocks.length; i++) {
        if( (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1] )) 
        { 
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1)
            changeDir()

            // Check for Win
            if(blocks.length === 0 ) {
                scoreDisplay.innerHTML = 'YOU WIN!!'
                clearInterval(timerId)
                document.removeEventListener('mousemove', moveUser)
            }
        }
    }
    
    // Check Wall Collision
    if( ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0 ) {
        changeDir()
    }

    // Check for User Collision
    if( (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < (currentPosition[0] + blockWidth)) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < (currentPosition[1] + blockHeight))) {
        changeDir()
    }

    // Check Ground Collision - Game Over
    if(ballCurrentPosition[1] <= 0) {
        clearInterval(timerId)
        scoreDisplay.innerHTML = 'YOU LOSE!!'
        document.removeEventListener('mousemove', moveUser)
    }
}

// Change Ball Direction after collision
function changeDir() {
    if(xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    } else if(xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return
    } else if(xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    } else if(xDirection === -2 && yDirection === 2) {
        xDirection = 2
        return
    }
}

// Play/Refresh/close breakers
function play() {
    timerId = setInterval(moveBall, 10)
    modalContainer.classList.add('show');
}
function close() {
    window.location.reload()
}

// Event Listeners
const modalContainer = document.getElementById('modal-container');
const playButton = document.getElementById('button-play');
const closeButton = document.getElementById('button-close');
playButton.addEventListener('click', play);
closeButton.addEventListener('click', close)
document.addEventListener('mousemove', moveUser)

// Add Blocks to grid
addBlocksToGrid()

// Add User
const user = document.createElement('div')
user.classList.add('user')
drawUser()
grid.appendChild(user)

// Add Ball
const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)





// - - - - - - - - - - - - - - - - - - - - - - - -
//
//
// Below code taken from open source, not sure how to handle touchpad movement of user?
// hope this works!
//
//
//
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* right swipe */
            if(xDiff > xOffset && xDiff < xOffset + (boardWidth - blockWidth)){
                currentPosition[0] = xDiff - xOffset;
                drawUser()
            } 
        } else {
            /* left swipe */
        }                       
    } 
    /* reset values */
    xDown = null;
    yDown = null;                                             
};