def find_median(arr):

    if(None== arr | len(arr) ==0):
        return 0

    if(len(arr) ==1):
        return arr[0]
    
    m1 = arr[0]
    m2 = arr[0]
    median = arr[0]

    for i in xrange(1,len(arr)-1):
        if i%2 == 0 : #even case
            if(arr[i] > m1 & arr[i] > m2):
                if(m1 < m2):
                    m1 = arr[i]
                else:
                    m2 = arr[i]
         # odd case
        



    return 0


if __name__ == "__main__":
    s = find_median( [2, 1, 5, 7, 2, 0, 5])
    print(s)