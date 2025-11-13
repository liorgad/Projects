
def sumMaxArr(arr,k):
    if(len(arr) == 0 | k == 0 | k==1 | k==len(arr) ):
        return arr   
    
    for i in range(len(arr)-k+1):
        kArr = arr[i:k+i]
        arr[i] = max(kArr)        


    return arr[:len(arr)-k+1]



if __name__ == "__main__":
    s = sumMaxArr([10, 5, 2, 7, 8, 7],3)
    print(s)