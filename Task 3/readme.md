# General Non-Transitive One-Move Game.

This is a command-line implementation of the General Non-Transitive one-move game in Python. The game allows you to play against the computer by selecting one of the available moves and then determining the winner based on the rules of the game.

## Requirements

- Python 3.x
- Standard libraries: `sys`, `hashlib`, `random`, `string`
- Third-party libraries: `tabulate` (for generating a formatted table)

## How to Run the Game

1. Download or clone the repository to your local machine.

2. Make sure you have Python 3.x installed.

3. Install the `tabulate` library (if you don't have it installed) by running the following command in your terminal or command prompt:
   `pip install tabulate`

4. Navigate to the directory where the `game.py` file is located.

5. To play the game, run the following command in the terminal or command prompt
   `python game.py [move1] [move2] [move3] ... [moveN]`
   N = 2 k + 1 & N > 1

## Example Usage

1. Play Rock-Paper-Scissors game with moves "Rock," "Paper," and "Scissors":
   `python game.py Rock Paper Scissors`

2. Play a custom version of the game with any number of moves:
   `python game.py Move1 Move2 Move3 Move4 Move5`

## How to Play

1. The computer generates a cryptographic key (HMAC key) using a secure random generator.

2. The computer generates a HMAC based on the computer's choice(HMAC key + computer choice)

3. The HMAC is displayed for verification purposes.

4. The available moves are shown, and the user is asked to choose a move by entering the corresponding number.

5. If the user enters `0`, the game exits.

6. If the user enters `?`, a table of possible moves and their outcomes is displayed.

7. After the user's move, the computer's move is revealed, and the winner is determined based on the game's rules.

8. The result of the game is displayed, indicating whether the user won, lost, or it was a draw.

9. The HMAC key is shown for verification.
