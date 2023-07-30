import sys
import random
import hashlib
import hmac
from tabulate import tabulate

class KeyGenerator:
    def generate_random_key(self):
        return hashlib.sha256(str(random.getrandbits(256)).encode()).hexdigest()

class HmacGenerator:
    def __init__(self, key):
        self.key = key

    def generate_hmac(self, data):
        hmac_obj = hmac.new(self.key.encode(), data.encode(), hashlib.sha256)
        return hmac_obj.hexdigest()

class WinnerDeterminer:
    def __init__(self, moves):
        self.moves = moves

    def determine_winner(self, user_choice, computer_choice):
        winner_matrix = self.generate_winner_matrix(len(self.moves))
        user_index = self.moves.index(user_choice)
        computer_index = self.moves.index(computer_choice)
        result = winner_matrix[computer_index][user_index]
        if result == "Win":
            return "You Win!"
        elif result == "Lose":
            return "Computer Win!"
        else:
            return "Draw"

    def generate_winner_matrix(self, num_choices):
        winner_matrix = [["" for _ in range(num_choices)] for _ in range(num_choices)]
        for i in range(num_choices):
            for j in range(num_choices):
                if i == j:
                    winner_matrix[i][j] = "Draw"
                else:
                    diff = (j - i) % num_choices
                    if diff <= num_choices // 2:
                        winner_matrix[i][j] = "Win"
                    else:
                        winner_matrix[i][j] = "Lose"
        return winner_matrix




class TableGenerator:
    def generate_table(self,matrix, moves):
        headers = ["v PC\\User >"] + moves
        rows = [[moves[i]] + row for i, row in enumerate(matrix)]
        return tabulate(rows, headers=headers, tablefmt="grid", numalign="center", stralign="center")

def main():
    if len(sys.argv) < 4 or (len(sys.argv) - 1) % 2 == 0 or len(set(sys.argv[1:])) != len(sys.argv) - 1:
        print("Invalid input. Please provide an odd number (>=3) of unique choices.")
        print("Example: python game.py Rock Paper Scissors")
        sys.exit(1)

    moves = sys.argv[1:]
    key_generator = KeyGenerator()
    game_key = key_generator.generate_random_key()

    hmac_generator = HmacGenerator(game_key)
    winner_determiner = WinnerDeterminer(moves)
    table_generator = TableGenerator()

    computer_choice = random.choice(moves)

    while True:
        hmac_result = hmac_generator.generate_hmac(computer_choice)
        print("HMAC:", hmac_result)

        print("Available moves:")
        for index, move in enumerate(moves, 1):
            print(f"{index} - {move}")

        print("0 - exit")
        print("? - help")

        user_input = input("Enter your move: ")
        if user_input == '0':
            print("Exiting the game. Goodbye!")
            break
        elif user_input == '?':
            winner_matrix = winner_determiner.generate_winner_matrix(len(moves))
            table = table_generator.generate_table(winner_matrix, moves)
            print('User perspective:\n')
            print(table)
            print()
            continue

        try:
            user_choice_index = int(user_input) - 1
            user_choice = moves[user_choice_index]
            if user_choice not in moves:
                print("Invalid move. Try again.")
                continue
        except ValueError:
            print("Invalid input. Please enter a number or '?' for help.")
            continue

        print("Your move:", user_choice)
        print("Computer move:", computer_choice)

        winner = winner_determiner.determine_winner(user_choice, computer_choice)
        print(winner)

        print("HMAC key:", game_key)
        print()
        break
if __name__ == "__main__":
    main()
