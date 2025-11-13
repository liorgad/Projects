
def isPalindrom(str,i,j):     

    while(j >= i):
        if(str[i] != str[j]):
            return False
        i+=1
        j-=1

    return True

def findMaxPalindrom(str):

    i =0
    j= len(str) -1
    
    return findMaxPalHelper(str,i,j)
    
def findMaxPalHelper(str,i,j):
    if(((j-i) == 0) | (None == str)):
        return 0
    if((j-i) == 1):
        return 1

    if(isPalindrom(str,i,j)):
        return j-i+1
    
    return max(findMaxPalHelper(str,i,j-1),findMaxPalHelper(str,i+1,j))



result = findMaxPalindrom("bananas")
print(result)