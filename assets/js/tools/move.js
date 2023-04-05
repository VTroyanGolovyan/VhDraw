function Move(state, ctx){
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
        l.y <= coords.docy && l.y+l.height >= coords.docy && l.isDragable){
     this.active = true;
     this.startX = coords.x;
     this.startY = coords.y;
     this.state.view.style.cursor = "move";
   }
  }
  this.onmousemove  = function(coords){
     if (this.active){
       var dx = (coords.x - this.startX);
       var dy = (coords.y - this.startY);
       this.state.paper.getLayer(this.state.activeLayer).move(dx,dy);
     }
  }
  this.onmouseup  = function(coords){
     this.active = false;
     this.state.view.style.cursor = "default";
     this.state.paper.save("Cмещение");
  }
  this.onmouseout = function(){
     this.active = false;
     this.state.view.style.cursor = "default";
  }
}
