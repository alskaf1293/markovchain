import numpy as np

class Node:
	def __init__(self,name,arrows=[]):
		self.name = name
		self.arrows = []
		if len(arrows) > 0:
			if len(arrows[0]) != 2:
				raise Exception("Incorrect size for array arrows")
			sum = 0
			for x in arrows:
				if (type(x[0]) != Node) or (type(x[1]) not in [float,int]):
					raise Exception("Invalid type in arrows")
				sum += x[1]
			if int(sum) != 1:
				raise Exception("Arrow probabilities do not sum to 1")

		for x in arrows:
			self.arrows.append([x[0],x[1]])
	def add(self,arrow):
		if type(arrow[0]) == Node and type(arrow[1]) == float:
			self.arrows.append(arrow)
	def addList(self, list):
		if len(list) == 0:
			raise Exception("Empty list dumbass")
		for x in list:
			self.add(x)
	def changeName(self,newName):
		if type(newName) == str:
			self.name = newName
	def print(self):
		print(str(self.name))
		for x in self.arrows:
			print(str(x[0].name) + " " + str(x[1]))

class MarkovChain:
	def __init__(self, list=[]):
		for x in list:
			if type(x) != Node:
				raise Exception("Type not Node lmfao")
		self.list = list
	def add(self,node):
		if node not in self.list and type(node) == Node:
			self.list.append(node)
	def addList(self, list):
		for x in list:
			self.list.append(x)
	def print(self):
		for x in self.list:
			x.print()

def randomWalk(n,current,chain):
	#checks for correct types
	if type(current) != Node or type(chain) != MarkovChain:
		raise Exception("Type Error")

	#random walk
	dic = {}
	for x in range(1,len(chain.list)+1):
		dic[str(x)] = 0
	for _ in range(n):
		probabilities = [float(x[1]) for x in current.arrows]
		t = int(np.random.choice(np.arange(0, len(probabilities)), p=probabilities))
		current = current.arrows[t][0]
		dic[str(current.name)] += 1
		print(str(current.name))
	return dic


nodes = 20
chain = MarkovChain()

# adds nodes to the Markov Chain
chain.addList([Node(x) for x in range(1,nodes+1)])

p = 0.15
q = 0.35
r = 1 - p - q

for x in chain.list:
	x.add([x,r])
	if str(x.name)=="1":
		x.add([next((t for t in chain.list if t.name == x.name+1), None),p+q])
	elif str(x.name)==str(nodes):
		x.add([next((t for t in chain.list if t.name == x.name-1), None),p+q])
	else:	
		for y in chain.list:
			if x.name-1==y.name:
				x.add([y,q])
			if x.name+1==y.name:
				x.add([y,p])

#chain.print()
thing = randomWalk(10000,chain.list[0],chain)
print(thing)

