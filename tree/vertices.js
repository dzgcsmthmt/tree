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
        /*let ele = this.ele;
        //没有根节点的情况
        if(!this.parent){
            ele.style.left = ((2000 - 200) >> 1) + 'px';
            ele.style.top = '20px';
            ele.classList.add('active');
        }else{
            let len = this.parent.children.length; 
            //添加一个节点的逻辑 所有同级的前面的节点往左移动(width + padding) / 2,自己本身的left为左侧节点 + (width + padding);
            if(len == 0){
                ele.style.left = this.parent.ele.style.left;
            }else{
                //已经有节点的情况
                this.parent.children.forEach(child => {
                    child.move(-110);
                });
                ele.style.left = parseInt(this.parent.children[len - 1].ele.style.left) + this.parent.children[len - 1].width - ((this.parent.children[len - 1].width - 200) / 2)  + 20 + 'px';
                let eLen = this.parent.edges.length; 
                this.parent.edges.forEach((edge,index) => {
                    let left = parseInt(this.parent.ele.style.left);
                    let mid = eLen >> 1;
                    if(eLen & 1){
                        //奇数的情况，中间的点在正下方，左边的每个大220，右边的每个220
                        if(index < mid){
                            edge.update(edge.ele,(mid - index) * edge.width,80,'l').setPosition(left + 100 - (mid - index) * edge.width);
                        }else if(index == mid){
                            edge.update(edge.ele,40,80,'v').setPosition(left + 80);
                        }else{
                            edge.update(edge.ele,(index - mid) * 220,80,'r').setPosition(left + 100);
                        }
                    }else{
                        if(index < mid){
                            edge.update(edge.ele,(mid - index) * 220 - 110,80,'l').setPosition(left + 100 - (mid - index) * 220 + 110);
                        }else{
                            edge.update(edge.ele,(index - mid + 1) * 220 - 110,80,'r').setPosition(left + 100);
                        }
                    }
                });

            }

            ele.style.top = parseInt(this.parent.ele.style.top) + 42 + 80 + 'px';
        }*/
        if(this.parent){
            this.ele.style.left = this.parent.ele.style.left;
            this.ele.style.top = parseInt(this.parent.ele.style.top) + 42 + 80 + 'px';
        }
    }

    move(distance,top){
        this.ele.style.left = parseInt(this.ele.style.left) + distance + 'px';
        if(top){
            this.ele.style.top = parseInt(this.ele.style.top) + top + 'px';
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
        let len = this.children.length;
        //TODO 常量定义 node宽度200，间距20
        // this.width =  len * 200 + (len - 1) * 20;
        this.width = this.children.reduce((accu,current) => accu + current.width + 20,0) - 20;
    }
}

export default Vertices;