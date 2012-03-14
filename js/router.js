(function() {
  // IE6 
  if (!+'\v1' && !('maxHeight' in document.body.style)) {
      window['FXL_IE6'] = 1;
      //if (window.location.hash !== '#ie6') return window.location.href = '/not-supported.html';
  } else {
      window['FXL_IE6'] = 0;
  }

  var alias = {
  'json': 'json/1.0.1/json',
  'jquery': 'jquery/1.6.4/jquery'
  
  };

  var map = [
    [/^(.*\/js\/.*?)([^\/]*\.js)$/i, '$1$2?t=201203133']
  ];


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
    base: ''
  });

})();


define(function(require, exports) {
  exports.load = function(filename) {
		modNames = filename.split(',')
		for(var i=0,len=modNames.length;i<len;i++){
			 require.async('./' + modNames[i], function(mod) {
			 	if (mod && mod.init) {
			  		mod.init();
			 	}
			 })
		}
  };
/*  require.async('./head');
  require.async('./ga');
  if (window['FXL_IE6'])  require.async('./ie6');
  */
});
