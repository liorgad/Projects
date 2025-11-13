
def largestSumHelper(arr, i, j,cache):

    if((None == arr) | ((j-i) == 0)):
        return arr[i]

    

    if((j-i) == 1):         
        key = createKey(i,j)
        m = 0
        if(cache.get(key) != None):
            print("cache hit") 
            return cache.get(key) 
        m = max(arr[i],arr[j])
        cache[key] = m
        return m
    
    key1 = createKey(i+2,j)
    key2 = createKey(i+1,j)
    lsh1 = 0
    lsh2 = 0
    if(cache.get(key1) != None):
        print("cache hit") 
        lsh1 = arr[i] + cache.get(key1)
    else :
        lsh1 = arr[i] + largestSumHelper(arr,i+2,j,cache)

    if(cache.get(key2) != None):
        print("cache hit") 
        lsh2 = cache.get(key2)
    else :
        lsh2 = largestSumHelper(arr,i+1,j,cache)


    sum = max(lsh1,lsh2)

    return sum


def largetSum(arr):
    
    cache = {}

    result = largestSumHelper(arr,0,len(arr)-1,cache)

    return result

def createKey(i,j):

    return str(i) + "," + str(j)
 
arr = [2,4,6,2,5]
arr2 = [5,1,1,5]
print(largetSum(arr))
print(largetSum(arr2))


