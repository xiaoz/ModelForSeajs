(function() {
  // IE6 
  if (!+'\v1' && !('maxHeight' in document.body.style)) {
      window['FXL_IE6'] = 1;
      //if (window.location.hash !== '#ie6') return window.location.href = '/not-supported.html';
  } else {
      window['FXL_IE6'] = 0;
  }

  var alias = {
  'base': 'base',
  'switchable':'components/switchable-min'
  
  };
 
  var map = [
    [/^(.*\/js\/.*?)([^\/]*\.js)$/i, 'C:/Documents and Settings/Administrator/.ssh/Model/js/__build/$2?t=20120314']
  ];

/*   
$1 表示 base 路径 $2 表示js文件
var map = [
    [/^(.*\/js\/.*?)([^\/]*\.js)$/i, '$1__build/$2?t=20120314']
  ];*/


  if (seajs.debug) {
    for (var k in alias) {
      if (alias.hasOwnProperty(k)) {
        var p = alias[k];
        if (!/\.(?:css|js)$/.test(p)) {
        alias[k] += '-debug';
        }
      }
    }
    map = [];
  }

  seajs.config({
    alias: alias,
 /*   preload: [
      Function.prototype.bind ? '' : 'es5-safe',
      this.JSON ? '' : 'json'
    ],*/
    map: map,
    base: 'http://promo.huanleguang.cn/js/hlg/model',
	preload: ['plugin-json']
  });

})();


define(function(require, exports) {
  exports.load = function(filename) {
		modNames = filename.split(',')
		for(var i=0,len=modNames.length;i<len;i++){
			 require.async('./'+modNames[i], function(mod) {
			 	if (mod && mod.init) {
			  		mod.init();
			 	}
			 })
		}
  };
 /* require.async('./head');
  require.async('./ga');
  if (window['FXL_IE6'])  require.async('./ie6');
  */
});
