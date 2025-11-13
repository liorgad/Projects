import random

# List of words for the game
words = ["python", "hangman", "programming", "challenge", "word"]

def choose_random_word():
    return random.choice(words)

def play_hangman():
    word_to_guess = choose_random_word()
    guessed_letters = []
    attempts = 6  # Number of incorrect guesses allowed

    print("Welcome to Hangman! Try to guess the word.")
    print("_ " * len(word_to_guess))

    while attempts > 0:
        guess = input("Guess a letter: ").lower()

        if len(guess) != 1 or not guess.isalpha():
            print("Please enter a single letter.")
            continue

        if guess in guessed_letters:
            print("You've already guessed that letter.")
            continue

        guessed_letters.append(guess)

        if guess in word_to_guess:
            print("Good guess!")
        else:
            attempts -= 1
            print("Incorrect guess. You have", attempts, "attempts left.")

        display_word = ""
        for letter in word_to_guess:
            if letter in guessed_letters:
                display_word += letter + " "
            else:
                display_word += "_ "

        print(display_word)

        if "_" not in display_word:
            print("Congratulations! You've guessed the word:", word_to_guess)
            break

    if attempts == 0:
        print("Out of attempts. The word was:", word_to_guess)

if __name__ == "__main__":
    play_hangman()
print(ChatGPT_Hangman_game)

