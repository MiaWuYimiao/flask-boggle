from boggle import Boggle
from flask import Flask, render_template, session
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"

debug = DebugToolbarExtension(app)

@app.route('/')
def display_board():
    """Generate the board and display it on board page"""

    board = boggle_game.make_board()
    
    session['board'] = board

    return render_template('board.html', board = board)

