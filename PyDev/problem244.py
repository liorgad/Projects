

def calc_primes(N):
    arr = [False] * N

    i =2

    while(i < N):
        while((i < N) and (arr[i]) ):
             i=i+1
        if(i==N):
            return
        print(i)
        k=2
        j=i*k
        while( j < N):
            arr[j] = True
            k = k+1
            j = i*k 
        
        i = i+1    
        k=2


if __name__ == "__main__":

    calc_primes(100)
   