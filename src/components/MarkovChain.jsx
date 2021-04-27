import React, {Component} from "react";
import ReactDOM from 'react-dom'
import ArrowClass from "./classes/ArrowClass.js";
import Node from "./classes/Node.jsx"
import NodeClass from "./classes/NodeClass.js"

export default class MarkovChain extends Component {
    constructor(props){
        super(props);
        this.state = {
            nodes: 0,
            chain: [],
            selected: null,
            selectedType: null,
            renderProbabilities: false,
            selectCurrent: false,
            walk: null,
            mouseDown: null,
            x: 0,
            y: 0
        }
        this.handleNodeChange = this.handleNodeChange.bind(this);
    }
    componentDidMount(){
        ReactDOM.findDOMNode(this).addEventListener("mousedown",() => {this.setState({mouseDown: true})});
        ReactDOM.findDOMNode(this).addEventListener("mousemove",(e) => {this.handleMove(e)});
        ReactDOM.findDOMNode(this).addEventListener("mouseup",() => {this.setState({mouseDown: false})});
    }
    handleMove(e){
        this.setState({x: e.clientX, y: e.clientY})
        if(this.state.selectedType === "node" && this.state.mouseDown){
            const {selected,x,y} = this.state
            //if mouse is within the node div
            selected.x = x
            selected.y = y
            this.setState({selected: selected})
            
        }
    }
    handleNodeChange(event){
        let newNodes = event.target.value;
        let newChain = []
        for(let i=0; i<newNodes; i++){
            var node = new NodeClass(i,100,100,200,200,"#000000");
            newChain.push(node)
        }
        for(let i=0; i<newChain.length;i++){
            newChain[i].setArrows([[newChain[0],1.0]])
        }

        if(newNodes >= 2){
            for(let i=1;i<newNodes;i++){
                newChain[i].setArrows([[newChain[0],1.0]]);
            }
        }
        this.setState({nodes: newNodes, chain: newChain});
    }
    setSelectedNode(item){
        const {selected, renderProbabilities, selectCurrent} = this.state
        if(renderProbabilities){
            //first check if selected's arrows sum to 1
            let sumProbs = 0
            for(let i=0; i<selected.arrows.length; i++){
                sumProbs += selected.arrows[i].prob
            }

            //loop through and delete all lines with prob 0
            let newArrows = []
            let curId = 0
            for(let i=0; i<selected.arrows.length; i++){
                if(selected.arrows[i].prob !== 0){
                    newArrows.push(new ArrowClass(curId, selected.arrows[i].node, selected.arrows[i].pointer, selected.arrows[i].prob))
                    curId += 1
                }
            }
            selected.arrows = newArrows
            if(sumProbs === 1){
                this.setState({selected: item, renderProbabilities: false , selectedType: "node"});
            }
        }
        else if(selectCurrent){
            let walkThing = randomWalk(20, item)
            this.setState({walk: walkThing, selectCurrent: false})
        }
        else{
            this.setState({selected: item, selectedType: "node"});
        }
    }  
    handleProbChange(item,e){
        const newProb = e.target.value;
        let {selected} = this.state;
        let arrows = [...this.state.selected.arrows];
        for(let i=0;i<arrows.length;i++){
            if(arrows[i]===item){
                arrows[i].prob = newProb
            }
        }
        selected.arrows = arrows
        this.setState({selected: selected})
    }

