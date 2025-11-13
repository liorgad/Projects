def lowestPositive(arr):

    positiveSum=0
    
    for i in arr:
        if(i >0): positiveSum +=i
    
    n = len(arr)

    sum = ((1 + n)*n)/2


    return sum-positiveSum

# arr = [3, 4, -1, 1]
arr = [2,1,0]

result = lowestPositive(arr)

print(result)