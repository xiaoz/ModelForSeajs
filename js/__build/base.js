define(function(require, exports, module) {
  var S = KISSY,DOM = S.DOM, Event = S.Event;	doc = document;
 
  /* * 存放公用方法等* */
  this.util = {
	    /*** 版本号*/
		version: '1.0',

		/*页面跳转*/
		setLocation: function(url)  {
			window.location.href = url;
			try {
				window.event.returnValue = false;
			} catch(e) {
				//
			}
		},
		/* * 页面刷新 * */
		pageReload: function( url ) {
			url = ( url || window.location.toString() ).replace(/t=(\d)+/g, '').replace(/([&|?])+$/, '');
			url = url + ( -1 === url.indexOf('?') ? '?' : '&' ) + 't=' + KISSY.now();
			return window.location = url;
		},
		/*链接跟踪
			@parame btn  跟踪链接点，
			@parame tag  跟踪标签名，
			@parame url  保存地址
		*/
		saveTrack: function(btn,tag,url){
				Event.on(btn,'click',function(){
					KISSY.io.get(url,{
				    	name:tag
					});
				})
		},
		/*切换小菊花*/
	 	toggleFlower: function(el) {
			DOM.toggleClass([el, DOM.prev(el)], 'hidden');
		},
		/**
         * Print debug info.
         * @param msg {String} the message to log.
         * @param cat {String} the log category for the message. Default
         *        categories are "info", "warn", "error", "time" etc.
         * @param src {String} the source of the the message (opt)
         * @return {HLG}
         */
		log: function( msg, cat, src ) {
			if (debug) {
                if (src) {
                    msg = src + ': ' + msg;
                }
                if (window['console'] !== undefined && console.log) {
                    console[cat && console[cat] ? cat : 'log'](msg);
                }
            }
            return this;
		}

  };
		/**
		 *Msg 简易消息提示
		 *  new msg = H.util.Msg();  
		 * 方法：setHeader(str);  设置头部
				 setMsg(value); 设置消息
				 setFooter(str);  设置尾部 
				 show(): 居中显示遮罩， 
		 * 		 show(id)  特定容器里 显示消息  
		 *		 showDialog() 简易对话					
		 */
		Msg = function() {
			var self = this; 
			if (!(self instanceof Msg)) { 
				return new Msg(); 
			}
			this.popup = null;
			this.dialog =null;
			this.msg = null;
			this.header = "错误提示";
			this.footer ='';
			this.el;
			this.status = 'msg'; 
		}
		S.mix(Msg.prototype, {
		
			/* 
			 * 设置消息
			 * @param value {String} 消息内容
			 * show(mode) 
			 *			   
			 * */
			setHeader: function(str){
				 var self =this;
				 if(S.isString( str )){
					 self.header =str;
				 }
				 return this;
			 },
			setMsg: function(value){
				 var self = this;
				 if(value ==undefined){
					 self.msg = null;
				 }else{
					 self.msg = value;
				 }
				 return this;
			 }, 
			 setFooter: function(str){
				 var self =this;
				 if(S.isString( str )){
					 self.footer =str;
				 }
				 return this;
			 },
			show :function(id){
				var self = this;
				if(id == undefined){
					var node = document.createElement("div");
						node.innerHTML = '<div class="messages-prompt"><div class="fbloader"><img  src=" http://img.huanleguang.com/hlg//fbloader.gif" width="16" height="11" /></div>'
										+'<div>'+self.msg +'</div>'
										+'</div>';
					if(!this.popup){
						this.popup = new KISSY.Popup({
							elStyle:{
								position:KISSY.UA.ie == 6 ? "absolute" : "fixed",
								background:"transparent"
							},
							align: {
								points: ['cc', 'cc']
							},
							effect: {
								effect:"fade",
								duration:0.5
							}
						});
						if (KISSY.UA.ie == 6) {
							Event.on(window, "scroll", function() {
								if (popup.get("visible"))
									popup.center();
							});
						}
					}					
					this.popup.set("content", node);
					this.status = 'msg'; 
					this.popup.show();
				}else{
					DOM.show(DOM.html(id,this.msg));
				}
			},
			showDialog: function(){
				var self = this;
				if(!this.dialog){
					this.dialog = new KISSY.Dialog({
						width: 400,
						bodyStyle:{
							
						},
						mask: true,
						align: {
							points: ['cc', 'cc']
						},
						draggable: true,    // 定义是否可拖拽
						closable:false,
						resize:{            // 可缩放大小, 并设置最小宽度/最小高度/缩放位置
							minWidth:150,
							minHeight:70,
							handlers:["b","t","r","l","tr","tl","br","bl"]
						}
					});
				}
				this.dialog.setHeader(self.header);
				this.dialog.setBody(self.msg);
				this.dialog.setFooter(self.footer);
				this.status = 'dialog'; 
				this.dialog.show();
			},
			hide: function(delay){
				var self = this;
				if(delay == undefined){
					delay = '100';
				}
				if(self.status == 'msg'){
					S.later(function(){this.dialog.hide()},delay,false);
				}else if(self.status == 'dialog'){
					S.later(function(){this.popup.hide()},delay,false)
				}else{
					S.later(function(){this.dialog.hide()},delay,false);
					S.later(function(){this.popup.hide()},delay,false)
				}	
			}
	});
	
	  /* * 存放组件等* */
  this.widget = {
	    /*** 版本号*/
		version: '1.0'
		
  };    
	return {
    util: this.util	,
    Msg:  Msg
  };
/*
H.add('widget~asyncRequest', function(HLG) {
	var S = KISSY, DOM = S.DOM, Event = S.Event, doc = document;
	
	function asyncRequest(uri) {

    	var self = this; 
        if (!(self instanceof asyncRequest)) { 
            return new asyncRequest(uri); 
        }
		this.form = ''; 
        this.dataType = 'json';
	    this.uri = '';
        this.method = 'GET';
        this.data = null;
        this.bootloadable = true;
        this.resList = [];
        if (uri != undefined) {
            this.setURI(uri);
        }
      
    };
	
	S.mix(asyncRequest.prototype,{
		
		handleSuccess: function() {
			return undefined;
		},

        handleFailure: function(o) {
           alert(o.desc);
        },
		
        mapRes: function() {
            var links = document.getElemenHLGByTagName("link");
            var scripHLG = document.getElemenHLGByTagName("script");
            if (links.length) {
                for (var i = 0, l = links.length; i < l; i++) {
                    this.resList.push(links[i].href);
                }
            }
            if (scripHLG.length) {
                for (var i = 0, l = scripHLG.length; i < l; i++) {
                    this.resList.push(scripHLG[i].src);
                }
            }
        },
		
		setMethod: function(m) {
            this.method = m.toString().toUpperCase();
            return this;
        },
		
        getMethod: function() {
            return this.method;
        },
		
        setData: function(obj) {
        	this.data = obj;
            return this;
        },
		
        getData: function() {
            return this.data;
        },
		 setForm: function(form) {
        	this.form = form;
            return this;
        },
		
        getForm: function() {
            return this.form;
        },
        setURI: function(uri) {
            this.uri = uri;
            return this;
        },
		
        getURI: function() {
            return this.uri.toString();
        },
        
        setDataType: function(datatype) {
            this.dataType = datatype;
            return this;
        },
		
        getDataType: function() {
            return this.dataType;
        },
		
        setHandle: function(fn) {
        	this.handleSuccess = fn;
            return this;
        },
		
        setErrorHandle: function(fn) {
        	this.handleFailure = fn;
            return this;
        },
        dispatchResponse: function(o,b) {

        	b.handleSuccess(o);
            var onload = o.onload;
            if (onload) {
                try { (new Function(onload))();
              
			    } catch(exception) {
                   // HLG.widget.msgBox.setMsg('执行返回数据中的脚本出错').setAutohide().show()
                }
            }
        },
        disableBootload: function() {
            this.bootloadable = false;
            return this;
        },
        enableBootload: function() {
            this.bootloadable = true;
            return this;
        },
        
        dispatchErrorResponse: function(o) {
        	new H.util.Msg().setMsg('与服务器交互出错，请检查网络是否连接正常').show();
        	S.later(function(){window.history.back(-1);},10000,false,null,null);
        	//S.later(function(){window.history.back(-1);},3000,false,null,null);
        },
        send: function() {
        	var self = this;
            if (self.method == "GET" && self.data) {
                self.uri += ((self.uri.indexOf('?') == -1) ? '?': '&') + self.data;
                self.data = null;
            }
        	var ajax = this;
        	
        	interpretResponse = function(data, textStatus, xhr,ajax) {
        		var self = ajax;
        		if (data.ajaxExpired!=null) {
        			window.location = data.ajaxRedirect;
        			return
        		}
        		if (data.error) {
        			//alert(this.handleFailure);
        			var fn = self.handleFailure;
        		} else {
        			var fn = self.dispatchResponse;
        		}   
        		fn = fn.shield(null, data,ajax);
        		fn = fn.defer.bind(fn);
				/*
	            if (this.bootloadable) {
	                var bootload = data.bootload;
	                if (bootload) {
	                    Bootloader.loadResources(response.bootload, fn, false)
	                } else {
	                    fn()
	                }
	            } else {
	                fn()
	            }
				*//*
				fn();
        	};
            S.ajax({
				form:self.form,
				type:self.method,
			    url:self.uri,
			    data:self.data,
		        success:function(data, textStatus, xhr){
            		interpretResponse(data, textStatus, xhr,ajax);
            	},
				error:this.dispatchErrorResponse,
			    dataType:self.dataType
				
			});
			
        }
	});
	H.widget.asyncRequest = asyncRequest;
});

  //分页 组件
H.add('widget~showPages', function( HLG ) { 
  
	var S = KISSY, DOM = S.DOM, Event = S.Event, doc = document;
  
	function showPages(name) { //初始化属性 
		var self = this; 
        if (!(self instanceof showPages)) { 
        	return new showPages(name); 
        } 	
		this.pageNum = 4 ;   
		this.name = name;      //对象名称
        this.page = 1;         //当前页数
        this.pageCount = 200;    //总页数
        this.argName = 'page'; //参数名	
		
  	}

	S.mix(showPages.prototype,{
		jump: function() {
	        return undefined;
	  	},
		
	    //进行当前页数和总页数的验证
        checkPages: function() { 
	     	if (isNaN(parseInt(this.page))) this.page = 1;
		 	if (isNaN(parseInt(this.pageCount))) this.pageCount = 1;
		 	if (this.page < 1) this.page = 1;
		 	if (this.pageCount < 1) this.pageCount = 1;
		 	if (this.page > this.pageCount) this.page = this.pageCount;
		 	this.page = parseInt(this.page);
		 	this.pageCount = parseInt(this.pageCount);
     	},
		
		//生成html代码	  
     	_createHtml: function(mode) { 
	   
         	var self = this, strHtml = '', prevPage = this.page - 1, nextPage = this.page + 1;   
            if (mode == '' || typeof(mode) == 'undefined') mode = 1;
		
            switch (mode) {
				case 1: 
					//模式1 (页数)
                    // strHtml += '<span class="count">Pages: ' + this.page + ' / ' + this.pageCount + '</span>';
                    strHtml += '<span class="number">';
                    if (this.page != 1) {
						strHtml += '<span title="Page 1"><a href="javascript:' + self.name  + '.toPage(1);">1</a></span>';
				    }
                    if (this.page >= 5) {
				   		strHtml += '<span>...</span>';
				    }
				    if (this.pageCount > this.page + 2) {
                   		var endPage = this.page + 2;
                    } else {
                        var endPage = this.pageCount; 
                      }
                    for (var i = this.page - 2; i <= endPage; i++) {
					if (i > 0) {
						if (i == this.page) {
							strHtml += '<span title="Page ' + i + '">' + i + '</span>';
						} else {
							if (i != 1 && i != this.pageCount) {
								strHtml += '<span title="Page ' + i + '"><a href="javascript:' + self.name + '.toPage(' + i + ');">' + i + '</a></span>';
							}
				          }
                    }
                    }
                    if (this.page + 3 < this.pageCount) {
						strHtml += '<span>...</span>';
					}
                    if (this.page != this.pageCount) {
						strHtml += '<span title="Page ' + this.pageCount + '"><a href="javascript:' + self.name + '.toPage(' + this.pageCount + ');">' + this.pageCount + '</a></span>';
					}
					strHtml += '</span><br />';
                    break;
								 
				case 2: 
					//模式2 (前后缩略,页数,首页,前页,后页,尾页)
                    // strHtml += '<span class="count">Pages: ' + this.page + ' / ' + this.pageCount + '</span>';
                    strHtml += '<span class="number">';
                    if (prevPage < 1) {
                    	//strHtml += '<span title="First Page" class="number-none">第一页</span>';
                        strHtml += '<span title="Prev Page"  class="number-none">上一页</span>';
                    } else {
                        //strHtml += '<span title="First Page"><a href="javascript:' + self.name + '.toPage(1);">第一页</a></span>';
                        strHtml += '<span title="Prev Page"><a href="javascript:' + self.name + '.toPage(' + prevPage + ');">上一页</a></span>';
                      }
                    if (this.page != 1) {
						//strHtml += '<span title="Page 1"><a href="javascript:' + self.name  + '.toPage(1);">1</a></span>';
					}
					if (this.page >= 5) {
						//strHtml += '<span  class="number-none" >...</span>';
					}
					if(this.page - 2<=0){
						var start = 1;
							if (this.pageCount > this.page + 4) {
                           		var endPage = this.page + 4;
                           } else {
                             	var endPage = this.pageCount; 
                            }
					}else if(this.page + 2>=this.pageCount){
						var start = this.pageCount-4;
						if (this.pageCount > this.page + 4) {
                       		var endPage = this.page + 4;
                        } else {
                         	var endPage = this.pageCount; 
                        }
					}else {
						var start = this.page - 2;
						if (this.pageCount > this.page + 2) {
	                           		var endPage = this.page + 2;
	                           } else {
	                             	var endPage = this.pageCount; 
	                             }
					}
                    for (var i = start; i <= endPage; i++) {
                    if (i > 0) {
                       	if (i == this.page) {
                           	strHtml += '<span title="Page ' + i + '" class="current">' + i + '</span>';
                        } else {
                           // if (i != 1 && i != this.pageCount) {
                              	strHtml += '<span title="Page ' + i + '"><a href="javascript:' + self.name + '.toPage(' + i + ');">' + i + '</a></span>';
                           // }
					      }
                    }
                    }
                    if (this.page + 3 < this.pageCount) {
						strHtml += '<span  class="number-none">...</span>';
					}
			  	    if (this.page != this.pageCount) {
						//strHtml += '<span title="Page ' + this.pageCount + '"><a href="javascript:' + self.name + '.toPage(' + this.pageCount + ');">' + this.pageCount + '</a></span>';
					}
					if (nextPage > this.pageCount) {
                    	strHtml += '<span title="Next Page"  class="number-none">下一页</span>';
                        //strHtml += '<span title="Last Page"  class="number-none">最后一页</span>';
                    } else {
                        strHtml += '<span title="Next Page"><a href="javascript:' + self.name + '.toPage(' + nextPage + ');">下一页</a></span>';
                        //strHtml += '<span title="Last Page"><a href="javascript:' + self.name +'.toPage(' + this.pageCount + ');">最后一页</a></span>';
                      }
					 if (this.pageCount > 10) {
		   					strHtml += '<span class="margin-top-5">';
		   					strHtml += '共'+this.pageCount+'页&nbsp;到第';
		   					if(this.page>=this.pageCount){
		   						strHtml += '<input type="text" id="pageInput' + self.name + '" value="' + this.pageCount + '" class="input-text w-25" title="Input page" onkeypress="return ' + self.name + '.formatInputPage(event);" onfocus="this.select()">';
		   					}else{
		   						strHtml += '<input type="text" id="pageInput' + self.name + '" value="' + (this.page+1) + '" class="input-text w-25" title="Input page" onkeypress="return ' + self.name + '.formatInputPage(event);" onfocus="this.select()">';
		   					}
		   					strHtml += '页';
		   					strHtml += '<span class="gray-btm-60"><a style="border: 0px solid #CBCDCC;margin: 0px;padding: 0px" href="javascript:var page = document.getElementById(\'pageInput' + self.name + '\').value; if(isNaN(Number(page))|| Number(page)==0) { var turnTo = 1;} else if(page>'+this.pageCount+'){ var turnTo = '+this.pageCount+';} else{var turnTo = page;} ; ' + self.name + '.toPage(turnTo);"><span>GO</span></a></span>';
		   					strHtml += '</span>';	
		   					}
                   strHtml += '</span>';
                   break;
			   case 3 :
				   strHtml += '<span class="count">' + this.page + ' / ' + this.pageCount + '</span>';
                   strHtml += '<span class="number">';
                   if (prevPage < 1) {
                       strHtml += '<span title="Prev Page" class="number-none">◄</span>';
                   } else {
                       strHtml += '<span title="Prev Page"><a href="javascript:' + self.name + '.toPage(' + prevPage + ');"><em style=" color:#FF6600">◄</em></a></span>';
                     }
                   if (nextPage > this.pageCount) {
                   	strHtml += '<span title="Next Page" class="number-none">下一页</span>';
                   } else {
                       strHtml += '<span title="Next Page"><a href="javascript:' + self.name + '.toPage(' + nextPage + ');">下一页<em style=" color:#FF6600">►</em></a></span>';
                     }
                  strHtml += '</span><br />';
                  break;
					
			}
		    return strHtml;
			   
		},
		 //限定输入页数格式
		formatInputPage : function(e){
			var ie = navigator.appName=="Microsoft Internet Explorer"?true:false;
			if(!ie) var key = e.which;
			else var key = event.keyCode;
			if (key == 8 || key == 46 || (key >= 48 && key <= 57)) return true;
			return false;
		},
      
	    //页面跳转 返回将跳转的页数
		toPage: function( page ,flag) { 
        	var turnTo = 1;
			var self = this;    
            if (typeof(page) == 'object') {
            	turnTo = page.options[page.selectedIndex].value;
            } else {
               	turnTo = page;
              }
			
            self.jump(turnTo,flag,'');
			  
		},
			  
        //显示html代码
	    printHtml: function(contian, mode) {  
			this.checkPages();
            DOM.html(contian,this._createHtml(mode));
			return this;
		},
				   
	    //设置总页数			  
	    setPageCount: function( pagecount ) {
			this.pageCount=pagecount;
	 	    return this;
		},			    
	    
		getPageCount: function() {
            return this.pageCount;
	    },
	    
		//设置跳转 执行函数
        setRender: function(fn) {
			this.jump = fn;
			return this;
		},	
     	setPageNum:function(page_num){
	        this.pageNum = page_num;
		    return this;
		 },
		setPage:function(page){
		    this.page = page;  
		    return this; 
	    }   	   

		  	   
	});

	H.widget.showPages = showPages;
});

 //循环倒计时
H.add('widget~countdown', function( HLG ) { 
  
	var S = KISSY, DOM = S.DOM, Event = S.Event, doc = document;

	function countdown(contain, endTime, mode) { //初始化属性 
		var self = this; 
        if (!(self instanceof countdown)) { 
        	return new countdown(contain, endTime, mode); 
        } 
        this.timer = null;
        self.init(contain, endTime, mode);	    
    }
	
	S.mix(countdown.prototype,{
		init: function(contain, endTime, mode) {
 	    	//var n = endTime || 1440; //剩余分钟数
 	    		var self = this;
			if (mode == '' || typeof(mode) == 'undefined') mode = 1;
			if(mode == 1){
				// 天 时 分 秒分 
				DOM.html(DOM.get(contain),' <span class="day"></span>天<span class="hour"></span>时<span class="min"></span>分<span class="sec"></span>秒 ');
			} 
			if(mode == 2){
				//  时 分 秒分 
				DOM.html(DOM.get(contain),' <span class="hour">19</span>时<span class="min">19</span>分<span class="sec">26</span>秒');
			} 
			if(mode == 3){
				//  时 分 秒分 
				DOM.html(DOM.get(contain),'<span class="hour"><b>0</b><b>0</b></span><span class="min"><b>0</b><b>0</b></span><span class="sec"><b>0</b><b>0</b></span>');
			} 
					   
            var fresh = function(data) {
            	var nowtime = new Date(), endtime = data;
				var leftsecond = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
                d = parseInt((leftsecond / 86400) % 10000);
                h = parseInt((leftsecond / 3600) % 24);
                m = parseInt((leftsecond / 60) % 60);
                s = parseInt(leftsecond % 60);
				if (mode == 3) {
					var h = h + d * 24;
				}	
				if(d>=0 && d<10){
					d= '0'+d;
				}
				if(h>=0 && h<10){
					h = '0'+h;
				}
				if(m>=0 && m<10){
					m = '0'+m;
				}
				if(s>=0 && s<10){
					s = '0'+s;
				}
                if( mode == 1 ){
					DOM.html(DOM.get(contain+' .day'), d);
                	DOM.html(DOM.get(contain+' .hour'), h);
                	DOM.html(DOM.get(contain+' .min'), m);
                	DOM.html(DOM.get(contain+' .sec'), s);
				}
				if( mode == 2 || mode == 3){
					if(mode == 3){
						var h = h.toString();
						var m = m.toString();
						var s = s.toString();
							h = '<b>'+h.charAt(0)+'</b><b>'+h.charAt(1)+'</b>';
							m = '<b>'+m.charAt(0)+'</b><b>'+m.charAt(1)+'</b>';
							s = '<b>'+s.charAt(0)+'</b><b>'+s.charAt(1)+'</b>';
					}
                	DOM.html(DOM.get(contain+' .hour'), h);
                	DOM.html(DOM.get(contain+' .min'), m);
                	DOM.html(DOM.get(contain+' .sec'), s);
				}
				if(leftsecond<=0){
					self.endDo();	
				}
            };
            //S.later(newendtime, n * 60000, true, null, null);
            if(self.timer){
				self.timer.cancel();
			}
            self.timer = S.later(fresh, 1000 , true, null, endTime);
		},
		//设置结束时 执行函数
        setRender: function(fn) {
			var self = this;
			this.endDo = fn;
			return this;
		},	
		endDo : function(){
			var self = this;
			self.timer.cancel();	
		}
	
				  	   
	});

	H.widget.countdown = countdown;
});


//上下左右无缝滚动
H.add('widget~roll', function( HLG ) { 
  
	/*结构
	<div id="demo">
		<div id="demo1">
 			<div></div>
  			<div></div>
		</div>
		<div id="demo2"></div>
	</div>
	*	/

	function roll(contain, mode,speed) { 
		//初始化属性 
		var LEFT = "left", RIGHT = "right", UP = "up", DOWN = "down";
		var self = this;
		if (!(self instanceof roll)) { 
        	return new roll(contain, mode, speed); 
        } 
	   
	    this.tab = DOM.get(contain);
		this.speed = speed;
		var child = DOM.children(this.tab);
	    if(child.length!=2) return;
	    this.tab1 = child[0];
		this.tab2 = child[1];
	   self.init(mode);	 
    }
	
	S.mix(roll.prototype,{
		init: function(mode) {
			
 	    	var self = this;   
            if (mode == '' || typeof(mode) == 'undefined') mode = UP;
			switch(mode){
				case UP:
					DOM.html(self.tab2,DOM.html(self.tab1));
					
					function MarqueeUp(){
						if(self.tab2.offsetTop-self.tab.scrollTop<=0)
							self.tab.scrollTop-=self.tab1.offsetHeight;
						else{
							self.tab.scrollTop++;
						}
					}
					self.timer = S.later(MarqueeUp,self.speed,true,null,null);
					Event.on(self.tab,'mouseenter mouseleave',function(ev){
						if(ev.type == 'mouseenter'){
							self.timer.cancel();
						} else {
						    self.timer = S.later(MarqueeUp,self.speed,true,null,null);
						}
						
					});
					break;
					
				case DOWN: 
					DOM.html(self.tab2,DOM.html(self.tab1));
					self.tab.scrollTop=self.tab.scrollHeight;
					function MarqueeDown(){
						if(self.tab1.offsetTop-self.tab.scrollTop>=0)//当滚动至demo1与demo2交界时
							self.tab.scrollTop+=self.tab2.offsetHeight;//demo跳到最顶端
						else{
							self.tab.scrollTop--;
						}
					}
					self.timer = S.later(MarqueeDown,self.speed,true,null,null);
					Event.on(self.tab,'mouseenter mouseleave',function(ev){
						if(ev.type == 'mouseenter'){
							self.timer.cancel();
						} else {
						    self.timer = S.later(MarqueeDown,self.speed,true,null,null);
						}
						
					});
					break;
					
				case LEFT: 
					alert('left');
					break;
				case RIGHT: 
					alert('right');
					break;			
			}
		}
	});

	H.widget.roll = roll;
});


	  
	  
   }; */
  
 
  
});