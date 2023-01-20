$submitForm = $("#submit-form");

class Boggle {
    constructor(size) {
        this.score = 0;
        this.time = 60;
        this.size = size;
        this.words = new Set(); 

        this.submitBoggleGuess = this.submitGuess.bind(this);
        $submitForm.on("submit", this.submitBoggleGuess);

        this.setTime(this.time);
    }
    

    async submitGuess(evt) {
        evt.preventDefault();

        let guess = $("#guess").val();

        console.log(guess)
        if(!guess) return;

        console.log(this.time)
        if( this.time === 0 ) return;

        console.log(this.words.has(guess))
        if(this.words.has(guess)) {
            this.showMessage("The entered word has been guessed already");
            return;
        }

        //get response from the axios request
        //const response = await axios.post("/submit", { "word" : guess }); // why cannot use post to get response here?
        const response = await axios.get("/submit", { params : { "word" : guess }})
        console.log(`response.data ${response.data}`)
        console.log(`response.json ${response.json}`)

        //check response data and display message on the page
        var msg = '';
        if( response.data.result === "not-on-board" ){
            msg = "The entered word is not on board.";
        } else if ( response.data.result === "not-word" ) {
            msg = "The entered string is not a word.";
        } else {
            msg = "The entered word is on board.";
            this.score += 1;
            this.words.add(guess);
        }
        this.showMessage(msg);
        this.showScore(this.score);

        $("#guess").val("").focus();
    }

    showMessage(msg) {
        $("#result").text(msg);
    }

    showScore(score) {
        $("#score").text(score);
    }

    async gameEnd() {
        //display end of game
        $("#time").text("Your time is out");

        //post score of this game to server
        const response = await axios.post("/update_score", { 'score' : this.score});
        console.log(`response.data ${response.data}`);
        console.log(`response.jason ${response.json}`);
    }

    async setTime() {
        let timer = setInterval(async () => {
            //display time
            $("#second").text(this.time)
            this.time--;
            if(this.time===0){
                clearInterval(timer);
                await this.gameEnd();
            }
        }, 10)
    }
}

