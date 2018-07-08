function StrokeSquare(state, ctx){
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
    if (x2 - x1 > 0 && y2 - y1 > 0){
      if (x2-x1 < y2 - y1)
         ctx.strokeRect(x1,y1,y2-y1,y2-y1);
      else ctx.strokeRect(x1,y1,x2-x1,x2-x1);
    }else if (x2 - x1 > 0 && y2 - y1 < 0){
      if (x2-x1 < y1 - y2)
         ctx.strokeRect(x1,y1,y1-y2,y2-y1);
      else ctx.strokeRect(x1,y1,x2-x1,x1-x2);
    }else if (x2 - x1 < 0 && y2 - y1 > 0){
      if (x1-x2 < y2 - y1)
         ctx.strokeRect(x1,y1,y1-y2,y2-y1);
      else ctx.strokeRect(x1,y1,x2-x1,x1-x2);
    }else if (x2 - x1 < 0 && y2 - y1 < 0){
      if (x1-x2 < y1 - y2)
         ctx.strokeRect(x1,y1,y2-y1,y2-y1);
      else ctx.strokeRect(x1,y1,x2-x1,x2-x1);
    }
  }
  this.render = function(ctx){
    if (this.active){
       ctx.strokeStyle = state.mainColor;
       ctx.lineWidth = state.lineWidth*state.area.scale;
       if(this.state.hotkeys.shift){
          this.shiftDraw(ctx,this.startvX, this.startvY,this.x,this.y);
       }else ctx.strokeRect(this.startvX,this.startvY,this.x - this.startvX, this.y - this.startvY);
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
     if (this.active){
       this.x = coords.viewx;
       this.y = coords.viewy;
     }
  }
  this.onmouseup  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.active = false;
     if(this.state.hotkeys.shift){
        this.shiftDraw(this.ctx,this.startX, this.startY,coords.x,coords.y);
     }else this.ctx.strokeRect(this.startX,this.startY,coords.x - this.startX, coords.y - this.startY);
     this.state.paper.save();
  }
  this.onmouseout = function(){
     this.active = false;
  }
}

function FillSquare(state, ctx){
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
    if (x2 - x1 > 0 && y2 - y1 > 0){
      if (x2-x1 < y2 - y1)
         ctx.fillRect(x1,y1,y2-y1,y2-y1);
      else ctx.fillRect(x1,y1,x2-x1,x2-x1);
    }else if (x2 - x1 > 0 && y2 - y1 < 0){
      if (x2-x1 < y1 - y2)
         ctx.fillRect(x1,y1,y1-y2,y2-y1);
      else ctx.fillRect(x1,y1,x2-x1,x1-x2);
    }else if (x2 - x1 < 0 && y2 - y1 > 0){
      if (x1-x2 < y2 - y1)
         ctx.fillRect(x1,y1,y1-y2,y2-y1);
      else ctx.fillRect(x1,y1,x2-x1,x1-x2);
    }else if (x2 - x1 < 0 && y2 - y1 < 0){
      if (x1-x2 < y1 - y2)
         ctx.fillRect(x1,y1,y2-y1,y2-y1);
      else ctx.fillRect(x1,y1,x2-x1,x2-x1);
    }
  }
  this.render = function(ctx){
    if (this.active){
       ctx.fillStyle = state.mainColor;
       if (this.state.hotkeys.shift)
         this.shiftDraw(ctx, this.startvX, this.startvY, this.x, this.y)
       else ctx.fillRect(this.startvX,this.startvY,this.x - this.startvX, this.y - this.startvY);
    }
  }
  this.onmousedown  = function(coords){
     this.ctx.fillStyle = state.mainColor;
     this.active = true;
     this.startX = coords.x;
     this.startY = coords.y;
     this.x = coords.viewx;
     this.y = coords.viewy;
     this.startvX = coords.viewx;
     this.startvY = coords.viewy;
  }
  this.onmousemove  = function(coords){
     this.ctx.fillStyle = state.mainColor;
     if (this.active){
       this.x = coords.viewx;
       this.y = coords.viewy;
     }
  }
  this.onmouseup  = function(coords){
     this.ctx.fillStyle = state.mainColor;
     this.active = false;
     if (this.state.hotkeys.shift)
       this.shiftDraw(this.ctx, this.startX, this.startY, coords.x, coords.y)
     else this.ctx.fillRect(this.startX,this.startY,coords.x - this.startX, coords.y - this.startY);
     this.state.paper.save();
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
