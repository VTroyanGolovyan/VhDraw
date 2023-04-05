function AddImageLayer(state, ctx){
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
  var img = new Image();
  this.img = img;
  var input = document.createElement('input');
  input.setAttribute('type','file');
  input.setAttribute('id','fileup');
  document.body.appendChild(input);
  input.click();
  var t = this;
  input.onchange = function(){
     var file    = document.getElementById('fileup').files[0];
     var reader  = new FileReader();
     reader.onloadend = function () {
       img.src = reader.result;

       img.onload = function(){
         var w = 1;
         var h = 1;
         var x = 0;
         var y = 0;
         var maxWidth = Math.floor(0.7*t.state.paper.width);
         var maxHeight = Math.floor(0.7*t.state.paper.height);
         if (this.width < maxWidth && this.height < maxHeight){
            w = this.width;
            h = this.height;
         }else{
            w = this.width;
            h = this.height;
            if( w > maxWidth){
              let t = w;
              w = maxWidth;
              h = Math.floor(h*maxWidth/t);
            }
            if (h > maxHeight){
              let t = h;
              h = maxHeight;
              w = Math.floor(w*maxHeight/t);
            }
         }
         x = Math.floor((t.state.paper.width-w)/2);
         y = Math.floor((t.state.paper.height-h)/2);
         if(w > 0 && h > 0){
           t.state.paper.addLayer(x,y,w,h);
           var layer = t.state.paper.getLayer(t.state.activeLayer);
           layer.name = "Картинка";
           draw.state.paper.renderLayersControllers('layers');
           layer.getCtx().drawImage(this,0,0,layer.width,layer.height);
           t.state.paper.getLayer(t.state.activeLayer).save("Вставка картинки");
         }
       }
     }
     if (file) {
       reader.readAsDataURL(file);
     } else {
       img.src = "";
     }
  }
  this.renderScaleImage = function(ctx,x,y,w,h){
    ctx.drawImage(this.img,x,y,w,h);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'orange';
    ctx.setLineDash([1, 0]);
    ctx.strokeRect(x,y,w,h);
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
    ctx.strokeRect(x,y,w,h);
    ctx.setLineDash([1, 0]);
  }
  this.render = function(ctx){
    if (this.active){
      this.renderScaleImage(ctx,this.startvX,this.startvY,this.x - this.startvX, this.y - this.startvY);
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
    var layer = draw.state.paper.getLayer(draw.state.activeLayer);
    layer.name = "Картинка";
    draw.state.paper.renderLayersControllers('layers');
    layer.getCtx().drawImage(this.img,0,0,layer.width,layer.height);
    this.state.paper.getLayer(this.state.activeLayer).save("Вставка картинки");
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
