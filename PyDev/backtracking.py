def get_itinerary(flights, current_itinerary):
    # If we've used up all the flights, we're done
    if not flights:
        return current_itinerary
    last_stop = current_itinerary[-1]
    for i, (origin, destination) in enumerate(flights):
        # Make a copy of flights without the current one to mark it as used
        flights_minus_current = flights[:i] + flights[i + 1:]
        current_itinerary.append(destination)
        if origin == last_stop:
            return get_itinerary(flights_minus_current, current_itinerary)
        current_itinerary.pop()
    return None


if __name__ == "__main__":
    flights = [("HNL","AKL"),("YUL","ORD"),("ORD","SFO"),("SFO","HNL")]
    result = get_itinerary(flights,["HNL"])
    print()