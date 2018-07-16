function Eraser(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;
  this.render = function(ctx){

  }
  this.onmousedown  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = true;
     this.ctx.clearRect(coords.x,coords.y,this.state.lineWidth,this.state.lineWidth);
  }
  this.onmousemove  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     if (this.active){
       this.ctx.clearRect(coords.x,coords.y,this.state.lineWidth,this.state.lineWidth);
     }
  }
  this.onmouseup  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = false;
     this.ctx.clearRect(coords.x,coords.y,this.state.lineWidth,this.state.lineWidth);
     this.state.paper.save("Ластик");
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
