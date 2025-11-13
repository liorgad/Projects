def cons(a, b):
    def pair(f):
        return f(a, b)
    return pair


def car(pair):    
    return pair(min)


def cdr(pair):
    return pair(max)


print(cdr(cons(3,4)))