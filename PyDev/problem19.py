
def findMinCost(N,k,costMat):	

	minResults = []

        cache = {}
        
	
	for r in range(0,k):
		minResults.append(costMat[0][r] + findMinCostHelper(N,k,N-1,r,costMat,cache))
	
	return min(minResults)


def findMinCostHelper(N,k,remainingHouses,restrictedColor,costMat,cache):
	if remainingHouses==0:
		return 0

	costsForCurrentHouse = costMat[N-remainingHouses]

	minCost = 0,costsForCurrentHouse[0]
	for i in range(1,len(costsForCurrentHouse)):
		if (i == restrictedColor):
			continue
		if costsForCurrentHouse[i] < minCost[1]:
			minCost = i,costsForCurrentHouse[i]

        cacheResult = cache.get(str(remainingHouses)+str(restrictedColor))
        if(cacheResult != None):
                print("cache hit !")
                return minCost[1] + cacheResult
        
        sumMinCost = findMinCostHelper(N,k,remainingHouses-1,minCost[0],costMat,cache)
        cache[str(remainingHouses)+str(restrictedColor)] = sumMinCost
	return minCost[1] + sumMinCost


if __name__ == "__main__":
        A = [   [1, 4, 5, 12], 
            [5, 8, 9, 1],
            [6, 7, 11, 19],
            [7, 1, 5, 16],
            [16, 8, 32, 1],
            [4, 9, 3, 22]]

        result = findMinCost(6,4,A)
        print(result)


        costMat = [
                [4,0,3],
                [8,3,8],
                [4,5,0],
                [3,4,4],
                [8,8,0]
        ]


        result = findMinCost(5,3,costMat)
        print(result)

        costMat1 = [
                [1,2],
                [2,1],
                [3,4]                
        ]

        result = findMinCost(3,2,costMat1)

        print(result)