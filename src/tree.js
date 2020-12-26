import Vertices from './vertices.js';
import Edge from './edge.js';
import {VERTICES_WIDTH,VERTICES_HEIGHT,VERTICES_PADDING,EDGE_WIDTH,EDGE_HEIGHT} from './const.js';

class Tree{
    
    constructor(container){
        this.container = container;
        this.verticesMap = {};
        this.edgesMap = {}
        this.verticesId = 1;
        this.edgeId = 1;
        this.current = null;
        this.bindEvent();
    }

    addVertices(){
        let newVertices,newEdge = null,parent = this.current && this.verticesMap[this.current.id];
        if(!parent){
            newVertices = this.verticesMap[this.verticesId] = new Vertices({
                id: this.verticesId++,
                parent: parent || null,
                width: VERTICES_WIDTH,
                fromEdge: newEdge,
                index: 0,
                left: (this.container.offsetWidth - VERTICES_WIDTH) >> 1,
                top: 20
            });
            this.current = newVertices;
            newVertices.ele.classList.add('active');
            this.container.appendChild(newVertices.ele);
            return;
        }

        
        let len = parent.children.length;
        newEdge = this.edgesMap[this.edgeId] = new Edge(parent,this.edgeId++,EDGE_WIDTH,EDGE_HEIGHT,'v',parent.top + VERTICES_HEIGHT,parent.left + (VERTICES_WIDTH - EDGE_WIDTH) / 2);
        this.container.appendChild(newEdge.ele);
        parent.edges.push(newEdge);

        newVertices = this.verticesMap[this.verticesId] = new Vertices({
            id: this.verticesId++,
            parent: parent || null,
            width: VERTICES_WIDTH,
            fromEdge: newEdge,
            index: len,
            left: len == 0 ? parent.left : parent.children[len - 1].end + VERTICES_PADDING,
            top: parent.top + VERTICES_HEIGHT + EDGE_HEIGHT
        });
       
        parent.children.push(newVertices);
        this.container.appendChild(newVertices.ele);
        this.layoutCurrent(this.current);
            parent.children.length > 1 && this.relayout(this.current);
    }


    layoutCurrent(node){
        let len = node.children.length;
        let mid = len >> 1;
        if(len == 1) return;
        let parentLeft = parseInt(node.ele.style.left);
        let center = parentLeft + VERTICES_WIDTH / 2;
        //这个添加还比较麻烦，比想象中复杂
        /**
         * 简化思路 
         * 1.奇数个点 以中间为基准算两边
         * 2.偶数个点 以中间2个元素为基准两边扩散 
         *  为了全部移动，不能使用setPosition方法，每次计算left的差值，调用move方法
         */

        if(len & 1){
            let index = mid;
            let l= mid - 1;
            let r = mid + 1;
            //处理中间
            let child = node.children[index];
            let oLeft = parseInt(child.ele.style.left);
            let left = center - child.width / 2;
            child.move(-Math.abs(oLeft - left));
            node.edges[index].update(node.edges[index].ele,EDGE_WIDTH,EDGE_HEIGHT,'v').setPosition(center - VERTICES_PADDING);
           
            while(l >= 0){
                let child = node.children[l];
                let base = node.children[l + 1];
                let oLeft = parseInt(child.ele.style.left);
                let left = base.begin - child.width + (child.width - VERTICES_WIDTH) / 2 - VERTICES_PADDING;
                child.move(-Math.abs(oLeft - left));
                node.edges[l].update(node.edges[l].ele,Math.abs(parentLeft - left),EDGE_HEIGHT,'l').setPosition(left + VERTICES_WIDTH / 2);
                l--;
            }
            while(r < len){
                let child = node.children[r];
                let base = node.children[r - 1];
                let oLeft = parseInt(child.ele.style.left);
                let left = base.end + VERTICES_PADDING + (child.width - VERTICES_WIDTH) / 2;
                child.move(-Math.abs(oLeft - left));
                node.edges[r].update(node.edges[r].ele,Math.abs(parentLeft - left),EDGE_HEIGHT,'r').setPosition(center);
                r++;
            }
        }else{
            let l = mid - 1;
            let r = mid;

            let child = node.children[l];
            let oLeft = parseInt(child.ele.style.left);
            let left = center - 10 - child.width + (child.width - VERTICES_WIDTH) / 2;
            child.move(-Math.abs(oLeft - left));
            node.edges[l].update(node.edges[l].ele,Math.abs(left - parentLeft),EDGE_HEIGHT,'l').setPosition(left + VERTICES_WIDTH / 2);
            l--;

            child = node.children[r];
            oLeft = parseInt(child.ele.style.left);
            left = center + 10 + (child.width - VERTICES_WIDTH) / 2;
            child.move(-Math.abs(oLeft - left));
            node.edges[r].update(node.edges[r].ele,Math.abs(left - parentLeft),EDGE_HEIGHT,'r').setPosition(center);
            r++;

            while(l >= 0){
                let child = node.children[l];
                let base = node.children[l + 1];
                let oLeft = parseInt(child.ele.style.left);
                let left = base.begin - child.width + (child.width - VERTICES_WIDTH) / 2 - VERTICES_PADDING;
                child.move((-Math.abs(oLeft - left)));
                node.edges[l].update(node.edges[l].ele,Math.abs(parentLeft - left),EDGE_HEIGHT,'l').setPosition(left + VERTICES_WIDTH / 2);
                l--;
            }
            while(r < len){
                let child = node.children[r];
                let base = node.children[r - 1];
                let oLeft = parseInt(child.ele.style.left);
                let left = base.end + VERTICES_PADDING + (child.width - VERTICES_WIDTH) / 2;
                child.move(-Math.abs(oLeft - left));
                node.edges[r].update(node.edges[r].ele,Math.abs(parentLeft - left),EDGE_HEIGHT,'r').setPosition(center);
                r++;
            }
        }

        /*for(let i = 0; i < len - 1;i++){
            node.children[i].move(-(VERTICES_WIDTH + VERTICES_PADDING) / 2);
            let edge = node.edges[i];
            let left = parseInt(node.children[i].ele.style.left);
            edge.update(edge.ele,len & 1 && i == mid ? EDGE_WIDTH :Math.abs(parentLeft - left),EDGE_HEIGHT,i < mid ? 'l' : len & 1 && i == mid ? 'v' : 'r').setPosition(i < mid ? left + VERTICES_WIDTH / 2 : (len & 1 && i == mid) ? parentLeft + EDGE_HEIGHT : parentLeft + VERTICES_WIDTH / 2);
        }
        let newNode = node.children[len - 1];
        var lastNode = node.children[len - 2];
        newNode.ele.style.left = parseInt(lastNode.ele.style.left) + lastNode.width - ((lastNode.width - VERTICES_PADDING0) / 2)  + VERTICES_PADDING + 'px';
        node.edges[len - 1].update(node.edges[len - 1].ele,parseInt(newNode.ele.style.left) - parseInt(node.ele.style.left),EDGE_HEIGHT,'r').setPosition(parseInt(node.ele.style.left) + VERTICES_WIDTH / 2);*/
    }

