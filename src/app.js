import Tree from './tree.js';

let addBtn = document.getElementById('add-btn');
let delBtn = document.getElementById('del-btn');
let oCanvas = document.getElementById('canvas');

let tree = new Tree(oCanvas);

addBtn.addEventListener('click',function(){
    tree.addVertices();
},false);

delBtn.addEventListener('click',function(){

},false);