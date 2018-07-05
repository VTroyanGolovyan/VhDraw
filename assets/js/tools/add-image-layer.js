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
  input.onchange = function(){
     var file    = document.getElementById('fileup').files[0];
     var reader  = new FileReader();
     reader.onloadend = function () {
       img.src = reader.result;
     }
     if (file) {
       reader.readAsDataURL(file);
     } else {
       img.src = "";
     }
  }
  this.render = function(ctx){
    if (this.active){
       ctx.drawImage(this.img,this.startvX,this.startvY,this.x - this.startvX, this.y - this.startvY);
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
    var layer = draw.state.paper.getLayer(draw.state.activeLayer)
    layer.getCtx().drawImage(this.img,0,0,layer.width,layer.height);
    this.state.paper.getLayer(this.state.activeLayer).save();
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
