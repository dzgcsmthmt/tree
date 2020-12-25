import Vertices from './vertices.js';
import Edge from './edge.js';

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

    setCurrent(id){
        this.current = this.verticesMap[id] || null;
        this.container.querySelectorAll('.vertice').forEach(ele => ele.classList.remove('active'));
        if(this.current){
            this.current.ele.classList.add('active');
        }
    }

    addVertices(){
        let newVertices,newEdge = null,parent = this.current && this.verticesMap[this.current.id];
        
        if(parent){
            // let len = parent.children.length;
            newEdge = this.edgesMap[this.edgeId] = new Edge(parent,this.edgeId++,40,80,'v',parseInt(parent.ele.style.top) + 42,parseInt(parent.ele.style.left) + 80);
            this.container.appendChild(newEdge.ele);
            parent.edges.push(newEdge);
        }

        newVertices = this.verticesMap[this.verticesId] = new Vertices({
            id: this.verticesId++,
            parent: parent || null,
            width: 200,
            fromEdge: newEdge,
            index: parent && parent.children.length || 0,
        });
        
        if(!this.current){
            this.current = newVertices;
        }
        this.container.appendChild(newVertices.ele);

        if(parent){
            parent.children.push(newVertices);
            this.layoutCurrent(this.current);
            parent.children.length > 1 && this.relayout(this.current);
        }else{
            newVertices.ele.style.left = ((2000 - 200) >> 1) + 'px';
            newVertices.ele.style.top = '20px';
            newVertices.ele.classList.add('active');
        }
    }


    layoutCurrent(node){
        let len = node.children.length;
        let mid = len >> 1;
        if(len == 1) return;
        let parentLeft = parseInt(node.ele.style.left);
        let center = parentLeft + 100;
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
            node.edges[index].update(node.edges[index].ele,40,80,'v').setPosition(center - 20);
           
            while(l >= 0){
                let child = node.children[l];
                let base = node.children[l + 1];
                let oLeft = parseInt(child.ele.style.left);
                let left = parseInt(base.ele.style.left) - (base.width - 200) / 2 - child.width + (child.width - 200) / 2 + 20;
                child.move(-Math.abs(oLeft - left));
                node.edges[l].update(node.edges[l].ele,Math.abs(parentLeft - left),80,'l').setPosition(left + 100);
                l--;
            }
            while(r < len){
                let child = node.children[r];
                let base = node.children[r - 1];
                let oLeft = parseInt(child.ele.style.left);
                let left = parseInt(base.ele.style.left) + (base.width - 200) / 2 + 20 + (child.width - 200) / 2;
                child.move(Math.abs(oLeft - left));
                node.edges[r].update(node.edges[r].ele,Math.abs(parentLeft - left),80,'r').setPosition(center);
                r++;
            }
        }else{
            let l = mid - 1;
            let r = mid;

            let child = node.children[l];
            let oLeft = parseInt(child.ele.style.left);
            let left = center - 10 - child.width + (child.width - 200) / 2;
            child.move(-Math.abs(oLeft - left));
            node.edges[l].update(node.edges[l].ele,Math.abs(left - parentLeft),80,'l').setPosition(left + 100);
            l--;

            child = node.children[r];
            oLeft = parseInt(child.ele.style.left);
            left = center + 10 + (child.width - 200) / 2;
            child.move(Math.abs(oLeft - left));
            node.edges[r].update(node.edges[r].ele,Math.abs(left - parentLeft),80,'r').setPosition(center);
            r++;

            while(l >= 0){
                let child = node.children[l];
                let base = node.children[l + 1];
                let oLeft = parseInt(child.ele.style.left);
                let left = parseInt(base.ele.style.left) - (base.width - 200) / 2 - child.width + (child.width - 200) / 2 + 20;
                child.move((-Math.abs(oLeft - left)));
                node.edges[l].update(node.edges[l].ele,Math.abs(parentLeft - left),80,'l').setPosition(left + 100);
                l--;
            }
            while(r < len){
                let child = node.children[r];
                let base = node.children[r - 1];
                let oLeft = parseInt(child.ele.style.left);
                let left = parseInt(base.ele.style.left) + (base.width - 200) / 2 + 20 + (child.width - 200) / 2;
                child.move(Math.abs(oLeft - left));
                node.edges[r].update(node.edges[r].ele,Math.abs(parentLeft - left),80,'r').setPosition(center);
                r++;
            }
        }

        /*for(let i = 0; i < len - 1;i++){
            node.children[i].move(-110);
            let edge = node.edges[i];
            let left = parseInt(node.children[i].ele.style.left);
            edge.update(edge.ele,len & 1 && i == mid ? 40 :Math.abs(parentLeft - left),80,i < mid ? 'l' : len & 1 && i == mid ? 'v' : 'r').setPosition(i < mid ? left + 100 : (len & 1 && i == mid) ? parentLeft + 80 : parentLeft + 100);
        }
        let newNode = node.children[len - 1];
        var lastNode = node.children[len - 2];
        newNode.ele.style.left = parseInt(lastNode.ele.style.left) + lastNode.width - ((lastNode.width - 200) / 2)  + 20 + 'px';
        node.edges[len - 1].update(node.edges[len - 1].ele,parseInt(newNode.ele.style.left) - parseInt(node.ele.style.left),80,'r').setPosition(parseInt(node.ele.style.left) + 100);*/
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
            parent.children[i].move(i == index ? -110 : -220);
            let svg = parent.children[i].fromEdge.ele;
            parent.children[i].fromEdge.update(svg,parseInt(svg.getAttribute('width')) + (i == index ? 110 : 220),80,'l').move(i == index ? -110 : -220);
        }
    }

    handleRight(parent,index,len){
        for(var i = index;i < len;i++){
            parent.children[i].move(i == index ? 110 : 220);
            let svg = parent.children[i].fromEdge.ele;
            parent.children[i].fromEdge.update(svg,parseInt(svg.getAttribute('width')) + (i == index ? 110 : 220),80,'r');
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
}

export default Tree;