    addNodeToSelected(item){
        const {selected} = this.state
        var newArrow = new ArrowClass(selected.arrows.length, selected, item, 0)
        selected.addArrow(newArrow)
        this.setState({selected: selected})
    }
    renderAddButtons(){
        const {chain, selected, renderProbabilities} = this.state
        if(selected !== null && renderProbabilities){
            return(
                <React.Fragment>
                    {chain.map(item => {
                        let itemInSelectedArrows = false
                        for(let i=0; i<selected.arrows.length;i++){
                            if(selected.arrows[i].pointer === item){
                                itemInSelectedArrows = true
                                break
                            }
                        }
                        if(!itemInSelectedArrows){
                            return(
                                <button style={{position:"absolute", opacity: 0.5, background: "#B4EEB4", top: item.y+item.height/2, left: item.x, transform: `translate(${-50}%, ${100}%)`,}}
                                        onClick={() => this.addNodeToSelected(item)}>+</button>
                            );
                        }
                    })}
                </React.Fragment>
            );
        }
    }
    renderChangeProbabilitiesButton(){
        if(this.state.selected !== null){
            return (
                <React.Fragment>
                    <button onClick={()=>{
                        const {renderProbabilities} = this.state;
                        if(renderProbabilities){
                            let sum=0;
                            for(let i=0;i<this.state.selected.arrows.length;i++){
                                sum += this.state.selected.arrows[i].prob;
                            }
                            if(sum === 1.0){
                                this.setState({renderProbabilities: !renderProbabilities})
                            }else{
                                this.setState({renderProbabilities: renderProbabilities})
                            }
                            
                        }else{
                            this.setState({renderProbabilities: !renderProbabilities})
                        }
                        }}>Change Probabilities</button>
                </React.Fragment>
            );
        }
    }
    renderLines() {
        return (
            this.state.chain.map(item => {
                return (
                    item.arrows.map(elem => {
                        return(
                            <div style={{position: "absolute"}}>
                                <svg style={{position: "absolute"}} width={5000} height={2500}>
                                    <line x1={elem.node.x} y1={elem.node.y} x2={elem.pointer.x} y2={elem.pointer.y} stroke="black"/>
                                </svg>
                            </div>
                        );
                    })
                );
            })
        );
    }
    renderProbabilities(){
        if(this.state.selected !== null){
            if(this.state.renderProbabilities){
                return(
                    <React.Fragment>
                        {this.state.selected.arrows.map(item =>{
                            if(item.pointer !== this.state.selected){
                                return (
                                <div style={{
                                    position: "absolute",
                                    width: 0,
                                    height: 0,
                                    left: ((item.pointer.x-item.node.x)/2)+item.node.x, 
                                    top: ((item.pointer.y-item.node.y)/2)+item.node.y,
                                    transform: `translate(${-50}%, ${-50}%)`,
                                    background: "#000000",
                                }}><input style={{
                                    width: 10,
                                    height: 10,}} value={item.prob} onChange={(e) => this.handleProbChange(item,e)} /></div>
                                    );
                                }
                            else{
                                return (
                                    <div style={{
                                        position: "absolute",
                                        width: 10,
                                        height: 10,
                                        left: ((item.pointer.x-item.node.x)/2)+item.node.x, 
                                        top: ((item.pointer.y-item.node.y)/2)+item.node.y,
                                        transform: `translate(${-50}%, ${-50}%)`,
                                        background: "#000000",
                                    }}><input style={{
                                        width: 10,
                                        height: 10,}} value={item.prob} onChange={(e) => this.handleProbChange(item,e)} /></div>
                                        );
                            }
                            }
                        )
                        }
                    </React.Fragment>
                );}
            return(
                <React.Fragment>
                    {this.state.selected.arrows.map(item =>{
                        if(item.pointer !== this.state.selected){
                            return (
                                <div style={{
                                    position: "absolute",
                                    width: 0,
                                    height: 0,
                                    left: ((item.pointer.x-item.node.x)/2)+item.node.x, 
                                    top: ((item.pointer.y-item.node.y)/2)+item.node.y,
                                    transform: `translate(${-50}%, ${-50}%)`,
                                    background: "#000000",
                                }} value={item.prob}>{item.prob}</div>
                            );
                        }else{
                            return (
                                <div style={{
                                    position: "absolute",
                                    width: 10,
                                    height: 20,
                                    left: ((item.pointer.x-item.node.x)/2)+item.node.x, 
                                    top: ((item.pointer.y-item.node.y)/2)+item.node.y,
                                    transform: `translate(${-50}%, ${-50}%)`,
                                }} value={item.prob}>{item.prob}</div>
                            );
                        }
                        
                    }
                    )}
                </React.Fragment>
            );
        }
    }
    renderNodes() {
        return (
            this.state.chain.map(item=>{
                return (
                    <React.Fragment>
                        <div onClick={() => this.setSelectedNode(item)} style={{position: "absolute"}}>
                            <h1 style={{position: "relative", top: item.y, left: item.x, transform: `translate(${-50}%, ${-50}%)`}}>{item.id}</h1>
                            <Node key={item.id} position={"absolute"} x={item.x} y={item.y} width={item.width} height={item.height} bgc={item.bgc}/>
                            
                        </div>
                    </React.Fragment>
                );
            })
        );
    }
    renderMarkovButton(){
        return(
            <button onClick={() => this.setState({selectCurrent: true, renderProbabilities: false})}>Run Markov</button>
        );
    }

    renderWalk(){
        if(this.state.walk !== null){
            return(
                <React.Fragment>
                    <h1 style={{position: "relative", left: 1000}}>Path</h1>
                    {this.state.walk.map(item => {
                        return(
                            <React.Fragment>
                                <h2 style={{position: "relative", left: 1000}}>{item.id}</h2>
                            </React.Fragment>
                        );
                    })}
                </React.Fragment>
            );
        }    
    }
    
    renderSetWalkToNull(){
        if(this.state.walk !== null){
            return (
                <React.Fragment>
                    <button onClick={() => this.setState({walk: null})}>Again</button>
                </React.Fragment>
            );
        }
    }
    render(){
        return(
            <div>
                <input type="number" value={this.state.nodes} onChange={this.handleNodeChange} />
                {this.renderChangeProbabilitiesButton()}
                
                {/*Lines*/}
                {this.renderLines()}

                {/*Lines*/}
                {this.renderNodes()}
                {this.renderAddButtons()}

                {/*Probabilities*/}
                {this.renderProbabilities()}

                {/*Random Walk*/}
                {this.renderMarkovButton()}
                {this.renderSetWalkToNull()}
                {this.renderWalk()}
            </div>
        );
        
    }
}
function randomWalk(n, currentNode){
    //returns a list of size n+1, representing the path that the currentNode takes over n steps through the chain
    let walk = [currentNode]
    for(let i=0; i<n;i++){
        
        currentNode = nextNode(currentNode.arrows)
        walk.push(currentNode)
    }
    return walk
}

//takes in a list of arrows, outputs next Node pointer
function nextNode(arrows){
    let events = [0]
    let sum = 0
    for(let i=0; i<arrows.length;i++){
        sum += arrows[i].prob
        events.push(sum)
    }
    let randomNumber = Math.random()
    for(let i=1; i<events.length;i++){
        let index = i-1
        if(randomNumber>=events[index] && randomNumber<events[i]){
            return arrows[index].pointer
        }else if(i===events.length-1 && randomNumber===events[i]){
            return arrows[index].pointer
        }
    }
}