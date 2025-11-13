

def zigzag(s,k):

    lines = []   

    for i in range(1, (len(s) / k)+1):
        print("i="+str(i))
        for j in range(1,k):
            print(j)        
        for w in xrange(k-1,0,-1):
            print(w)


if __name__ == "__main__":
    zigzag("thisisazigzag",4)