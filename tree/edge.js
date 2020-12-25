class Edge{
    constructor(startVertices,id,w,h,direction,top,left){
        this.startVertices = startVertices;
        this.id = id;
        this.width = w;
        this.height = h;
        this.direction = direction;
        this.ele = this.createEle(id,w,h,direction,top,left);
    }

    createEle(id,w,h,direction,top,left){
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("fill", "none");
        svg.setAttribute("id", `edge${id}`);
        svg.style.top = top + 'px';
        svg.style.left = left + 'px';
        this.update(svg,w,h,direction);
        return svg;
    }

    update(svg,w,h,direction){
        svg.setAttribute("width", w + '');
        svg.setAttribute("height", h + '');
        if(direction == 'r'){
            svg.innerHTML = `<path d="M0 0L0 ${h / 2}L${w - 5} ${h / 2}L${w - 5} ${h}" stroke="#C5CCD0" stroke-width="2px"></path><path d="M${w - 10} ${h - 5}H${w}L${w - 5} ${h}L${w - 10} ${h - 5}Z" fill="#C5CCD0"></path>`;
        }else if(direction == 'l'){
            svg.innerHTML = `<path d="M${w} 0L${w} ${h / 2}L5 ${h / 2}L5 ${h}" stroke="#C5CCD0" stroke-width="2px"></path><path d="M0 ${h - 5}H10L5 ${h}L0 ${h - 5}Z" fill="#C5CCD0"></path>`;
        }else{
            svg.innerHTML = `<path d="M${w / 2} 0L${w / 2} ${h}" stroke="#C5CCD0" stroke-width="2px"></path><path d="M${w / 2 - 5} ${h - 5}H${w / 2 + 5}L${w / 2} ${h}L${w / 2 - 5} ${h - 5}Z" fill="#C5CCD0"></path>`;
        }
        return this;
    }

    move(distance,top){
        this.ele.style.left = parseInt(this.ele.style.left) + distance + 'px';
        if(top){
            this.ele.style.top = parseInt(this.ele.style.top) + top + 'px';
        }
        return this;
    }

    setPosition(left,top){
        this.ele.style.left = left + 'px';
        if(top){
            this.ele.style.top = top + 'px';
        }
        return this;
    }
}

export default Edge;