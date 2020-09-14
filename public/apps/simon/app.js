var gameStart = true;
$(document).on("keydown", function () {
    if (gameStart) {

        $("#level-title").text("Level 0");

        gamesTurn();
    }
    gameStart = false;
})

/*$(".btn").click(function () {

    var button = $(this).attr("id");

    buttonEffects(button);

})*/


function buttonEffects(id) {

    switch (id) {
        case "green":
            var greenSound = new Audio("apps/simon/sounds/green.mp3");
            greenSound.play();
            break;
        case "red":
            var redSound = new Audio("apps/simon/sounds/red.mp3");
            redSound.play();
            break;
        case "yellow":
            var yellowSound = new Audio("apps/simon/sounds/yellow.mp3");
            yellowSound.play();
            break;
        case "blue":
            var blueSound = new Audio("apps/simon/sounds/blue.mp3");
            blueSound.play();
            break;
        case "gameOver":
            var wrong = new Audio("apps/simon/sounds/wrong.mp3");
            wrong.play();
            $("body").addClass("game-over");
            setTimeout(function () {
                $("body").removeClass("game-over");
            }, 100);
            $("#level-title").text("Game Over, Press Any Key to Restart");
            break;
        default:
            break;
    }

    $("#" + id).addClass("pressed");

    setTimeout(function () {
        $("#" + id).removeClass("pressed");
    }, 100);

}

//green = 1
//red = 2
//yellow = 3
//blue = 4

var difficultyLevel = 1;
var difficultyDelay = 1500;

var intervalCounter = 0;

function gamesTurn() {

    $(".btn").unbind("click");

    var myInterval = setInterval(function () {

        var random = Math.floor(Math.random() * 4) + 1;

        var actualId = $("." + random).attr("id");

        buttonEffects(actualId);

        //console.log(actualId);
        collectData(true, actualId);

        ++intervalCounter;
        if (intervalCounter == difficultyLevel) {

            clearInterval(myInterval);
            intervalCounter = 0;

            $(".btn").bind("click", function () {
                var button = $(this).attr("id");
                buttonEffects(button);
                collectData(false, button);
            });
        }

    }, difficultyDelay)

}

var gameMoves = [];
var playerMoves = [];
var playerMovesCounter = 0;

function collectData(d1, d2) {

    if (d1) {
        gameMoves.push(d2);
    } 
    else {
        playerMoves.push(d2);
        ++playerMovesCounter;
    }

    if (playerMovesCounter > 0) {
        compare();
    }

}

var successCheck = false;
var successCounter = 0;

function compare() {

    if (playerMoves[(playerMovesCounter - 1)] !== gameMoves[(playerMovesCounter - 1)]) {
        //console.log("not ok");
        buttonEffects("gameOver");
        playerMovesCounter = 0;
        gameMoves = [];
        playerMoves = [];
        successCounter = 0;
        gameStart = true;
        successCheck = false;
        difficultyLevel = 1;
        difficultyDelay = 1500;
    } 
    else {
        for (var i = 0; i < gameMoves.length; ++i) {
            if (gameMoves[i] == playerMoves[i]) {
                successCheck = true;
            } 
            else {
                successCheck = false;
            }
            //console.log(successCheck);
        }
        if (successCheck) {
            //console.log("ok");
            playerMovesCounter = 0;
            gameMoves = [];
            playerMoves = [];
            ++successCounter;
            $("#level-title").text("Level " + successCounter);
            gamesTurn();
            if (successCounter % 3 == 0) {
                ++difficultyLevel;
                $("#level-title").text("Level " + successCounter + " (Find: " + difficultyLevel + ")");
                difficultyDelay -= 100;
            }
        }

    }

}