def longest_increasing_subsequence(arr):
    if not arr:
        return 0
    if len(arr) == 1:
        return 1

    max_ending_here = 0
    for i in range(len(arr)):
        ending_at_i = longest_increasing_subsequence(arr[:i])
        if arr[-1] > arr[i - 1] and ending_at_i + 1 > max_ending_here:
            max_ending_here = ending_at_i + 1
    return max_ending_here

if __name__ == '__main__':
        print longest_increasing_subsequence( [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15])