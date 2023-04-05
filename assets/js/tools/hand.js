function Hand(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;

  this.startX = 0;
  this.startY = 0;

  this.render = function(ctx){

  }
  this.onmousedown  = function(coords){
      if ((state.paper.width*state.area.scale > state.view.width) ||
          (state.paper.height*state.area.scale > state.view.height)){
            this.active = true;
            this.startX = coords.x;
            this.startY = coords.y;
            this.state.view.style.cursor = "move";
       }
  }
  this.onmousemove  = function(coords){
     if (this.active){
       if (state.paper.width*state.area.scale > state.view.width){
            this.state.area.x -= (coords.x - this.startX)/8;
       }
       if (state.paper.height*state.area.scale > state.view.height){
            this.state.area.y -= (coords.y - this.startY)/8;
       }
     }
  }
  this.onmouseup  = function(coords){
     this.active = false;
     this.state.view.style.cursor = "default";
  }
  this.onmouseout = function(){
     this.active = false;
     this.state.view.style.cursor = "default";
  }
}
