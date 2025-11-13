def find_longest_path(source):
    items = source.split('\n')
    prefix = []
    prefix_length = []
    max_length_so_far = -1
    max_path_so_far = ''
    for path in items:
        i = 0
        while path[i] == '\t':
            i += 1
        if len(prefix) > i:
            prefix = prefix[:i]
            prefix_length = prefix_length[:i]
        prefix.append(path[i:])
        prefix_length.append(len(path[i:]))
        if sum(prefix_length) > max_length_so_far:
            max_length_so_far = sum(prefix_length)
            max_path_so_far = '/'.join(prefix)
    return max_path_so_far

if __name__ == "__main__":
    path_name = "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext"
    print find_longest_path(path_name)
    path_name = "dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext"
    print find_longest_path(path_name)