from boggle import Boggle
from flask import Flask, render_template, session, request, jsonify
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"

app.debug = True

@app.route('/')
def display_board():
    """Generate the board and display it on board page"""

    board = boggle_game.make_board(5)
    
    session['board'] = board
    max_score = session.get("max_score", 0)
    play_times = session.get("times", 0)

    return render_template('index.html', board = board, 
                            max_score = max_score, 
                            times = play_times)

#@app.route('/submit', methods=["POST"])
@app.route('/submit')
def check_word():
    """Check submit word is valid and return a JSON response"""

    #guess_word = request.form.get("word")
    guess_word = request.args.get("word")
    board = session['board']

    result = boggle_game.check_valid_word(board, guess_word)

    #return jsonify("result", result)
    return jsonify({"result": result})

@app.route("/update_score", methods=["POST"])
def update_score():
    """update highest score and play times"""

    play_times = session.get("times", 0)
   
    score = request.json.get("score")
    max_score = session.get("max_score", 0)
    
    session["times"] = play_times + 1
    session["max_score"] = max(max_score, score)


    import pdb
    pdb.set_trace()
    return jsonify(brokeRecord = score > max_score)

    