    relayout(node){
        //需要递归向上
        let parent = null;
        let index = node.index;
        node.updateWidth();
        if(parent = node.parent){
            let len = parent.children.length;
            let mid = len >> 1;
            //四种情况，左边，奇数中间，偶数中间，右边
            if(index < mid){
                this.handleLeft(parent,index);
            }else{
                if(len & 1 && index == mid){
                    this.handleLeft(parent,index - 1);
                    this.handleRight(parent,index + 1,len);
                }else{
                    this.handleRight(parent,index,len);
                }
                
            }
            this.relayout(parent);
        }
    }

    handleLeft(parent,index){
        for(var i = 0;i <= index;i++){
            parent.children[i].move(i == index ? -(VERTICES_WIDTH + VERTICES_PADDING) / 2 : -(VERTICES_WIDTH + VERTICES_PADDING));
            let svg = parent.children[i].fromEdge.ele;
            parent.children[i].fromEdge.update(svg,parseInt(svg.getAttribute('width')) + (i == index ? (VERTICES_WIDTH + VERTICES_PADDING) / 2 : (VERTICES_WIDTH + VERTICES_PADDING)),EDGE_HEIGHT,'l').move(i == index ? -(VERTICES_WIDTH + VERTICES_PADDING) / 2 : -(VERTICES_WIDTH + VERTICES_PADDING));
        }
    }

    handleRight(parent,index,len){
        for(var i = index;i < len;i++){
            parent.children[i].move(i == index ? (VERTICES_WIDTH + VERTICES_PADDING) / 2 : (VERTICES_WIDTH + VERTICES_PADDING));
            let svg = parent.children[i].fromEdge.ele;
            parent.children[i].fromEdge.update(svg,parseInt(svg.getAttribute('width')) + (i == index ? (VERTICES_WIDTH + VERTICES_PADDING) / 2 : (VERTICES_WIDTH + VERTICES_PADDING)),EDGE_HEIGHT,'r');
        }
    }

    handleMid(){

    }

    
    bindEvent(){
        this.container.addEventListener('click',(ev) => {
            let target = ev.target;
            if(target.classList.contains('vertice')){
                this.setCurrent(target.dataset.id);
            }
        },false);
    }

    setCurrent(id){
        this.current = this.verticesMap[id] || null;
        this.container.querySelectorAll('.vertice').forEach(ele => ele.classList.remove('active'));
        if(this.current){
            this.current.ele.classList.add('active');
        }
    }
}

export default Tree;