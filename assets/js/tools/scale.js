function Scale(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;

  this.startX = 0;
  this.startY = 0;

  this.render = function(ctx){

  }
  this.onmousedown  = function(coords){
    var l = this.state.paper.getLayer(this.state.activeLayer);
    if (l.x <= coords.docx && l.x+l.width >= coords.docx &&
        l.y <= coords.docy && l.y+l.height >= coords.docy){
     this.active = true;
     this.startX = coords.x;
     this.startY = coords.y;
     this.state.view.style.cursor = "move";
   }
  }
  this.onmousemove  = function(coords){
     if (this.active){
       var dx = (coords.x - this.startX)/8;
       var dy = (coords.y - this.startY)/8;
     }
  }
  this.onmouseup  = function(coords){
     this.active = false;
     this.state.view.style.cursor = "default";
     var l = this.state.paper.getLayer(this.state.activeLayer);
    // if (l.x <= coords.docx && l.x+l.width >= coords.docx &&
    //     l.y <= coords.docy && l.y+l.height >= coords.docy){
     var dx = coords.x - this.startX;
     var dy = coords.y - this.startY;

       if (this.startX > Math.floor(l.width/2) && this.startY > Math.floor(l.height/2)){ //нижний правый угол
          l.scale(l.width + dx,l.height + dy);
       }
       if (this.startX < Math.floor(l.width/2) && this.startY > Math.floor(l.height/2)){ //нижний левый угол
          l.scale(l.width - dx,l.height + dy);
          l.move(dx,0);
       }
       if (this.startX > Math.floor(l.width/2) && this.startY < Math.floor(l.height/2)){ //верхний правый угол
          l.scale(l.width + dx,l.height - dy);
          l.move(0,dy);
       }
       if (this.startX < Math.floor(l.width/2) && this.startY < Math.floor(l.height/2)){ //верхний левый угол
          l.scale(l.width - dx,l.height - dy);
          l.move(dx,dy);
       }
     

      this.state.paper.save();
  //  }
  }
  this.onmouseout = function(){
     this.active = false;
     this.state.view.style.cursor = "default";
  }
}
