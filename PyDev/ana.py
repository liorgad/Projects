class FrequencyDict:
    def __init__(self, s):
        self.d = {}
        for char in s:
            self.increment(char)

    def _create_if_not_exists(self, char):
        if char not in self.d:
            self.d[char] = 0

    def _del_if_zero(self, char):
        if self.d[char] == 0:
            del self.d[char]

    def is_empty(self):
        return not self.d

    def decrement(self, char):
        self._create_if_not_exists(char)
        self.d[char] -= 1
        self._del_if_zero(char)

    def increment(self, char):
        self._create_if_not_exists(char)
        self.d[char] += 1
        self._del_if_zero(char)


def anagram_indices(word, s):
    result = []

    freq = FrequencyDict(word)

    for char in s[:len(word)]:
        freq.decrement(char)

    if freq.is_empty():
        result.append(0)

    for i in range(len(word), len(s)):
        start_char, end_char = s[i - len(word)], s[i]
        freq.increment(start_char)
        freq.decrement(end_char)
        if freq.is_empty():
            beginning_index = i - len(word) + 1
            result.append(beginning_index)

    return result

if __name__ == '__main__':
    anagram_indices("ab","abxaba")
