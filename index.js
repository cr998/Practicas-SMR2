var fs = require('fs');
var showdown = require('showdown');
require('showdown-icon');
var copy = require('recursive-copy');
var walk = require('walk-folder-tree');
var rmdir = require('rmdir');
var pretty = require('pretty');

showdown.setOption('tables', 'true');
var converter = new showdown.Converter({ extensions: ['icon'] });


var destFolder='docs';

rmdir(destFolder, function (err, dirs, files) {
  console.log("Borrando archivos carpeta "+destFolder)
  if(err != null && err.code != 'ENOENT'){
    console.error(err)
    process.exit(1)
  }else{
    console.log("Borrando terminado");
    console.log("Empezando copiado recursivo desde data");
    copy('data', destFolder , function(error, results) {
      if (error) {
          console.error(error);
      } else {
        console.log("copiado recursivo completado");
        walk({
          path: 'docs',
          fn: function(params, cb) {
            if(params.name.endsWith('.md')){
              fs.readFile(params.fullPath, 'utf8', (err, data) => {
                if (err) throw err;
                console.log("Generando html desde "+params.fullPath);
                var nfp = params.fullPath.split("\\");
                nfp.splice(-1,1)
                nfp.push("index.html")
                nfp=nfp.join("\\")
                fs.writeFile(nfp,createHTML(converter.makeHtml(data)), function(err) {
                  if (err) throw err;
                  console.log("guardando html en"+nfp);
                  fs.unlink(params.fullPath, (err) => {
                    console.log("Eliminando "+params.fullPath)
                    if (err) throw err;
                  });
                });
              });
            }else{
              if(!params.directory){
                console.log("El archivo "+params.fullPath+" no cumple los requisitos")
              }
            }
            cb()
          }
        });
      }
  });
  }
});


function createHTML(str){
  var html='<html>'+
  '<head>'+
  '<title>Practicas</title>'+
  '<link src="/style.css" rel="stylesheet" type="text/css">'+
  '</head>'+
  '<body>\n\n\n\n'+
  str
  '\n\n\n\n<body>'+
  '</html>'
  return pretty(html)
}


