function Eraser(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;
  this.x = 0;
  this.y = 0;
  this.render = function(ctx){
  
  }
  function Pos(x,y){
    this.x = x;
    this.y = y;
  }
  this.pos = new Pos(0,0);
  this.onmousedown  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = true;
     this.ctx.clearRect(coords.x,coords.y,this.state.lineWidth,this.state.lineWidth);
     this.pos = new Pos(coords.x,coords.y);
  }
  this.allow = true;
  this.onmousemove  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     if (this.active && this.allow){
       var tx = this.pos.x;
       var ty = this.pos.y;
       this.pos = new Pos(coords.x,coords.y);

       this.clearLine(tx,ty,coords.x,coords.y);
       this.ctx.clearRect(coords.x,coords.y,this.state.lineWidth,this.state.lineWidth);
     }
     this.x = coords.viewx;
     this.y = coords.viewy;
  }
  this.clearLine = function(x1,y1,x2,y2){
  //    this.allow = false;
    while(x1 != x2 && y1 != y2){
      this.ctx.clearRect(x1,y1,this.state.lineWidth,this.state.lineWidth);
      if (x1 < x2)
         x1++;
      else x1--;
      if (y1 < y2)
         y1++;
      else y1--;
    }
//      this.allow = true;
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
