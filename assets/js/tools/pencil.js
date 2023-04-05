function Pencil(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;
  this.x = 0;
  this.y = 0;
  this.render = function(ctx){
    ctx.beginPath();
    ctx.fillStyle = state.mainColor;
    ctx.ellipse(this.x,this.y,Math.floor(state.lineWidth/2*state.area.scale), Math.floor(state.lineWidth/2*state.area.scale),0,0,2 * Math.PI);
    ctx.fill();
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
     this.x = coords.viewx;
     this.y = coords.viewy;
  }
  this.onmouseup  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = false;
     this.ctx.stroke();
     this.state.paper.save("Карандаш");
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
