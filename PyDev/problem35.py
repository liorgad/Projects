def sort(rgbs):
    left_index, right_index = 0, len(rgbs) - 1
    while True:  # move Rs to front

        while rgbs[left_index] == 'R' and left_index < right_index:  # advance to first non R
            left_index += 1

        while rgbs[right_index] != 'R' and left_index < right_index:  # regress to last R
            right_index -= 1

        if left_index >= right_index:
            break

        rgbs[left_index], rgbs[right_index] = rgbs[right_index], rgbs[left_index]

    right_index = len(rgbs) - 1
    while True:  # move Bs to tail

        while rgbs[left_index] != 'B' and left_index < right_index:  # advance to first B
            left_index += 1

        while rgbs[right_index] == 'B' and left_index < right_index:  # regress to last non B
            right_index -= 1

        if left_index >= right_index:
            break

        rgbs[left_index], rgbs[right_index] = rgbs[right_index], rgbs[left_index]

    return rgbs


def main():
    print sort(['G', 'B', 'R', 'R', 'B', 'R', 'G'])


if __name__ == '__main__':
    main()