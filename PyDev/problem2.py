
def product(arr):

    resultArr = []
    prod = 1
    for i in arr : 
        prod*=i
    for index in range(len(arr)):
        resultArr.append(prod / arr[index])

    return resultArr



arr = [3,2,1]

result = product(arr)

print(result)
