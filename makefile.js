var fs = require('fs'),
    compressor = require('node-minify');

function mergfile(prefix,data,count,content,callback){
    fs.readFile(prefix + (data[count].replace(/['"]/g,'')),'utf8',function(err,cont){
        content.push(cont);
        if(++count == data.length){
            callback(content);
        }else{
            mergfile(prefix,data,count,content,callback)
        }
    })
}
//压缩js
fs.readFile('_examples/editor_api.js','utf8',function(err,data){
    data = data.match(/\[([^\]]+)\]/)[1].match(/'[^']+'/g)
    var content = [],count = 0;
    mergfile('_src/',data,count,content,function(cont){
        cont = '(function(){\n' + cont.join('\n').replace('_css','css') + '})()';
        console.log('ueditor.all.js 生成成功');
        fs.writeFile('ueditor.all.js',cont,function(err){
            new compressor.minify({
                type: 'gcc',
                fileIn: 'ueditor.all.js',
                fileOut: 'ueditor.all.min.js',
                callback: function(err){
                    if(err && /java/.test(err.toString())){
                        console.log('没有java环境，使用uglifyjs作为压缩工具');
                        new compressor.minify({
                            type: 'uglifyjs',
                            fileIn: 'ueditor.all.js',
                            fileOut: 'ueditor.all.min.js',
                            callback: function(err){
                                console.log('ueditor.all.min.js 生成成功');
                            }
                        });
                    }else{
                        console.log('ueditor.all.min.js 生成成功');
                    }

                }
            });
        });
    })
});

//压缩css
fs.readFile('themes/default/_css/ueditor.css','utf8',function(err,data){
    data = data.match(/\"([^\"]+)\"/g);

    var content = [],count = 0;
    mergfile('themes/default/_css/',data,count,content,function(cont){
        fs.writeFile('themes/default/css/ueditor.css',cont.join('\n'),function(err){
            console.log('ueditor.css 生成成功');
            new compressor.minify({
                type: 'sqwish',
                fileIn: 'themes/default/css/ueditor.css',
                fileOut: 'themes/default/css/ueditor.min.css',
                callback: function(err){
                    console.log('ueditor.min.css 生成成功');
                }
            });
        });
    })
});