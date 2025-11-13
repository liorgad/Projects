import json

class Queue:

    def __init__(self):
        self.queue = list()

    def addtoq(self, dataval):
        # Insert method to add element
        if dataval not in self.queue:
            self.queue.insert(0, dataval)
            return True
        return False
# Pop method to remove element

    def removefromq(self):
        if len(self.queue) > 0:
            return self.queue.pop()
        return ("No elements in Queue!")

    def isEmpty(self):
        if len(self.queue) > 0:
            return False
        return True

f = open('./protocol.json', "r")

jsonFile = f.read()

simple_protocol = json.loads(jsonFile)
queue = Queue()
resultsList = []
firstQuestion = dict(simple_protocol).get("how_are_you")
queue.addtoq(firstQuestion)

while (queue.isEmpty() == False):
    question = queue.removefromq()
    options = list(question.get('options'))
    new_list = [str(seq.get("response")) for seq in question.get('options')]
    
    response = raw_input((question.get('text') + " (" + ",".join(new_list) + ")\n"))
    responseList = str(response).rstrip().split(",")

    for resp in responseList :
        for option in options:
            if(str(option.get("response")).lower() == resp.lower()):
                resultsList.append({str(question.get("text")):resp.lower()})
                if(option.get('next') != None):
                    for nextQ in option.get('next'):
                        queue.addtoq(simple_protocol.get(nextQ))


print(resultsList)
            
        

