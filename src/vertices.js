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
        this.end = this.begin + 200;
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
        let space = (this.width - 200) >> 1;
        this.begin = this.left - space;
        this.end = this.left + 200 + space;
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
        let len = this.children.length;
        //TODO 常量定义 node宽度200，间距20
        // this.width =  len * 200 + (len - 1) * 20;
        this.width = this.children.reduce((accu,current) => accu + current.width + 20,0) - 20;
        let space = (this.width - 200) >> 1;
        this.begin = this.left - space;
        this.end = this.left + 200 + space;
    }
}

export default Vertices;