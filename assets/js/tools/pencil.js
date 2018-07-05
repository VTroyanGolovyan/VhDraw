function Pencil(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;
  this.render = function(ctx){

  }
  this.onmousedown  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = true;
     this.ctx.beginPath();
     this.ctx.moveTo(coords.x,coords.y);
     this.ctx.lineTo(coords.x,coords.y);
  }
  this.onmousemove  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     if (this.active){
       this.ctx.lineTo(coords.x,coords.y);
       this.ctx.stroke();
     }
  }
  this.onmouseup  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = false;
     this.ctx.stroke();
     this.state.paper.save();
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
