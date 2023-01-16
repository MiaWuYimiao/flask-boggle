from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def test_display_board(self):
        with app.test_client() as client:
            #
            resp = client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<label for="guess">Give a guess</label>', html)
            self.assertIsNone(session.get('max_score'))
            self.assertIsNone(session.get('times'))

    def test_check_word(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] = [["C", "A", "T", "T", "T"], 
                                            ["C", "A", "T", "T", "T"], 
                                            ["C", "A", "T", "T", "T"], 
                                            ["C", "A", "T", "T", "T"], 
                                            ["C", "A", "T", "T", "T"]]
            resp = client.get('/submit?word=cat')

            self.assertEqual(resp.json.get('result'), 'ok')

    def test_invalid_word(self):
        with app.test_client() as client:
            resp = client.get('/submit?word=impossible')
            
            self.assertEqual(resp.json.get('result'), 'not-on-board')

    def test_invalid_word(self):
        with app.test_client() as client:
            resp = client.get('/submit?word=fajelkjte')
            
            self.assertEqual(resp.json.get('result'), 'not-word')

    def test_update_score(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['max_score'] = 5
                change_session['times'] = 3

            resp = client.post('/update_score', 
                                data={'score':'7'})

            self.assertEqual(resp.json.get('brokeRecord'), 'True')
                           