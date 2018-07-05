function renderDownload(){
  var download = document.createElement("div");
  download.className = 'shablones';
  var select = document.createElement("div");
  select.innerHTML = 'Выберите формат';
  var png = document.createElement('div');
  png.innerHTML = "image/png";
  png.onclick = function(){
    draw.state.paper.download('image/png','png');
  }
  var jpeg = document.createElement('div');
  jpeg.innerHTML = "image/jpeg";
  jpeg.onclick = function(){
    draw.state.paper.download('image/jpeg','jpeg');
  }
  var container = document.createElement("div");
  container.className = 'downloadContainer';
  container.appendChild(select);
  container.appendChild(png);
  container.appendChild(jpeg);
  download.appendChild(container);
  document.body.appendChild(download);
}
