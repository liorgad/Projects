
import sys

def min_steps(start,end,mat):

    if(validate_current_place(start,end)):
        return 0

    return check_next_move(start,end,mat)



def validate_current_place(current_postion,end):
    return (current_postion[0] == end[0]) & (current_postion[1] == end[1])
    

def check_next_move(current,end,mat):

    x = [-1,0,0,1]
    y = [0,-1,1,0]
    min_values = [sys.maxint,sys.maxint,sys.maxint,sys.maxint]

    for i in xrange(0,len(x)-1):

        if mat[current[0] + x[i]][current[1] + y[i]] == True :
            continue
        min_values[i] = 1+ min_steps((current[0] + x[i],current[1] + y[i]),end,mat)
    
    return min(min_values)
        
        


if __name__ == "__main__":
    mat = [[False, False, False, False],
           [True,  True,  False, True],
           [False, False, False, False],
           [False, False, False, False]]

    start = (3, 0)
    end = (0,0)

    mat1=[[False, False],
           [False,  True]]

    start1 = (1, 0)
    end1 = (0,0)

    result = min_steps(start,end,mat)

    print(result)