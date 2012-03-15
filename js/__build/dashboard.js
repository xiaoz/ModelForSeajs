define(function(require, exports) {
	var S = KISSY,DOM = S.DOM, Event = S.Event;
	var B = require('base');
    require('switchable');
	
    this.MarkList = {
		msg : new B.util.Msg(),
		dragDelegate1 : null,
		deleApp: function(data,parent){
			var startPosition = DOM.offset(parent);
			var add= KISSY.Template(DOM.html('#J_Templet_Add'));
			var addLi = DOM.create(add.render(apps[''+data+'']));
			var startPosition = DOM.offset(parent);
			var MovingObject = DOM.clone(addLi,true);
			DOM.width(MovingObject,'92px');
			DOM.append(addLi,'#J_AddApp');
			var flag = DOM.next(parent);
			if(!flag){
				var prev = DOM.prev(parent);
			}else{
				var next = DOM.next(parent);
			}
			DOM.remove(parent);
			var lisA = DOM.children('#J_AddApp');
			var endPosition = DOM.offset(lisA[lisA.length-1]);
			if(!flag){
				DOM.insertAfter(MovingObject,prev);
			}else{
				DOM.insertBefore(MovingObject,next);
			}
			H.dashboard.moveEffects(MovingObject,startPosition,endPosition)
		},
		addApp : function(data,parent){	
			var startPosition = DOM.offset(parent);
			var del= KISSY.Template(DOM.html('#J_Templet_Del'));
			var delLi = DOM.create(del.render(apps[''+data+'']));
			var MovingObject = DOM.clone(delLi,true);
			DOM.width(MovingObject,'229px');
			DOM.append(delLi,'#J_MainApp');
			var flag = DOM.next(parent);
			if(!flag){
				var prev = DOM.prev(parent);
			}else{
				var next = DOM.next(parent);
			}
			DOM.remove(parent);
			var lisA = DOM.children('#J_MainApp');
			var endPosition = DOM.offset(lisA[lisA.length-1]);
			if(!flag){
				DOM.insertAfter(MovingObject,prev);
			}else{
				DOM.insertBefore(MovingObject,next);
			}
			H.dashboard.moveEffects(MovingObject,startPosition,endPosition);
		},
		moveEffects : function(MovingObject,startPosition,endPosition){
			DOM.css(MovingObject,{filter:'alpha(opacity=0)',
							'-moz-opacity':1,
							'-khtml-opacity': 1,
							'opacity': 1});
			DOM.css(MovingObject,{position:"absolute",left:startPosition.left,top:startPosition.top})
			S.Anim(MovingObject, {
						position:"absolute",
						left:endPosition['left'],
						top:endPosition['top'],
						filter:'alpha(opacity=100)',
						'-moz-opacity':1,
						'-khtml-opacity': 1,
						'opacity': 1
					}, 0.8, null, function(){
						DOM.remove(MovingObject);
				}).run();
		},
		init:function(){
				var allModelSort = ['spec','tg','freepost','mjs','jtj','buyerlimit','tbspec','haibao'
        						,'tuantemplate','dapei','fenlei','kefu','guanlian','haoping'
        						,'chajian','tubiao','fensihui','list','huiyuan','shangxia'
        						,'gaiming','gaijia','chuchuang','pingjia'];
        	var appSort = "<?php $modelSort = $this->getModelSort();echo $modelSort->getData('model_sort');?>";
        	var showModel =	appSort.split(',');
        	if(!showModel[0]){
        		showModel = allModelSort.slice(0, 12);
            }
			var hideModel = allModelSort.slice(showModel.length);
        	var template= KISSY.Template(DOM.html('#J_Templet_Del'));
        	var str = '',add = '';
			S.each(showModel,function(model){
				str += template.render(apps[model]);
			})
			var a= KISSY.Template(DOM.html('#J_Templet_Add'));
			S.each(hideModel,function(model){
				add += a.render(apps[model]);
			})
			DOM.html('#J_MainApp',str);
			DOM.html('#J_AddApp',add);
			DOM.hide(DOM.query('.del'));
			DOM.hide(DOM.query('.tianjia'));

			var DDM = S.DDM,
                DraggableDelegate = S.DraggableDelegate,
                DroppableDelegate = S.DroppableDelegate,
                Draggable = S.Draggable,
                Droppable = S.Droppable,
                Scroll = S.Scroll,
                Proxy = S.Proxy,
				Node = S.Node;
            var proxy = new Proxy({
                node:function(drag) {
				   var n = new Node(drag.get('node')[0].cloneNode(true));
                    n.attr('id', S.guid('ks-dd-proxy'));
                    n.css('opacity', 0.8);
					n.css('z-index', 100);
                    return n;
                },
                destroyOnEnd:true
            });
            var dragDelegate2 = new DraggableDelegate({
                container:"#J_AddApp",
                selector:'.component2'
            });
			proxy.attach(dragDelegate2);
			  var p1;
            /**
             * 集中监听所有
             */
			 dragDelegate2.on("dragstart", function(ev) {
                var c = this;
                p1 = c.get("dragNode").css("position");
                startPosition1 = DOM.offset(c.get("dragNode"));
               
            });
            dragDelegate2.on("drag", function(ev) {
                var c = this;
                /**
                 * node 和 dragNode 区别：
                 * node : 可能是 proxy node, 指实际拖放节点
                 */
				c.get("node").offset(ev);
				
            });
            dragDelegate2.on("dragend", function(ev) {
                var c = this;
                c.get("dragNode").css("position", p1);
				var boxId = c.get("dragNode").parent()[0].id;
				if( boxId== 'J_AddApp' ){
					
				}else if( boxId == 'J_MainApp' ){
					var data = DOM.attr(c.get("dragNode"),'data');
					var del= KISSY.Template(DOM.html('#J_Templet_Del'));
					var startPosition = startPosition1
					var delLi = DOM.create(del.render(apps[''+data+'']));
					var MovingObject = DOM.clone(delLi,true);
					DOM.width(MovingObject,'229px');
					var flag = DOM.next(c.get("dragNode"));
					if(!flag){
						var prev = DOM.prev(c.get("dragNode"));
						DOM.insertAfter(delLi,prev);
					}else{
						var next = flag;
						DOM.insertBefore(delLi,next);
					}
					DOM.remove(c.get("dragNode"));
					var endPosition = DOM.offset(delLi);
					DOM.append(MovingObject,'#J_AddApp');
					H.dashboard.moveEffects(MovingObject,startPosition,endPosition);
				}	
            });
            dragDelegate2.on("dragover", function(ev) {
                var drag = ev.drag;
                var drop = ev.drop;
                var dragNode = drag.get("dragNode"),
                        dropNode = drop.get("node");
                var middleDropX = dropNode.offset().left;
                if (this.get("node").offset().left > middleDropX) {
                    var next = dropNode.next();
                    if (next && next[0] == dragNode) {
                    } else {
                        dragNode.insertAfter(dropNode);
                    }
                } else {
                    var prev = dropNode.prev();
                    if (prev && prev[0] == dragNode) {
                    } else {
                        dragNode.insertBefore(dropNode);
                    }
                }
            });
  			var dropDelegate2 = new DroppableDelegate({
                container:"#J_AddApp",
                selector:'.component2'
            });
            var s2=new Scroll({
                node:"#J_AddApp"
            });
            s2.attach(dragDelegate2); 
            Event.on('#J_EditApp','click',function(ev){
				appsBox = KISSY.one('#J_AppBox');
				if (appsBox.css("display")==="none") {
					//DOM.html(DOM.get('span',ev.currentTarget),"保存");
					DOM.show(DOM.query('.del'));
					DOM.show(DOM.query('.tianjia'));
					appsBox.slideDown();
					DOM.addClass(DOM.get('.jiantou-xia',ev.currentTarget), 'hover');
					DOM.addClass(DOM.get('#J_MainApp'), 'current');
					H.dashboard.dragDelegate1 = new DraggableDelegate({
			                container:"#J_MainApp",
			                selector:'.component1'	
			            });
			            proxy.attach(H.dashboard.dragDelegate1);
			             var dropDelegate1 = new DroppableDelegate({
			                container:"#J_MainApp",
			                selector:'.component1'
			            });
			             var p;
			            /**
			             * 集中监听所有
			             */
			             H.dashboard.dragDelegate1.on("dragstart", function(ev) {
			                var c = this;
			                p = c.get("dragNode").css("position");
			                startPosition2 = DOM.offset(c.get("dragNode"));
			            });
			             H.dashboard.dragDelegate1.on("drag", function(ev) {
			                var c = this;
			                /**
			                 * node 和 dragNode 区别：
			                 * node : 可能是 proxy node, 指实际拖放节点
			                 */
							c.get("node").offset(ev);
			            });
			             H.dashboard.dragDelegate1.on("dragend", function(ev) {
			                var c = this;
			                c.get("dragNode").css("position", p);
							var boxId = c.get("dragNode").parent()[0].id;
							if( boxId== 'J_MainApp' ){
							}else if( boxId == 'J_AddApp' ){
								var data = DOM.attr(c.get("dragNode"),'data');
								var startPosition = startPosition2;
								var add= KISSY.Template(DOM.html('#J_Templet_Add'));
								var addLi = DOM.create(add.render(apps[''+data+'']));
								var MovingObject = DOM.clone(addLi,true);
								DOM.width(MovingObject,'92px');
								DOM.append(addLi,'#J_AddApp');
								var flag = DOM.next(c.get("dragNode"));
								if(!flag){
									var prev = DOM.prev(c.get("dragNode"));
									DOM.insertAfter(addLi,prev);
								}else{
									DOM.insertBefore(addLi,flag);
								}
								DOM.remove(c.get("dragNode"));
								var endPosition = DOM.offset(addLi);
								DOM.append(MovingObject,'#J_MainApp');
								H.dashboard.moveEffects(MovingObject,startPosition,endPosition)
							}
			            });
			             H.dashboard.dragDelegate1.on("dragover", function(ev) {
			                var drag = ev.drag;
			                var drop = ev.drop;
			                var dragNode = drag.get("dragNode"),
			                    dropNode = drop.get("node");
			                var middleDropX = dropNode.offset().left;
							
			                if (this.get("node").offset().left > middleDropX) {
			                    var next = dropNode.next();
			                    if (next && next[0] == dragNode) {
			                    } else {
			                        dragNode.insertAfter(dropNode);
			                    }
			                } else {
			                    var prev = dropNode.prev();
			                    if (prev && prev[0] == dragNode) {
			                    } else {
			                        dragNode.insertBefore(dropNode);
			                    }
			                }
			            });
			            var s1=new Scroll({
			                node:"#J_MainApp"
			            });
			            s1.attach(H.dashboard.dragDelegate1);
				}else{
					//DOM.html(DOM.get('span',ev.currentTarget),"更换功能列表");
					DOM.hide(DOM.query('.del'));
					DOM.hide(DOM.query('.tianjia'));
					appsBox.slideUp();
					DOM.removeClass(DOM.get('.jiantou-xia',ev.currentTarget),'hover');
					DOM.removeClass(DOM.get('#J_MainApp'), 'current');
					H.dashboard.dragDelegate1.destroy();
			 		var lis = DOM.children('#J_MainApp');
			 		var array = [];
			 		S.each(lis,function(li){
			 			array.push(DOM.attr(li,'data'));
				 	})
				 	var model_sort = array.join(',');
			 		KISSY.io.get(saveModelSortUrl,{
			 			model_sort:model_sort
					});
				}
				var $ = S.Node.all;
				if(S.one('#J_EditApp')){
					var s =  S.one('#JJJJ').offset();
							$(window).stop();
							$(window).animate({
							scrollTop:s.top
								},1,"easeOut");
				}

        	})
    		var tabs = new S.Tabs('#J_main',{
    			triggerType: 'mouse',
    			contentCls:'ks-main-content',
    			activeTriggerCls: 'current'	
    		}).on('switch',function(ev){
    				var index = ev.currentIndex;
    				if(index == 1){
    					DOM.hide(DOM.query('.piaofu')[0]);
    					DOM.show(DOM.query('.piaofu')[1]);
    				}else{
    					DOM.hide(DOM.query('.piaofu')[1]);
    					DOM.show(DOM.query('.piaofu')[0]);	
    				}
    		})
    		Event.delegate(document,'click','.del', function(ev) {
        		var parent = DOM.parent(DOM.parent(ev.currentTarget));
				var data = DOM.attr(parent,'data');
    			H.dashboard.deleApp(data,parent);
  			});
    		Event.delegate(document,'click','.add', function(ev) {
    			var parent = DOM.parent(DOM.parent(ev.currentTarget));
    			var data = DOM.attr(parent,'data');
    			H.dashboard.addApp(data,parent);
  			});
    	    Event.delegate(document,'mouseenter mouseleave','.J_Bitem',function(ev){
    			DOM.toggleClass(ev.currentTarget,"current");
    		});
            Event.delegate(document,'mouseenter mouseleave','.J_Titem',function(ev){
                var del = DOM.get('.del',ev.currentTarget);
    			DOM.toggleClass(del,"hover");
    		});

            KISSY.use('node,overlay', function(S, Node, O) {
    		    //通过dom元素新建立popup
    		     var popup1 = new KISSY.Popup(KISSY.Node.one("#J_PricePromoAll"), {
    		    	 srcNode :'#J_PricePromo',
    		         trigger : '#J_PricePromo',//配置Popup的触发器
    		         triggerType : 'mouse',    //触发类型
    		         align : {
    		            node : '#J_PricePromo',
    		            points : ['bl', 'tl'],
    		            offset : [-1, 0]
    		         }
    		    });
    		    popup1.render();
    		    popup1.hide();
    		    DOM.removeClass('#J_PricePromoAll','ks-overlay');
    		    DOM.css('.ks-contentbox','border','0px'); 
    		    popup1.on('beforeVisibleChange',function(ev){
    		    	if(ev.newVal == true){
    		    		DOM.addClass('#J_PriceContent','current');
    			    }else if(ev.newVal == false){
    			    	DOM.removeClass('#J_PriceContent','current');
    				}
    			})
    			 var popup2 = new KISSY.Popup(KISSY.Node.one("#J_PriceBiaoAll"), {
    		    	 srcNode :'#J_PriceBiao',
    		         trigger : '#J_PriceBiao',//配置Popup的触发器
    		         triggerType : 'mouse',    //触发类型
    		         align : {
    		            node : '#J_PriceBiao',
    		            points : ['bl', 'tl'],
    		            offset : [-1, 0]
    		         }
    		    });
    		    popup2.render();
    		    popup2.hide();
    		    DOM.removeClass('#J_PriceBiaoAll','ks-overlay');
    		    DOM.css('.ks-contentbox','border','0px'); 
    		    popup2.on('beforeVisibleChange',function(ev){
    		    	if(ev.newVal == true){
    		    		DOM.addClass('#J_PriceBiaoContent','current');
    			    }else if(ev.newVal == false){
    			    	DOM.removeClass('#J_PriceBiaoContent','current');
    				}
    			})
            })
			
			
		}		
		
	};
   
    return this.MarkList
})