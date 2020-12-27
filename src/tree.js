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

    addRoot(){
        let newVertices;
        newVertices = this.verticesMap[this.verticesId] = new Vertices({
            id: this.verticesId++,
            parent: null,
            width: VERTICES_WIDTH,
            fromEdge: null,
            index: 0,
            left: (this.container.offsetWidth - VERTICES_WIDTH) >> 1,
            top: 20 //这个可以定义个常量，也可以作为Tree的参数传入
        });
        this.current = newVertices;
        newVertices.ele.classList.add('active');
        this.container.appendChild(newVertices.ele);
    }

    addVertices(){
        let newVertices,newEdge = null,parent = this.current && this.verticesMap[this.current.id];
        if(!parent){
            this.addRoot();
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
        // parent.children.length > 1 && this.relayout(this.current);
        parent.children.length > 1 && this.layoutParent(this.current);
    }

    /**
    * 简化思路 
    * 1.奇数个点 以中间为基准算两边
    * 2.偶数个点 以中间2个元素为基准两边扩散 
    * 为了全部移动，不能使用setPosition方法，每次计算left的差值，调用move方法
    */
    layoutCurrent(node){
        let len = node.children.length;
        if(len == 1) return;
        
        let mid = len >> 1;
        this.layoutMiddle(node,mid);
        this.layoutLeft(node,len & 1 ? mid - 1 : mid - 2);
        this.layoutRight(node,mid + 1,true);
    }

    layoutLeft(node,l){
        while(l >= 0){
            let child = node.children[l];
            let base = node.children[l + 1];
            // let oLeft = child.left;
            // let left = base.begin - child.width + (child.width - VERTICES_WIDTH) / 2 - VERTICES_PADDING;
            // let distance = -Math.abs(oLeft - left);
            let distance = -Math.abs(base.begin - VERTICES_PADDING - child.end);
            let left = child.left + distance;
            child.move(distance);
            node.edges[l].update(node.edges[l].ele,Math.abs(node.left - left),EDGE_HEIGHT,'l').setPosition(left + VERTICES_WIDTH / 2);
            l--;
        }
    }

    layoutMiddle(node,mid){
        //TODO 代码还可以优化一下写法
        let len = node.children.length;
        let parentLeft = node.left;
        let center = parentLeft + VERTICES_WIDTH / 2;
        //奇数的情况，正下方
        if(len & 1){
            let child = node.children[mid];
            let oLeft = child.left; //原来的left位置
            let left = center - VERTICES_WIDTH / 2; //新的left位置
            let distance = -Math.abs(oLeft - left);
            child.move(distance);
            node.edges[mid].update(node.edges[mid].ele,EDGE_WIDTH,EDGE_HEIGHT,'v').setPosition(center - EDGE_WIDTH / 2);
        }else{
            //左边
            let child = node.children[mid - 1];
            let oLeft = child.left;
            let left = center - VERTICES_PADDING / 2 - child.width + (child.width - VERTICES_WIDTH) / 2;
            let distance = -Math.abs(oLeft - left);
            child.move(distance);
            node.edges[mid - 1].update(node.edges[mid - 1].ele,Math.abs(left - parentLeft),EDGE_HEIGHT,'l').setPosition(left + VERTICES_WIDTH / 2);
            //右边
            child = node.children[mid];
            oLeft = child.left;
            left = center + VERTICES_PADDING / 2 + (child.width - VERTICES_WIDTH) / 2;
            distance = -Math.abs(oLeft - left);
            child.move(distance);
            node.edges[mid].update(node.edges[mid].ele,Math.abs(left - parentLeft),EDGE_HEIGHT,'r').setPosition(center);
        }
    }

    /**
     * @param {isAdd} 新增一个节点时全部左移，正常布局时右移
     */
    layoutRight(node,r,isAdd){
        let len = node.children.length;
        let center = node.left + VERTICES_WIDTH / 2;
        while(r < len){
            let child = node.children[r];
            let base = node.children[r - 1];
            let oLeft = parseInt(child.ele.style.left);
            let left = base.end + VERTICES_PADDING + (child.width - VERTICES_WIDTH) / 2;
            let distance = Math.abs(oLeft - left) * (isAdd ? - 1 : 1);
            child.move(distance);
            node.edges[r].update(node.edges[r].ele,Math.abs(node.left - left),EDGE_HEIGHT,'r').setPosition(center);
            r++;
        }
    }

    layoutParent(node){
        let parent = node.parent;
        if(!parent) return;
        var len = node.parent.children.length;
        var mid = len >> 1;
        var index = node.index;
        console.log(`node ${node.id},begin ${node.begin} -- end ${node.end}`);
        if(index < mid){
            let end = node.end;
            node.updateWidth();
            let newEnd = node.children[node.children.length - 1].end;
            let newLeft = node.left + end - newEnd;
            node.move(end - newEnd);
            parent.edges[index].update(parent.edges[index].ele,Math.abs(parent.left - newLeft),EDGE_HEIGHT,'l').setPosition(newLeft + VERTICES_WIDTH / 2);
            this.layoutLeft(parent,index - 1);
        }else{
            if(len & 1 && index == mid){
                node.updateWidth();
                // node.begin = node.children[0].begin;
                // node.end = node.children[node.children.length - 1].end;
                this.layoutLeft(parent,index - 1);
                this.layoutRight(parent,index + 1);
            }else{
                let begin = node.begin;
                node.updateWidth();
                let newBegin = node.children[0].begin;
                // let newLeft = begin - newBegin;
                node.move(begin - newBegin);
                parent.edges[index].update(parent.edges[index].ele,parent.edges[index].ele.getAttribute('width') * 1 + Math.abs(begin - newBegin),EDGE_HEIGHT,'r').setPosition(parent.left + VERTICES_WIDTH / 2);
                this.layoutRight(parent,index + 1);
            }
        }
        console.log(`node ${node.id},begin ${node.begin} -- end ${node.end}`);
        this.layoutParent(parent);
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