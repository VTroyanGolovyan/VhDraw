function FillEllips(state, ctx){
  this.lastUpdate = new Date().getTime();
  this.f = true;

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
       ctx.lineWidth = 1;
       ctx.strokeStyle = 'orange';
       ctx.setLineDash([1, 0]);
       ctx.strokeRect(this.startvX,this.startvY,this.x - this.startvX, this.y - this.startvY);
       ctx.strokeStyle = 'red';

       if(new Date().getTime() - this.lastUpdate >= 250){
         this.f = !this.f;
         this.lastUpdate = new Date().getTime();
       }
       if (this.f)
          ctx.setLineDash([5, 3]);
       else {
          ctx.setLineDash([5, 6]);
       }
       ctx.strokeRect(this.startvX,this.startvY,this.x - this.startvX, this.y - this.startvY);
       ctx.setLineDash([]);
       ctx.lineWidth = state.lineWidth*state.area.scale;
       ctx.fillStyle = state.mainColor;
       var d = Math.floor(state.lineWidth/2*state.area.scale);
       ctx.beginPath();
       ctx.ellipse(Math.floor((this.x + this.startvX)/2),Math.floor((this.y+this.startvY)/2), Math.abs(Math.floor((this.x - this.startvX)/2)),  Math.abs(Math.floor((this.y - this.startvY)/2)),0,0,2 * Math.PI);
       ctx.fill();
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
     if(width > 0 && height > 0){
       this.state.toolName = "Scale";
       this.state.paper.addLayer(x,y,width,height);
       var l = this.state.paper.getLayer(this.state.activeLayer);
       l.name = 'Эллипс';
       l.miniaturaF = false;
       this.state.paper.renderLayersControllers('layers');
       var ctx = l.getCtx();
       ctx.fillStyle = state.mainColor;
       ctx.lineWidth = state.lineWidth;
       var d = Math.floor(state.lineWidth/2);
      // ctx.strokeRect(d,d,l.width-2*d,l.height-2*d);

       ctx.ellipse(Math.floor(l.width/2),Math.floor(l.height/2), Math.abs(Math.floor(l.width/2)),Math.abs(Math.floor(l.height/2)),0,0,2 * Math.PI);
       ctx.fill();
       state.paper.save("Эллипс");
     }
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
