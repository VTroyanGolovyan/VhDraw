function Scale(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;

  this.startX = 0;
  this.startY = 0;
  this.startvX = 0;
  this.startvY = 0;
  this.mx = 0;
  this.my = 0;
  this.corner = {
    leftTop : false,
    leftBottom : false,
    rightTop : false,
    rightBottom : false
  }
  this.render = function(ctx){
     if (this.active){
       var dx = this.viewx - this.startvX;
       var dy = this.viewy - this.startvY;
       var l = this.state.paper.getLayer(this.state.activeLayer);
       if (this.corner.rightBottom){ //нижний правый угол
           this.renderLayer(ctx,this.startvX-l.width*state.area.scale, this.startvY-l.height*state.area.scale, this.viewx,this.viewy);
       }
       if (this.corner.leftBottom){ //нижний левый угол
           this.renderLayer(ctx,this.viewx,this.startvY-l.height*state.area.scale,this.startvX+l.width*state.area.scale,this.viewy );
       }
       if (this.corner.rightTop){ //верхний правый угол
           this.renderLayer(ctx,this.startvX-l.width*state.area.scale,this.viewy, this.viewx,this.startvY +l.height*state.area.scale);
       }
       if (this.corner.leftTop){ //верхний левый угол
           this.renderLayer(ctx,this.viewx, this.viewy,this.startvX+l.width*state.area.scale,this.startvY+l.height*state.area.scale);
       }

     }
  }
  this.lastUpdate = new Date().getTime();
  this.f = false;
  this.renderLayer = function(ctx,x,y,x1,y1){
    var l = this.state.paper.getLayer(this.state.activeLayer);
    ctx.drawImage(l.getView(),0,0,l.width,l.height,x, y, x1-x, y1-y);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'orange';
    ctx.setLineDash([1, 0]);
    ctx.strokeRect(x,y,x1 - x, y1 - y);
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
    ctx.strokeRect(x,y,x1 - x, y1 - y);
    ctx.setLineDash([1, 0]);

    this.ellips(ctx,x,y);
    this.ellips(ctx,x1,y);
    this.ellips(ctx,x1,y1);
    this.ellips(ctx,x,y1);
  }
  this.ellips = function(ctx,x,y){
     ctx.fillStyle = '#323232';
     ctx.beginPath();
     ctx.ellipse(x,y, Math.floor(20), Math.floor(20),0,0,2 * Math.PI);
     ctx.fill();
     ctx.strokeStyle = 'red';
     ctx.ellipse(x,y, Math.floor(19), Math.floor(19),0,0,2 * Math.PI);
     ctx.stroke();
  }
  this.x1 = 0;
  this.y1 = 0;
  this.onmousedown  = function(coords){

     this.startX = coords.x;
     this.startY = coords.y;
     this.startvX = coords.viewx;
     this.startvY = coords.viewy;
     this.viewx = coords.viewx;
     this.viewy = coords.viewy;
     this.x1 = coords.viewx;
     this.y1 = coords.viewy;
     var l = this.state.paper.getLayer(this.state.activeLayer);


           if (this.inCircle(l.x+l.width,l.y+l.height,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //нижний правый угол
             this.active = true;
             this.state.view.style.cursor = "move";
             this.corner = {
               leftTop : false,
               leftBottom : false,
               rightTop : false,
               rightBottom : true
             }
             this.startvX = this.toViewX(l.x+l.width);
             this.startvY = this.toViewY(l.y+l.height);
             this.viewx = this.toViewX(l.x+l.width);
             this.viewy = this.toViewY(l.y+l.height);
           }
           if (this.inCircle(l.x,l.y+l.height,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //нижний левый угол
             this.active = true;
             this.state.view.style.cursor = "move";
             this.corner = {
               leftTop : false,
               leftBottom : true,
               rightTop : false,
               rightBottom : false
             }
             this.startvX = this.toViewX(l.x);
             this.startvY = this.toViewY(l.y+l.height);
             this.viewx = this.toViewX(l.x);
             this.viewy = this.toViewY(l.y+l.height);
           }
           if (this.inCircle(l.x+l.width,l.y,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //верхний правый угол
             this.active = true;
             this.state.view.style.cursor = "move";
             this.corner = {
               leftTop : false,
               leftBottom : false,
               rightTop : true,
               rightBottom : false
             }
             this.startvX = this.toViewX(l.x+l.width);
             this.startvY = this.toViewY(l.y);
             this.viewx = this.toViewX(l.x+l.width);
             this.viewy = this.toViewY(l.y);
           }
           if (this.inCircle(l.x,l.y,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //верхний левый угол
             this.active = true;
             this.state.view.style.cursor = "move";
             this.corner = {
               leftTop : true,
               leftBottom : false,
               rightTop : false,
               rightBottom : false
             }
             this.startvX = this.toViewX(l.x);
             this.startvY = this.toViewY(l.y);
             this.viewx = this.toViewX(l.x);
             this.viewy = this.toViewY(l.y);
          }

  }
  this.inCircle = function(x,y,r,x1,y1){
    if (Math.sqrt(Math.pow(x-x1,2)+Math.pow(y-y1,2)) <= r)
      return true;
    else return false;
  }
  this.toViewX = function(docx){
     //Math.floor( (x/draw.state.area.scale + draw.state.area.x))
    // alert(Math.floor((docx - state.area.x)*state.area.scale))
     return Math.floor((docx - state.area.x)*state.area.scale)
  }
  this.toViewY = function(docy){
     return Math.floor((docy - state.area.y)*state.area.scale)
  }
  this.onmousemove  = function(coords){
     if (this.active){
       var l = this.state.paper.getLayer(this.state.activeLayer);

       if (this.corner.rightBottom){ //нижний правый угол
         this.viewx = coords.viewx-this.x1+this.toViewX(l.x+l.width);
         this.viewy = coords.viewy-this.y1+this.toViewY(l.y+l.height);
       }
       if (this.corner.leftBottom){ //нижний левый угол
         this.viewx = coords.viewx-this.x1+this.toViewX(l.x);
         this.viewy = coords.viewy-this.y1+this.toViewY(l.y+l.height);
       }
       if (this.corner.rightTop){ //верхний правый угол
         this.viewx = coords.viewx-this.x1+this.toViewX(l.x+l.width);
         this.viewy = coords.viewy-this.y1+this.toViewY(l.y);
       }
       if (this.corner.leftTop){ //верхний левый угол
         this.viewx = coords.viewx-this.x1+this.toViewX(l.x);
         this.viewy = coords.viewy-this.y1+this.toViewY(l.y);
       }
     }else{
       var l = this.state.paper.getLayer(this.state.activeLayer);

       if (this.inCircle(l.x+l.width,l.y+l.height,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //нижний правый угол
         this.state.view.style.cursor = "pointer";
       } else if (this.inCircle(l.x,l.y+l.height,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //нижний левый угол
         this.state.view.style.cursor = "pointer";
       } else if (this.inCircle(l.x+l.width,l.y,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //верхний правый угол
         this.state.view.style.cursor = "pointer";
       } else if (this.inCircle(l.x,l.y,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //верхний левый угол
         this.state.view.style.cursor = "pointer";
       }else this.state.view.style.cursor = "default";
     }
  }
  this.onmouseup  = function(coords){
    if (this.active){
      this.active = false;
      this.state.view.style.cursor = "default";
      var l = this.state.paper.getLayer(this.state.activeLayer);
     // if (l.x <= coords.docx && l.x+l.width >= coords.docx &&
     //     l.y <= coords.docy && l.y+l.height >= coords.docy){
      var dx = coords.x - this.startX;
      var dy = coords.y - this.startY;

        if (this.corner.rightBottom){ //нижний правый угол
           l.scale(l.width + dx,l.height + dy);
        }
        if (this.corner.leftBottom){ //нижний левый угол
           l.scale(l.width - dx,l.height + dy);
           l.move(dx,0);
        }
        if (this.corner.rightTop){ //верхний правый угол
           l.scale(l.width + dx,l.height - dy);
           l.move(0,dy);
        }
        if (this.corner.leftTop){ //верхний левый угол
           l.scale(l.width - dx,l.height - dy);
           l.move(dx,dy);
        }
       this.state.paper.save();
    }
  }
  this.onmouseout = function(){
     this.active = false;
     this.state.view.style.cursor = "default";
  }
}
