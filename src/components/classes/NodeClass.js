import ArrowClass from "./ArrowClass";

class NodeClass{
    constructor(id,height,width,x,y,bgc){
        //required parameters
        this.id = id;
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y
        this.bgc = bgc;
        //Initialized node points to self with probability 1
        this.arrows = [];
        this.setArrows([[this,1.0]]);
    }
    setArrows(list){
        //needs to be an object with elements that are other NodeClasses and sum to 1
        let sum = 0;
        let newList = []
        for(let i=0; i<list.length; i++){
            if(typeof(list[i][0]) !== "object"){
                throw TypeError("Passed in non-object")
            }
            newList.push(new ArrowClass(i,this,list[i][0],list[i][1]))
            sum += list[i][1]
        }
        if(sum !== 1.0){throw Error("Probabilities don't sum to 1")}
        this.arrows = newList
    }
    addArrow(arrow){
        this.arrows.push(arrow)
    }
    
}
export default NodeClass