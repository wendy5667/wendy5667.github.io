var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var myReq;
// load images

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

// bird.src = "images/bird_yellow.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";


// some variables

var gap = 90;
var constant;
var start = false;
var bX = 100;
var bY = 150;

var gravity = 1.5;

var score = 0;

// audio files

var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";


// on key down

$(document).keydown(function() {
    if (start == true) {
        bY -= 30;
        fly.play();
    }
})



// pipe coordinates

var pipe = [];

pipe[0] = {
    x: cvs.width,
    y: 0
};

// draw images

function draw() {

    ctx.drawImage(bg, 0, 0);


    for (var i = 0; i < pipe.length; i++) {

        constant = pipeNorth.height + gap;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        pipe[i].x -= 2;

        if (pipe[i].x == cvs.width - 250) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            });
        }

        //detect collision

        if (bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant) || bY + bird.height >= cvs.height - fg.height) {
            start = false;
            $('#score').text(score);
            $('#end').show();
            $('#reload').on('click', function() {
                location.reload();
            });
        }

        if (pipe[i].x == 80) {
            if (start == true) {
                score++;
                scor.play();
            }
        }


    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);

    ctx.drawImage(bird, bX, bY);

    bY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, cvs.height - 20);

    myReq = requestAnimationFrame(draw);

}
$('#bluebird').on('click', function() {
    start = true;
    $('#start1').hide();
    $('#end').hide();
    bird.src = "images/bird_blue.png";
    draw();
});
$('#yellowbird').on('click', function() {
    start = true;
    $('#start1').hide();
    $('#end').hide();
    bird.src = "images/bird_yellow.png";
    draw();
});
$('#redbird').on('click', function() {
    start = true;
    $('#start1').hide();
    $('#end').hide();
    bird.src = "images/bird_red.png";
    draw();
});