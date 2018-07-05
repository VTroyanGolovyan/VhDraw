function Paper(width,height,state){
  this.width = width;
  this.height = height;
  this.state = state;
  state.area.width = width;
  state.area.height = height;
  this.layers = new Array();
  this.layers.push(new Layer(0,0,width,height));
  this.view = document.createElement('canvas');
  this.ctx =  this.view.getContext("2d");
  this.view.width = this.width;
  this.view.height = this.height;
  this.miniatures = new Array();
  this.lastUpdate = new Date().getTime();
  this.f = true;
  this.getView = function(){
    this.ctx.clearRect(0,0,this.width,this.height);
    for (var i = 0; i < this.layers.length; i++){
        if (this.layers[i].isVisible()){
          this.ctx.drawImage(this.layers[i].getView(),this.layers[i].x,this.layers[i].y);
        }
    }
    this.ctx.strokeStyle = 'orange';
    this.ctx.setLineDash([1, 0]);
    this.ctx.strokeRect(this.layers[this.state.activeLayer].x,this.layers[this.state.activeLayer].y,
                        this.layers[this.state.activeLayer].width,this.layers[this.state.activeLayer].height);
    this.ctx.strokeStyle = 'red';

    if(new Date().getTime() - this.lastUpdate >= 250){
      this.f = !this.f;
      this.lastUpdate = new Date().getTime();
    }
    if (this.f)
       this.ctx.setLineDash([5, 3]);
    else {
       this.ctx.setLineDash([5, 6]);
    }
    this.ctx.strokeRect(this.layers[this.state.activeLayer].x,this.layers[this.state.activeLayer].y,
                        this.layers[this.state.activeLayer].width,this.layers[this.state.activeLayer].height);
    return this.view;
  }
  this.getDocument = function(){
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0,0,this.width,this.height);
    for (var i = 0; i < this.layers.length; i++){
      try{
        this.ctx.drawImage(this.layers[i].getView(),this.layers[i].x,this.layers[i].y);
      }catch(e){

      }

    }
    return this.view;
  }
  this.getLayer = function(i){
    return this.layers[i];
  }
  this.save = function(){
    this.getLayer(this.state.activeLayer).save()
  }
  this.deleteLayer = function(id){
    if (this.state.activeLayer == id && this.layers.length != 1){
      if (id == this.layers.length-1){
        this.changeActiveLayer(this.state.activeLayer-1);
      }
    }else{
      if(this.state.activeLayer != 0){
        this.changeActiveLayer(this.state.activeLayer-1);
      }
    }
    this.layers.splice(id,1);
    this.renderLayersControllers('layers');
    this.changeActiveLayer(this.state.activeLayer);
    draw.changeTool(this.state.toolName);
  }
  this.addLayer = function(x,y,width,height){
    this.layers.push(new Layer(x,y,width,height));
    this.state.activeLayer = this.layers.length-1;
    this.renderLayersControllers('layers');
    if (this.state.toolName == 'AddImageLayer')
       this.state.toolName = 'Pencil';
    draw.changeTool(this.state.toolName);
  }
  this.changeActiveLayer = function(id){
    this.state.activeLayer = id;
    draw.changeTool(this.state.toolName);
    this.renderLayersControllers('layers');
  }
  this.download = function exportCanvasAsPNG(mime, type) {

      var canvasElement = this.getDocument();
      var fileName = Math.random().toString(36).substring(4)+"."+type;
      var imgURL = canvasElement.toDataURL(mime);

      var dlLink = document.createElement('a');
      dlLink.download = fileName;
      dlLink.href = imgURL;
      dlLink.dataset.downloadurl = [mime, dlLink.download, dlLink.href].join(':');

      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
  }
  this.renderLayersControllers = function(id){
    var container = document.getElementById(id);
    container.innerHTML = "";
    var add = document.createElement('div');
    add.innerHTML = 'Добавить слой';
    add.className = 'buttonL';
    var t = this;
    add.onclick = function(){
      t.addLayer(0,0,t.width,t.height);
    }
    container.appendChild(add);
    for (var i = this.layers.length - 1; i >= 0; i--){
      let layer = document.createElement('div');
      let name = document.createElement("div");
      name.innerHTML = "Layer "+(i+1);
      name.className = 'layerName';
      if (this.state.activeLayer == i){
        layer.className ="layer active";
      }else layer.className ="layer";
      layer.appendChild(name);
      var img = new Image();
      img.src = "assets/img/layer.png"
      let input = document.createElement('input');
      input.setAttribute("type","checkbox");
      input.setAttribute("data-id",i);
      if(this.getLayer(i).isVisible()){
          input.setAttribute("checked","");
      }
      layer.appendChild(input);
      var del = document.createElement("span");
      del.innerHTML = "Удалить";
      var t = this;
      del.setAttribute("data-id",i);
      del.onclick = function(){
        if (confirm("Удалить слой навсегда?"))
           t.deleteLayer(this.getAttribute("data-id"));
      }
      layer.appendChild(del);
      layer.appendChild(img);
      img.style.width = "100%";
      input.onchange = function(){
        t.getLayer(this.getAttribute("data-id")).changeVisible();
      }

      name.setAttribute("id",i);
      name.onclick = function(){
        t.state.activeLayer = parseInt(this.getAttribute("id"));
        if (t.state.toolName == 'AddImageLayer')
           t.state.toolName = 'Pencil';
          draw.changeTool(t.state.toolName);
          t.renderLayersControllers('layers');
      }
      container.appendChild(layer);
    }

  }
  var tl = this.getLayer(0);
  tl.getCtx().fillStyle = "white";
  tl.getCtx().fillRect(0,0,tl.width,tl.height);

}
