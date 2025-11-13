def paths_all_leaves(tree):

    result_paths = []
    paths_all_leaves_helper(tree, [], result_paths)

    # start from root

    # send to each node the path so far, concat and continue

    return result_paths


def paths_all_leaves_helper(tree, path_to_here, result_paths):

    if(tree == None):
        return

    p = list(path_to_here)
    p.append(tree.key)

    if(tree.isLeaf()):
        result_paths.append(p)
        return

    paths_all_leaves_helper(tree.left, p, result_paths)
    paths_all_leaves_helper(tree.right, p, result_paths)


class Node():
    def __init__(self, key, left, right):
        self.key = key
        self.left = left
        self.right = right

    def isLeaf(self):
        return self.right == None and self.left == None


if __name__ == "__main__":
    tree = Node(1, Node(2, None, None), Node(
        3, Node(4, None, None), Node(5, None, None)))
    result = paths_all_leaves(tree)
    print(result)
