def sqr_sort(sorted_arr):
    # find equlebrium  point  - index of positive and the index before negative
    result = binarySearch(sorted_arr)  # O(log(n))

    if(not result[0]):
        return [x**2 for x in sorted_arr]

    # take min of sqr of positive and negative and advance the sqr of the min
    positive_index = result[1]
    negative_index = result[1]-1
    items = 0
    resultArr = []
    l = len(sorted_arr)
    while(items < l):
        if(positive_index < l and negative_index >= 0):
            pos_sqr = sorted_arr[positive_index]**2
            neg_sqr = sorted_arr[negative_index]**2

            if(pos_sqr < neg_sqr):
                resultArr.append(pos_sqr)
                positive_index = positive_index + 1
                items = items + 1
            elif(pos_sqr > neg_sqr):
                resultArr.append(neg_sqr)
                negative_index = negative_index - 1
                items = items + 1
            else:
                resultArr.append(neg_sqr)
                resultArr.append(pos_sqr)
                positive_index = positive_index + 1
                negative_index = negative_index - 1
                items = items + 2
        elif(positive_index < l):
            pos_sqr = sorted_arr[positive_index]**2
            resultArr.append(pos_sqr)
            positive_index = positive_index + 1
            items = items + 1
        else:
            neg_sqr = sorted_arr[negative_index]**2
            resultArr.append(neg_sqr)
            negative_index = negative_index - 1
            items = items + 1
    return resultArr


def binarySearch(alist):
    first = 0
    last = len(alist)-1
    found = False
    index = -1

    while first <= last and not found:
        midpoint = (first + last)//2
        if alist[midpoint] >= 0 and alist[midpoint-1]:
            found = True
            index = midpoint
        else:
            if 0 < alist[midpoint]:
                last = midpoint-1
            else:
                first = midpoint+1

    return (found, index)


if __name__ == "__main__":
    result = sqr_sort([-9, -2, 0, 2, 3])
    print(result)
    result = sqr_sort([0, 2, 3,4])
    print(result)
    result = sqr_sort([-2, -3,-4])
    print(result)

