$submitForm = $("#submit-form");

let score = 0
let time = 60

async function submitGuess(evt) {
    evt.preventDefault();

    let guess = $("#guess").val();

    console.log(guess)
    if(guess === ""){
        return;
    }

    console.log(time)
    if( time === 0 ) {
        // Display a message says your time is out??
        return;
    }

    //get response from the axios request
    //const response = await axios.post("/submit", { "word" : guess }); // why cannot use post to get response here?
    const response = await axios.get("/submit", { params : { "word" : guess }})
    console.log(response.data)

    //check response data and display message on the page
    if( response.data.result === "not-on-board" ){
        msg = "The entered word is not on board.";
    } else if ( response.data.result === "not-word" ) {
        msg = "The entered string is not a word.";
    } else {
        msg = "The entered word is on board";
        score+=1;
    }
    showMessage(msg);
    showScore(score);
}


$submitForm.on("submit", submitGuess);

function showMessage(msg) {
    $("#result").text(msg);
}

function showScore(score) {
    $("#score").text(score);
}

async function gameEnd() {
    //display end of game
    $("#time").text("Your time is out");

    //post score of this game to server
    const response = await axios.post("/update_score", { 'score' : score});

}

async function setTime(time) {
    let timer = setInterval(async function(){
        console.log(time)
        //display time
        $("#second").text(time)
        time--;
        if(time===0){
            clearInterval(timer);
            await gameEnd();
        }
    }, 1000)
}

setTime(time);

