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
    rightBottom : false,
    topCenter : false,
    bottomCenter : false,
    leftCenter : false,
    rightCenter : false
  }
  this.isRender= false;
  this.render = function(ctx){
     if (this.active){
       var l = this.state.paper.getLayer(this.state.activeLayer);
       var ratio = this.startW/this.startH;
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
       if (this.corner.topCenter){ //верхний центр
         if (state.hotkeys.shift){
            var dy = this.viewy-this.startvY;
            var dx = Math.round(dy*ratio/2);
            this.renderLayer(ctx,this.startvX+dx, this.viewy,this.startvX-dx+l.width*state.area.scale,this.startvY+l.height*state.area.scale);
         }else this.renderLayer(ctx,this.startvX, this.viewy,this.startvX-dx+l.width*state.area.scale,this.startvY+l.height*state.area.scale);
       }
       if (this.corner.bottomCenter){ //нижний центр
         if (state.hotkeys.shift){
            var dy = this.viewy-this.startvY;
            var dx = Math.round(dy*ratio/2);
            this.renderLayer(ctx,this.viewx-dx,this.startvY-l.height*state.area.scale,this.startvX+dx+l.width*state.area.scale,this.viewy );
         } else this.renderLayer(ctx,this.viewx,this.startvY-l.height*state.area.scale,this.startvX+l.width*state.area.scale,this.viewy );
       }
       if (this.corner.leftCenter){ //левый центр
         if (state.hotkeys.shift){
            var dx = this.viewx-this.startvX;
            var dy = Math.round(dx/ratio/2);
            this.renderLayer(ctx,this.viewx, this.viewy+dy,this.startvX+l.width*state.area.scale,this.startvY-dy+l.height*state.area.scale);
         }else this.renderLayer(ctx,this.viewx, this.viewy,this.startvX+l.width*state.area.scale,this.startvY+l.height*state.area.scale);
       }
       if (this.corner.rightCenter){ //верхний правый угол
         if (state.hotkeys.shift){
            var dx = this.viewx-this.startvX;
            var dy = Math.round(dx/ratio/2);
            this.renderLayer(ctx,this.startvX-l.width*state.area.scale,this.viewy-dy, this.viewx,this.startvY+dy +l.height*state.area.scale);
         }else this.renderLayer(ctx,this.startvX-l.width*state.area.scale,this.viewy, this.viewx,this.startvY +l.height*state.area.scale);
       }
     }
  }
  this.lastUpdate = new Date().getTime();
  this.f = false;
  this.renderLayer = function(ctx,x,y,x1,y1){
    x = Math.round(x);
    x1 = Math.round(x1);
    y = Math.round(y);
      y1 = Math.round(y1);
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

    ctx.fillStyle = '#323232';
    if (!state.hotkeys.shift){
        this.square(ctx,x,y);
        this.square(ctx,x1,y);
        this.square(ctx,x1,y1);
        this.square(ctx,x,y1);
    }
    this.square(ctx,Math.floor((x+x1)/2),y);
    this.square(ctx,Math.floor((x+x1)/2),y1);
    this.square(ctx,x1,Math.floor((y+y1)/2));
    this.square(ctx,x,Math.floor((y+y1)/2));
  }
  this.triangle = function(ctx,x1,y1,x2,y2,x3,y3){
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x3,y3);
    ctx.lineTo(x1,y1);
    ctx.fill();

  }
  this.square = function(ctx,x,y){
    ctx.strokeStyle = 'red';
    ctx.setLineDash([]);
    ctx.strokeRect(x-Math.floor(7),y-Math.floor(7), Math.floor(14),Math.floor(14));
    ctx.strokeRect(x-Math.floor(7),y-Math.floor(7), Math.floor(14),Math.floor(14));

  }
  this.ellips = function(ctx,x,y){
     ctx.fillStyle = '#323232';
     ctx.beginPath();
     ctx.ellipse(x,y, Math.floor(15), Math.floor(15),0,0,2 * Math.PI);
     ctx.fill();
     ctx.strokeStyle = 'red';
     ctx.beginPath();
     ctx.ellipse(x,y, Math.floor(14), Math.floor(14),0,0,2 * Math.PI);
     ctx.stroke();
  }
  this.x1 = 0;
  this.y1 = 0;
  this.startW = 1;
  this.srartH = 1;
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
     this.startW = l.width;
     this.startH = l.height;

           if (!state.hotkeys.shift && this.inCircle(l.x+l.width,l.y+l.height,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //нижний правый угол
             this.active = true;
             this.isRender = true;
             this.state.view.style.cursor = "move";
             this.corner = {
               leftTop : false,
               leftBottom : false,
               rightTop : false,
               rightBottom : true,
               topCenter : false,
               bottomCenter : false,
               leftCenter : false,
               rightCenter : false
             }
             this.startvX = this.toViewX(l.x+l.width);
             this.startvY = this.toViewY(l.y+l.height);
             this.viewx = this.toViewX(l.x+l.width);
             this.viewy = this.toViewY(l.y+l.height);
           }
           if (!state.hotkeys.shift && this.inCircle(l.x,l.y+l.height,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //нижний левый угол
             this.active = true;
             this.isRender = true;
             this.state.view.style.cursor = "move";
             this.corner = {
               leftTop : false,
               leftBottom : true,
               rightTop : false,
               rightBottom : false,
               topCenter : false,
               bottomCenter : false,
               leftCenter : false,
               rightCenter : false
             }
             this.startvX = this.toViewX(l.x);
             this.startvY = this.toViewY(l.y+l.height);
             this.viewx = this.toViewX(l.x);
             this.viewy = this.toViewY(l.y+l.height);
           }
           if (!state.hotkeys.shift && this.inCircle(l.x+l.width,l.y,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //верхний правый угол
             this.active = true;
             this.isRender = true;
             this.state.view.style.cursor = "move";
             this.corner = {
               leftTop : false,
               leftBottom : false,
               rightTop : true,
               rightBottom : false,
               topCenter : false,
               bottomCenter : false,
               leftCenter : false,
               rightCenter : false
             }
             this.startvX = this.toViewX(l.x+l.width);
             this.startvY = this.toViewY(l.y);
             this.viewx = this.toViewX(l.x+l.width);
             this.viewy = this.toViewY(l.y);
           }
           if (!state.hotkeys.shift && this.inCircle(l.x,l.y,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //верхний левый угол
             this.active = true;
             this.isRender = true;
             this.state.view.style.cursor = "move";
             this.corner = {
               leftTop : true,
               leftBottom : false,
               rightTop : false,
               rightBottom : false,
               topCenter : false,
               bottomCenter : false,
               leftCenter : false,
               rightCenter : false
             }
             this.startvX = this.toViewX(l.x);
             this.startvY = this.toViewY(l.y);
             this.viewx = this.toViewX(l.x);
             this.viewy = this.toViewY(l.y);
          }
          if (this.inCircle(l.x+Math.floor(l.width/2),l.y,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //верхний центр
            //alert("f")
            this.active = true;
            this.isRender = true;
            this.state.view.style.cursor = "move";
            this.corner = {
              leftTop : false,
              leftBottom : false,
              rightTop : false,
              rightBottom : false,
              topCenter : true,
              bottomCenter : false,
              leftCenter : false,
              rightCenter : false
            }
            this.startvX = this.toViewX(l.x);
            this.startvY = this.toViewY(l.y);
            this.viewx = this.toViewX(l.x);
            this.viewy = this.toViewY(l.y);
         }
         if (this.inCircle(l.x+Math.floor(l.width/2),l.y+l.height,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //нижний центр
           this.active = true;
           this.isRender = true;
           this.state.view.style.cursor = "move";
           this.corner = {
             leftTop : false,
             leftBottom : false,
             rightTop : false,
             rightBottom : false,
             topCenter : false,
             bottomCenter : true,
             leftCenter : false,
             rightCenter : false
           }
           this.startvX = this.toViewX(l.x);
           this.startvY = this.toViewY(l.y+l.height);
           this.viewx = this.toViewX(l.x);
           this.viewy = this.toViewY(l.y+l.height);
        }
        if (this.inCircle(l.x,l.y+Math.floor(l.height/2),Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //левый центр
          this.active = true;
          this.isRender = true;
          this.state.view.style.cursor = "move";
          this.corner = {
            leftTop : false,
            leftBottom : false,
            rightTop : false,
            rightBottom : false,
            topCenter : false,
            bottomCenter : false,
            leftCenter : true,
            rightCenter : false
          }
          this.startvX = this.toViewX(l.x);
          this.startvY = this.toViewY(l.y);
          this.viewx = this.toViewX(l.x);
          this.viewy = this.toViewY(l.y);
       }
       if (this.inCircle(l.x+l.width,l.y+Math.floor(l.height/2),Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //правый центр
         this.active = true;
         this.isRender = true;
         this.state.view.style.cursor = "move";
         this.corner = {
           leftTop : false,
           leftBottom : false,
           rightTop : false,
           rightBottom : false,
           topCenter : false,
           bottomCenter : false,
           leftCenter : false,
           rightCenter : true
         }
         this.startvX = this.toViewX(l.x+l.width);
         this.startvY = this.toViewY(l.y);
         this.viewx = this.toViewX(l.x+l.width);
         this.viewy = this.toViewY(l.y);
      }
  }
  this.inCircle = function(x,y,r,x1,y1){
    if (Math.sqrt(Math.pow(x-x1,2)+Math.pow(y-y1,2)) <= r)
      return true;
    else return false;
  }
  this.toViewX = function(docx){
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
       if (this.corner.topCenter){ //верхний центр
         this.viewy = coords.viewy-this.y1+this.toViewY(l.y);
       }
       if (this.corner.bottomCenter){ //нижний центр
         this.viewy = coords.viewy-this.y1+this.toViewY(l.y+l.height);
       }
       if (this.corner.leftCenter){ //левый центр
         this.viewx = coords.viewx-this.x1+this.toViewX(l.x);
       }
       if (this.corner.rightCenter){
         this.viewx = coords.viewx-this.x1+this.toViewX(l.x+l.width);
       }
     }else{
       var l = this.state.paper.getLayer(this.state.activeLayer);

       if (!state.hotkeys.shift && this.inCircle(l.x+l.width,l.y+l.height,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //нижний правый угол
         this.state.view.style.cursor = "se-resize";
         this.isRender = true;
       } else if (!state.hotkeys.shift && this.inCircle(l.x,l.y+l.height,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //нижний левый угол
         this.state.view.style.cursor = "sw-resize";
         this.isRender = true;
       } else if (!state.hotkeys.shift && this.inCircle(l.x+l.width,l.y,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //верхний правый угол
         this.state.view.style.cursor = "ne-resize";
         this.isRender = true;
       } else if (!state.hotkeys.shift && this.inCircle(l.x,l.y,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //верхний левый угол
         this.state.view.style.cursor = "nw-resize";
         this.isRender = true;
       } else if (this.inCircle(l.x+Math.floor(l.width/2),l.y,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //верхний центр
         this.state.view.style.cursor = "n-resize";
         this.isRender = true;
       } else if (this.inCircle(l.x+Math.floor(l.width/2),l.y+l.height,Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //нижний центр
         this.state.view.style.cursor = "s-resize";
         this.isRender = true;
       } else if (this.inCircle(l.x,l.y+Math.floor(l.height/2),Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //левый центр
         this.state.view.style.cursor = "w-resize";
         this.isRender = true;
       } else if (this.inCircle(l.x+l.width,l.y+Math.floor(l.height/2),Math.floor(20/state.area.scale),coords.docx,coords.docy)){ //правый центр
         this.state.view.style.cursor = "e-resize";
         this.isRender = true;
       } else{
         this.isRender = false;
         this.state.view.style.cursor = "default";
       }
     }
  }
  this.onmouseup  = function(coords){
    if (this.active){
      this.active = false;
      this.isRender = false;
      this.state.view.style.cursor = "default";

      var l = this.state.paper.getLayer(this.state.activeLayer);
      var dx = coords.x - this.startX;
      var dy = coords.y - this.startY;

      var ratio = this.startW/this.startH;

        if (this.corner.rightBottom && l.width + dx >=1 && l.height + dy >= 1){ //нижний правый угол
            if (!state.hotkeys.shift)
              l.scale(l.width + dx,l.height + dy);
        }
        if (this.corner.leftBottom && l.width - dx >=1 && l.height + dy >= 1){ //нижний левый угол
            if (!state.hotkeys.shift){
              l.scale(l.width - dx,l.height + dy);
              l.move(dx,0);
            }
        }
        if (this.corner.rightTop && l.width + dx >=1 && l.height - dy >= 1){ //верхний правый угол
           if (!state.hotkeys.shift){
             l.scale(l.width + dx,l.height - dy);
             l.move(0,dy);
           }
        }
        if (this.corner.leftTop && l.width - dx >=1 && l.height - dy >= 1){ //верхний левый угол
           if (!state.hotkeys.shift){
             l.scale(l.width - dx,l.height - dy);
             l.move(dx,dy);
           }
        }
        if (this.corner.topCenter && l.height - dy >= 1){ //верхний центр
          if (state.hotkeys.shift){
            l.scale(Math.round((l.height-dy)*ratio),l.height - dy);
            l.move(Math.round(dy*ratio/2),dy);
          }else{
            l.scale(l.width,l.height - dy);
            l.move(0,dy);
          }
        }
        if (this.corner.bottomCenter && l.height + dy >= 1){ //нижний центр
            if (state.hotkeys.shift){
              l.scale(Math.round((l.height+dy)*ratio),l.height + dy);
              l.move(-Math.round(dy*ratio/2),0);
            }else{
              l.scale(l.width,l.height + dy);
              l.move(0,0);
            }
        }
        if (this.corner.leftCenter && l.height - dy >= 1){ //левый центр
          if (state.hotkeys.shift){
             l.scale(l.width-dx,Math.round((l.width-dx)/ratio));
             l.move(dx,Math.round(dx/ratio/2));
          }else{
            l.scale(l.width-dx,l.height);
            l.move(dx,0);
          }
        }
        if (this.corner.rightCenter && l.height + dy >= 1){ //правый центр
          if (state.hotkeys.shift){
            l.scale(l.width+dx,Math.round((l.width+dx)/ratio));
            l.move(0,-Math.round(dx/ratio/2));
          }else{
            l.scale(l.width+dx,l.height);
            l.move(0,0);
          }

        }
       this.state.paper.save("Изменение размера");
    }
  }
  this.onmouseout = function(){
     this.active = false;
     this.state.view.style.cursor = "default";
  }
}
