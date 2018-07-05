function Line(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;
  this.startX = 0;
  this.startY = 0;
  this.startvX = 0;
  this.startvY = 0;
  this.x = 0;
  this.y = 0;
  this.render = function(ctx){
    if (this.active){
       ctx.lineWidth = state.lineWidth*state.area.scale;
       ctx.strokeStyle = state.mainColor;
       ctx.beginPath();
       ctx.moveTo(this.startvX,this.startvY);

       ctx.lineTo(this.x,this.y);

       ctx.stroke();
    }
  }
  this.onmousedown  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = true;
     this.startX = coords.x;
     this.startY = coords.y;
     this.x = coords.viewx;
     this.y = coords.viewy;
     this.startvX = coords.viewx;
     this.startvY = coords.viewy;
  }
  this.onmousemove  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     if (this.active){
       this.x = coords.viewx;
       this.y = coords.viewy;
     }
  }
  this.onmouseup  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = false;
     this.ctx.beginPath();
     this.ctx.moveTo(this.startX,this.startY);

     this.ctx.lineTo(coords.x,coords.y);

     this.ctx.stroke();
     this.state.paper.save();
  }
  this.onmouseout = function(){
     this.active = false;
  }
}