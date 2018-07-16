function FillEllips(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;
  this.startX = 0;
  this.startY = 0;
  this.startvX = 0;
  this.startvY = 0;
  this.x = 0;
  this.y = 0;
  this.shiftDraw = function(ctx,x1,y1,x2,y2){
    if (Math.abs(x1 - x2) > Math.abs(y1 - y2)){
      ctx.beginPath();
      ctx.ellipse(x1,y1, Math.abs(x1 - x2), Math.abs(x1 - x2),0,0,2 * Math.PI);
      ctx.fill();
    }else{
       ctx.beginPath();
       ctx.ellipse(x1,y1, Math.abs(y1 - y2), Math.abs(y1 - y2),0,0,2 * Math.PI);
       ctx.fill();
    }
  }
  this.render = function(ctx){
    if (this.active){
       ctx.lineWidth = state.lineWidth*state.area.scale;
       ctx.fillStyle = state.mainColor;
       if (this.state.hotkeys.shift){
         this.shiftDraw(ctx,this.startvX, this.startvY,this.x,this.y);
       }else{
         ctx.beginPath();
         ctx.ellipse(this.startvX,this.startvY, Math.abs(this.x - this.startvX), Math.abs(this.y - this.startvY),0,0,2 * Math.PI);
         ctx.fill();
       }
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
     this.ctx.fillStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = false;

     if (this.state.hotkeys.shift){
       this.shiftDraw(this.ctx,this.startX,this.startY,coords.x,coords.y);
     }else{
       ctx.beginPath();
       ctx.ellipse(this.startX,this.startY, Math.abs(coords.x - this.startX), Math.abs(coords.y - this.startY),0,0,2 * Math.PI);
       ctx.fill();
     }
     this.state.paper.save("Закрашенный эллипс");
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
