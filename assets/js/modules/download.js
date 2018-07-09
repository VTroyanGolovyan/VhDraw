function renderDownload(){
  document.getElementById('openToolBox').checked = false;
  var download = document.createElement("div");
  download.className = 'shablones';
  var select = document.createElement("div");
  select.innerHTML = 'Выберите формат';
  select.className = 'selectFormat';
  var png = document.createElement('div');
  png.className = 'downloadItem';
  png.innerHTML = "Картинка png";
  png.onclick = function(){
    draw.state.paper.download('image/png','png');
  }
  var jpeg = document.createElement('div');
  jpeg.innerHTML = "Картинка jpeg";
  jpeg.className = 'downloadItem';
  jpeg.onclick = function(){
    draw.state.paper.download('image/jpeg','jpeg');
  }

  var container = document.createElement("div");
  container.className = 'downloadContainer';
  container.appendChild(select);
  container.appendChild(png);
  container.appendChild(jpeg);
  download.appendChild(container);
  var close = document.createElement("div");
  close.innerHTML = 'Закрыть';
  close.className = 'selectFormat';
  container.appendChild(close);
  close.onclick = function(e){
    download.remove();
  }
  document.body.appendChild(download);
}
