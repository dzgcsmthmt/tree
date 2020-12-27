import {VERTICES_WIDTH,VERTICES_PADDING} from './const.js';
class Vertices{
    constructor(option){
        this.id = option.id;
        this.content = option.content || `node${option.id}`;
        this.parent = option.parent;
        this.width = option.width;
        this.children = [];
        this.edges = [];
        this.fromEdge = option.fromEdge;
        this.index = option.index;
        this.ele = this.createEle(option.id);
        this.top = option.top;
        this.left = this.begin = option.left;
        this.end = this.begin + VERTICES_WIDTH;
        this.setPosition();
    }

    createEle(id){
        let oDiv = document.createElement('div');
        oDiv.className = 'vertice';
        oDiv.innerHTML = this.content;
        oDiv.dataset.id = id;
        

        //drag
        oDiv.onmousedown = (ev) => {
            let x = ev.pageX;
            let y = ev.pageY;
            // let left = new WebKitCSSMatrix(oDiv.style.transform).m41;
            // let top = new WebKitCSSMatrix(oDiv.style.transform).m42;
            // let left = parseInt(oDiv.style.left);
            // let top = parseInt(oDiv.style.top);
            document.onmousemove = (ev) => {
                let newX = ev.pageX;
                let newY = ev.pageY;
                // oDiv.style.transform = `translate(${left + newX - x}px,${top + newY - y}px)`; 
                this.move(newX - x,newY - y);
                x = newX;
                y = newY;
            }
            document.onmouseup = (ev) => {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }

        return oDiv;
    }

    setPosition(){
        this.ele.style.left = this.left + 'px';
        this.ele.style.top = this.top + 'px';
    }

    move(distance,top){
        this.left += distance;
        this.begin += distance;
        this.end += distance;
        // let space = (this.width - VERTICES_WIDTH) >> 1;
        // this.begin = this.left - space;
        // this.end = this.left + VERTICES_WIDTH + space;
        this.ele.style.left = this.left + 'px';
        if(top){
            this.top += top;
            this.ele.style.top = this.top + 'px';
        }
        this.edges.forEach(edge => {
            edge.move(distance,top);
        })
        this.children.forEach(child => {
            child.move(distance,top);
        });
        return this;
    }

    updateWidth(){
        this.width = this.children.reduce((accu,current) => accu + current.width + VERTICES_PADDING,0) - VERTICES_PADDING;
        this.begin = this.children[0].begin;
        this.end = this.children[this.children.length - 1].end;
        return this;
    }

    setBoundary(begin,end,isCal){
        if(isCal){
            this.begin += begin;
            this.end += end;
        }else{
            this.begin = begin;
            this.end = end;
        }
        return this;
    }
}

export default Vertices;