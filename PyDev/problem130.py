def maxProfit(price, n):

     # Prices must be given for at least two days
    if (n == 1):
        return

    count = 0

    # solution array
    sol = []

    # Traverse through given price array
    i = 0
    while (i < n - 1):
        # Find Local Minima. Note that the limit is (n-2) as we are
        # comparing present element to the next element.
        while ((i < n - 1) and (price[i + 1] <= price[i])):
            i = i+1

        # If we reached the end, break as no further solution possible
        if (i == n - 1):
            break

        e = [0,0]
        i = i+1
        e[0] = i
        # Store the index of minima

        # Find Local Maxima.  Note that the limit is (n-1) as we are
        # comparing to previous element
        while ((i < n) and (price[i] >= price[i - 1])):
            i = i+1

        # Store the index of maxima
        e[1] = i - 1
        sol.append(e)

        # Increment number of buy/sell
        count = count+1

    # print solution
    if (count == 0):
        print("There is no day when buying the stock "  + "will make profit")
    else:
        for j in range(0,count):
            print("Buy on day: ",sol[j][0], "        ","Sell on day : ",sol[j][1])

if __name__ == "__main__":
    maxProfit([5, 2, 4, 0, 1], 5)
    
    #print(result)
