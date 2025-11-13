def max_coins(mat):

    if(None == mat or len(mat) == 0):
        return 0
    
    r = len(mat)
    c = len(mat[0])
    dp = dict()

    result = max_coin_helper(mat,0,0,r,c,dp)        

    print(dp)
    print "length : ", len(dp)

    return result

def max_coin_helper(mat,i,j,r,c,dp):

    if(i == r-1 and j == c-1):
        return mat[i][j]
    
    if(i == r-1):
        if(dp.has_key((i,j))):
            print("chach hit")
            return dp[(i,j)]

        dp[(i,j)] = mat[i][j] + max_coin_helper(mat,i,j+1,r,c,dp)
        return dp[(i,j)]
    
    if(j == c-1):
        if(dp.has_key((i,j))):
            print("chach hit")
            return dp[(i,j)]
        dp[(i,j)] =mat[i][j] + max_coin_helper(mat,i+1,j,r,c,dp)
        return dp[(i,j)] 
          

    if(dp.has_key((i,j))):
        print("chach hit")
        return dp[(i,j)]

    dp[(i,j)] = mat[i][j] + max(max_coin_helper(mat,i+1,j,r,c,dp),max_coin_helper(mat,i,j+1,r,c,dp))
    return dp[(i,j)]
    


if __name__ == "__main__":

    mat = [[0, 3 ,1, 1], [2, 0, 0, 4], [1, 5, 3 ,1]]

    m = max_coins(mat)

    print "Max Coins: " , m