var fs = require('fs');
var showdown = require('showdown');
require('showdown-icon');
var copy = require('recursive-copy');
var walk = require('walk-folder-tree');
var rmdir = require('rmdir');
var pretty = require('pretty');
require('log-timestamp');

showdown.setOption('tables', 'true');
var converter = new showdown.Converter({ extensions: ['icon'] });


var ENV={
  prod:false,
  dev:false
}

if(process.argv[2]=="prod"){
  ENV.prod=true;
  var destFolder='docs';
}else{
  ENV.dev=true;
  var destFolder='devdocs';
}

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
          path: destFolder,
          fn: function(params, cb) {
            if(params.name.endsWith('.md') && !params.directory){
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
  '<title>Practicas</title>'
  if(ENV.prod){
    html+='<link href="/Practicas-SMR2/style.css" rel="stylesheet" type="text/css">'
  }
  if(ENV.dev){
    html+='<link href="/style.css" rel="stylesheet" type="text/css">'
  } 
  html+='</head>'+
  '<body>\n\n\n\n'+
  str
  '\n\n\n\n<body>'+
  '</html>'
  return pretty(html)
}


var convert =function (params)
{
  
}

