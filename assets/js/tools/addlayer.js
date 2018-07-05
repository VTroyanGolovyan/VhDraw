function AddLayer(state, ctx){
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
       ctx.strokeStyle = state.mainColor;
       ctx.lineWidth = 1;
       ctx.strokeRect(this.startvX,this.startvY,this.x - this.startvX, this.y - this.startvY);
    }
  }
  this.onmousedown  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = true;
     this.startX = coords.docx;
     this.startY = coords.docy;
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
     var x,y,width,height;
     if (coords.docx > this.startX){
       x = this.startX;
       width = coords.docx - this.startX;
     }else{
       x = coords.docx;
       width = this.startX -  coords.docx;
     }
     if (coords.docy > this.startY){
       y = this.startY;
       height = coords.docy - this.startY;
     }else{
       y = coords.docy;
       height = this.startY -  coords.docy;
     }
     if(width > 0 && height > 0)
       this.state.paper.addLayer(x,y,width,height);
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
