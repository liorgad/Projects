
def num_ways(n):

    dic = {}

    return num_ways_helper(n,dic)

    

def num_ways_helper(n,dic):
    if(n == 0):        
        return 0
    if(n== 1):
        return 1
    if(n== 2):
        return 2

    else:
        sub1=0
        sub2=0
        if(dic.has_key(n-1)):
            sub1 = dic.get(n-1)
        else:
            sub1 = num_ways_helper(n-1,dic)
            dic[n-1] = sub1

        if(dic.has_key(n-2)):
            sub2= dic.get(n-2)
        else:
            sub2 = num_ways_helper(n-2,dic) 
            dic[n-2] = sub2

        return sub1+sub2



result = num_ways(10)

print(result)