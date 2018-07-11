function Paper(width,height,state){
  this.width = width;
  this.height = height;
  this.state = state;
  state.area.width = width;
  state.area.height = height;
  this.layers = new Array();
  this.layers.push(new Layer(0,0,width,height, "Слой 1"));
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
    this.state.deletedLayers.push(this.layers[id]);
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
    this.layers.push(new Layer(x,y,width,height,"Слой "+(this.layers.length+1)));
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
    add.className = 'add-layer-botton';
    var t = this;
    add.onclick = function(){
      t.addLayer(0,0,t.width,t.height);
    }
    container.appendChild(add);
    for (var i = this.layers.length - 1; i >= 0; i--){
      let layer = document.createElement('div');
      let name = document.createElement("div");
      name.innerHTML = this.layers[i].name;
      name.className = 'layer-name';
      if (this.state.activeLayer == i){
        layer.className ="layer active";
      }else layer.className ="layer";
      layer.appendChild(name);
      var img = this.getLayer(i).getMiniatura();
      let input = document.createElement('input');
      input.setAttribute("type","checkbox");
      input.setAttribute("data-id",i);
      if(this.getLayer(i).isVisible()){
          input.setAttribute("checked","");
      }
      var t = this;
      var topButton = new Image();
      topButton.setAttribute("data-id",i);
      topButton.onclick = function(){
        t.layerTop(this.getAttribute("data-id"));
      }
      var buttoncont = document.createElement('div');
      topButton.src = "assets/icon/top.png";
      var bottomButton = new Image();
      bottomButton.setAttribute("data-id",i);
      bottomButton.onclick = function(){
        t.layerBottom(this.getAttribute("data-id"));
      }
      bottomButton.src = "assets/icon/bottom.png";
      var topLayerContainer = document.createElement('div');
      topLayerContainer.className = 'top-layer-container';

      topLayerContainer.appendChild(input);

      var del = new Image();
      del.src = "assets/icon/rubish-bin.png";

      del.setAttribute("data-id",i);
      del.onclick = function(){
        if (confirm("Удалить слой (Востановление ctrl+e)?"))
           t.deleteLayer(this.getAttribute("data-id"));
      }
      buttoncont.appendChild(del)
      buttoncont.appendChild(topButton);
      buttoncont.appendChild(bottomButton);
      topLayerContainer.appendChild(buttoncont);
      layer.appendChild(topLayerContainer);
      var imgCont = document.createElement('div');
      imgCont.className = 'miniatura-container';
      imgCont.appendChild(img);
      layer.appendChild(imgCont);
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
      img.setAttribute("id",i);
      img.onclick = function(){
        t.state.activeLayer = parseInt(this.getAttribute("id"));
        if (t.state.toolName == 'AddImageLayer')
           t.state.toolName = 'Pencil';
          draw.changeTool(t.state.toolName);
          t.renderLayersControllers('layers');
      }
      container.appendChild(layer);
    }
  }
  this.restoreLayer = function(layer){
    this.layers.push(layer);
    this.state.activeLayer = this.layers.length-1;
    this.renderLayersControllers('layers');
    if (this.state.toolName == 'AddImageLayer')
       this.state.toolName = 'Pencil';
    draw.changeTool(this.state.toolName);
  }
  this.layerBottom = function(id){
    id = parseInt(id);
    if(this.layers.length>0 && id > 0){
      var t = this.layers[id];
      this.layers[id] = this.layers[id-1];
      if (id == draw.state.activeLayer)
         draw.state.activeLayer = id-1;
      else if (id-1 == draw.state.activeLayer)
            draw.state.activeLayer = id;
      this.layers[id-1] = t;
      if (this.state.toolName == 'AddImageLayer')
         this.state.toolName = 'Pencil';
        draw.changeTool(this.state.toolName);
        this.renderLayersControllers('layers');
    }
  }
  this.layerTop = function(id){
    id = parseInt(id);
    if(this.layers.length>0 && id < this.layers.length-1){
      var t = this.layers[id];
      this.layers[id] = this.layers[id+1];
      if (id == draw.state.activeLayer)
         draw.state.activeLayer = id+1;
      else if(id+1 == draw.state.activeLayer)
            draw.state.activeLayer = id;
      this.layers[id+1] = t;
      if (this.state.toolName == 'AddImageLayer')
         this.state.toolName = 'Pencil';
        draw.changeTool(this.state.toolName);
        this.renderLayersControllers('layers');
    }
  }
  this.recalcLayerMiniatures = function(){
    for (var i = this.layers.length - 1; i >= 0; i--)
      this.layers[i].recalcMiniatura();
    this.renderLayersControllers('layers');
  }
  var tl = this.getLayer(0);
  tl.getCtx().fillStyle = "white";
  tl.getCtx().fillRect(0,0,tl.width,tl.height);

}
