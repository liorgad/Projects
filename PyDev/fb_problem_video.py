def highest_population(life_span_arr):
    if(None == life_span_arr):
        return -1

    # create an array with each element is a tuple of birth/death (True/Flase) and year of B/D - ex (True,1975)
    birth_death_arr = create_bearth_death_arr(life_span_arr)

    # sort array by year
    birth_death_arr.sort(key=lambda e: e[1])

    # max population seen
    max_pop = 0

    # year of max pop seen
    max_year = -1

    # the current populatןon
    curr_pop = 0

    for bd_year in birth_death_arr:

        if(bd_year[0]):
            curr_pop = curr_pop + 1
        else:
            curr_pop = curr_pop - 1

        if(curr_pop > max_pop):
            max_pop = curr_pop
            max_year = bd_year[1]

    return max_year


def create_bearth_death_arr(life_span_arr):

    bd_arr = []

    for bd in life_span_arr:
        bd_arr.append((True, bd[0]))
        bd_arr.append((False, bd[1]))

    return bd_arr

if __name__ == "__main__":

    result = highest_population([[1975, 2015], [1815,1950],[1949,1999],[1977,2057],[1980,2080]])
    print(result)
