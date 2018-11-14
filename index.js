var fs = require('fs');
var showdown = require('showdown');
require('showdown-icon');
var copy = require('recursive-copy');
var walk = require('walk-folder-tree');
var rmdir = require('rmdir');

showdown.setOption('tables', 'true');
var converter = new showdown.Converter({ extensions: ['icon'] });



rmdir('dist', function (err, dirs, files) {
  if(err != null && err.code != 'ENOENT'){
    console.error(err)
    process.exit(1)
  }else{
    copy('data', 'dist', function(error, results) {
      if (error) {
          console.error(error);
      } else {
        walk({
          path: 'dist',
          fn: function(params, cb) {
            if(params.name.endsWith('.md')){
              fs.readFile(params.fullPath, 'utf8', (err, data) => {
                if (err) throw err;
                var nfp = params.fullPath.split("\\");
                nfp.splice(-1,1)
                nfp.push("index.html")
                nfp=nfp.join("\\")
                fs.writeFile(nfp,converter.makeHtml(data), function(err) {
                  if (err) throw err;
                  fs.unlink(params.fullPath, (err) => {
                    if (err) throw err;
                  });
                });
              });
            }
            cb()
          }
        });
      }
  });
  }
});



