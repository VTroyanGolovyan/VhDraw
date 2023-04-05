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
           if (i != this.state.activeLayer || !(this.state.toolName == 'Scale' && state.tool.active))
              this.ctx.drawImage(this.layers[i].getView(),this.layers[i].x,this.layers[i].y);
        }
    }
    if (!(this.state.toolName == 'Scale' && (state.tool.active ) )){
      if (this.layers[this.state.activeLayer].isVisible()){
            this.ctx.drawImage(this.layers[this.state.activeLayer].getView(),this.layers[this.state.activeLayer].x,this.layers[this.state.activeLayer].y);
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
      if (state.toolName == 'Scale'){
              this.ctx.strokeStyle = 'rgba(0,0,0,1)';
              if (state.area.scale < 1){
                this.ctx.lineWidth = Math.round(1/state.area.scale)
              }
              if (!state.hotkeys.shift){
                 this.square(this.layers[this.state.activeLayer].x,this.layers[this.state.activeLayer].y);
                 this.square(this.layers[this.state.activeLayer].x+this.layers[this.state.activeLayer].width,
                          this.layers[this.state.activeLayer].y+this.layers[this.state.activeLayer].height);
                 this.square(this.layers[this.state.activeLayer].x,
                          this.layers[this.state.activeLayer].y+this.layers[this.state.activeLayer].height);
                 this.square(this.layers[this.state.activeLayer].x+this.layers[this.state.activeLayer].width,
                          this.layers[this.state.activeLayer].y);
              }
              this.square(this.layers[this.state.activeLayer].x+Math.floor(this.layers[this.state.activeLayer].width/2),this.layers[this.state.activeLayer].y);
              this.square(this.layers[this.state.activeLayer].x+this.layers[this.state.activeLayer].width,
                                     this.layers[this.state.activeLayer].y+Math.floor(this.layers[this.state.activeLayer].height/2));
              this.square(this.layers[this.state.activeLayer].x,
                                      this.layers[this.state.activeLayer].y+Math.floor(this.layers[this.state.activeLayer].height/2));
              this.square(this.layers[this.state.activeLayer].x+Math.floor(this.layers[this.state.activeLayer].width/2),
                                      this.layers[this.state.activeLayer].y+Math.floor(this.layers[this.state.activeLayer].height));
      }
    }
    return this.view;
  }

  this.ellips = function(x,y){
    this.ctx.beginPath();
    this.ctx.ellipse(x,y, Math.floor(15/state.area.scale), Math.floor(15/state.area.scale),0,0,2 * Math.PI);
    this.ctx.fill();
  }

  this.square = function(x,y){
    this.ctx.setLineDash([]);
    this.ctx.strokeRect(x-Math.floor(7/state.area.scale),y-Math.floor(7/state.area.scale), Math.floor(14/state.area.scale),Math.floor(14/state.area.scale));
    this.ctx.strokeRect(x-Math.floor(7/state.area.scale),y-Math.floor(7/state.area.scale), Math.floor(14/state.area.scale),Math.floor(14/state.area.scale));
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

  this.save = function(name=""){
    this.getLayer(this.state.activeLayer).save(name)
  }

  this.deleteLayer = function(id){
    if (this.layers.length > 0){
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
  }

  this.addLayer = function(x,y,width,height,type=0){
    this.layers.push(new Layer(x,y,width,height,type,"Слой "+(this.layers.length+1)));
    this.state.activeLayer = this.layers.length-1;
    this.renderLayersControllers('layers');
    if (this.state.toolName == 'AddImageLayer' || this.state.toolName == 'AddLayer')
       this.state.toolName = 'Scale';
    draw.changeTool(this.state.toolName);
  }

  this.changeActiveLayer = function(id){
    this.state.activeLayer = id;
    draw.changeTool(this.state.toolName);
    this.renderLayersControllers('layers');
    this.getLayer(this.state.activeLayer).renderHistory(document.getElementById("history-list"));
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

  this.getImageDataUrl = function(){
     return this.getDocument().toDataURL("image/png"); //получили изображение
  }
  this.renderLayersControllers = function(id){
    function handleDragStart(e) {
      this.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.getAttribute("data-id"));
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }
      e.dataTransfer.dropEffect = 'move';
      return false;
    }

    function handleDragEnter(e) {
      this.classList.add('over');
    }

    function handleDragLeave(e) {
      this.classList.remove('over');
    }
    var tl = this;
    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }

      tl.swap(  parseInt( e.dataTransfer.getData('text/html')),parseInt(this.getAttribute("data-id")));

      return false;
    }
    function handleDragEnd(e) {

    }
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
    var layerCont = document.createElement('div');
    container.appendChild(layerCont);
    layerCont.id = 'layer-container';
    for (var i = this.layers.length - 1; i >= 0; i--){
      let layer = document.createElement('div');
      if (i != 0)
        layer.setAttribute('data-id',i);
      //layer.setAttribute('draggable', true);
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


      buttoncont.appendChild(topButton);
      topButton.className = "onhover";
      bottomButton.className = "onhover";
      if (i > 1)
        buttoncont.appendChild(bottomButton);

      if(this.layers[i].type == 1)
        buttoncont.appendChild(this.colorChanger(this.layers[i]));
      buttoncont.appendChild(del)
      topLayerContainer.appendChild(buttoncont);

      var imgCont = document.createElement('div');
      imgCont.className = 'miniatura-container';
      if (this.layers[i].miniaturaF){
        imgCont.appendChild(img);
        layer.appendChild(imgCont);
      }
      input.onchange = function(){
        t.getLayer(this.getAttribute("data-id")).changeVisible();
      }
      if (i != 0)
        layer.appendChild(topLayerContainer);
      name.setAttribute("id",i);
      if (i != 0)
        name.onclick = function(){
          t.state.activeLayer = parseInt(this.getAttribute("id"));
          if (t.state.toolName == 'AddImageLayer')
             t.state.toolName = 'Pencil';
             draw.changeTool(t.state.toolName);
             t.renderLayersControllers('layers');
             t.getLayer(t.state.activeLayer).renderHistory(document.getElementById("history-list"));
         }
      img.setAttribute("id",i);
      if (i != 0)
         img.onclick = function(){
            t.state.activeLayer = parseInt(this.getAttribute("id"));
            if (t.state.toolName == 'AddImageLayer')
            t.state.toolName = 'Pencil';
            draw.changeTool(t.state.toolName);
            t.renderLayersControllers('layers');
            t.getLayer(t.state.activeLayer).renderHistory(document.getElementById("history-list"));
         }
      layerCont.appendChild(layer);
      if (i != 0){
          layer.setAttribute('draggable',true);
          layer.addEventListener('dragstart', handleDragStart, false);
          layer.addEventListener('dragenter', handleDragEnter, false)
          layer.addEventListener('dragover', handleDragOver, false);
          layer.addEventListener('dragleave', handleDragLeave, false);
          layer.addEventListener('drop', handleDrop, false);
          layer.addEventListener('dragend', handleDragEnd, false);
      }
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
  this.swap = function(id1,id2){
    if (id1 > 0 && id2 > 0 && id1 < this.layers.length && id2 < this.layers.length){
      id1 = parseInt(id1);
      id2 = parseInt(id2);
      var t = this.layers[id1];
      this.layers[id1] = this.layers[id2];
      this.layers[id2] = t;
      if (id1 == draw.state.activeLayer)
          draw.state.activeLayer = id2;
      else if(id2 == draw.state.activeLayer)
          draw.state.activeLayer = id1;

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
  this.colorChanger = function(layer){
    var input = document.createElement('input');
    input.setAttribute('type','color');
    var container = document.createElement("div");
    container.className = 'color-changer';
    container.appendChild(input);
    container.style.background = layer.color;
    var t = this;
    input.onchange = function(){
      var rgba = draw.hexToRGBA(this.value);
      layer.changeColor("rgba("+rgba.r+","+rgba.g+","+rgba.b+",1)",state);
      t.renderLayersControllers('layers');
    }

    return container;
  }
}
