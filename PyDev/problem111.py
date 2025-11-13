def find_anagram(W, S):

    str_len = len(S)
    word_len = len(W)

    i = 0
    indexSet = set()

    while(i < str_len):
        if (compare_word(W, S, i, str_len, word_len)):
            indexSet.add(i)
        i = i+1

    i = 0
    s = S[::-1]

    while(i < str_len):
        if(compare_word(W, s, i, str_len, word_len)):
            indexSet.add(str_len-(i+word_len))
        i = i+1
    return indexSet


def compare_word(W, S, str_index, str_len, word_len):
    if ((str_len - str_index) < word_len):
        return False
    i = 0
    while i < word_len:
        if(W[i] != S[str_index+i]):
            return False
        i = i+1

    return True


if __name__ == "__main__":
    result = find_anagram('ab', 'abxaba')
    print(result)
