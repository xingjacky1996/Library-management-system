/*滚动导航条*/
jQuery.scrollNav = function(){
	var option = {
		"box" : ".scrollNav",
		"left" : ".nav_left",
		"right" : ".nav_right",
		"sbox" : ".nav-menu-scroll",
		"sitem" : "li",
		"bbox" :".nav-box"
	}
	$(option.box).each(function(){
		var t = $(this);
        var __nav =t; //总的大框
        var __nav2 = t.find(option.sbox); //链接框
        var __left = t.find(option.left);
        var __right = t.find(option.right);
       
      
        __left.on("click",function() {

        	var box = t.find(option.bbox).width();//包住链接的框
       		

        	var ll= Number(__nav2.css("left").replace("px",""))+box;

              if(ll+box<=box ){
	             
	             __nav2.animate({"left":ll+"px"});
	            }
        });

       __right.on("click",function() {
       		/*内容小于链接框*/	
       		var box = t.find(option.bbox).width(); //包住链接的框
       		
       		var ww = __nav2.width();
            var w = box-ww;
            
            /*判断内容是否需要滚动*/
            if(w<0){
            	/*内容大于链接框*/

            	var ll= Number(__nav2.css("left").replace("px",""))-box;
            	
             	if(ll+ww>0 ){


             		//console.log(ll);
            		 __nav2.animate({"left":ll+"px"});
            	  }
             
            }
             
        });
	});

	var lv2Nav = function(){

		var t = $("#lv2box .scrollNav");
        var __nav =t; //总的大框
        var __nav2 = t.find(option.sbox); //链接框
        var __left = t.find(option.left);
        var __right = t.find(option.right);
       
      
        __left.on("click",function() {

        	var box = t.find(option.bbox).height();//包住链接的框
       		var cur = $("#navslv2 .nav-menu-scroll").data("cur");

        	var ll= Number(__nav2.css("top").replace("px",""))+box;

              if(ll+box<=box ){
	             $("#nav-lv1>li>a").eq(cur).data("top",ll);

	             __nav2.animate({"top":ll+"px"});
	            }
        });

       __right.on("click",function() {
       		/*内容小于链接框*/	
       		var box = t.find(option.bbox).height(); //包住链接的框
       		var cur = $("#navslv2 .nav-menu-scroll").data("cur");
       		var ww = __nav2.height();
            var w = box-ww;
            // alert(w);
            /*判断内容是否需要滚动*/
            if(w<0){
            	/*内容大于链接框*/

            	var ll= Number(__nav2.css("top").replace("px",""))-box;
            	// console.log(ll);
             	if(ll+ww>0 ){
             		$("#nav-lv1>li>a").eq(cur).data("top",ll);
            		 __nav2.animate({"top":ll+"px"});
            	  }
             
            }
             
        });
	}

	var lv3Nav = function(){
		/*翻页按钮控制*/
		function btns(cur,max,nav){
			
			var prev = nav.find(".nav3prev");
			var next = nav.find(".nav3next");
			prev.show();
			next.show();
			if(cur == 1){
				prev.hide();
			}
			if(cur >= max ){
				next.hide();

			}
			/*var nav1 = $(this).find(".nav-lv3-link").children('li');
			var o = nav1%4;
			var m = max - cur ;
			alert(m+""+)
			if(m == 1 && o ==0){
				next.hide();
			}*/
		}

		if($(".nav-lv3").length<0){
			return;
		}else{
			var nav3box = $(".nav-lv3");
			nav3box.each(function(){
				var nav = $(this).find(".nav-lv3-link");

				$(this).find(".icon-enter").remove();			
				var lv3 = nav.children('li');
				// 添加4级导航样式
				lv3.each(function(index, el) {
					var t = $(this);
					if(t.find(".nav-lv4-link li").length>0){
						t.addClass('hasNode');
					}					
				});
				/*初始化三级导航列表*/
				if(lv3.length>4){
					nav.attr("data-cur",1);
					nav.before('<a title="导航翻页" class="icon-enter2 nav3prev"></a>');
					nav.after('<a title="导航翻页" class="icon-enter3 nav3next"></a>');
					// nav.children("li.active").prependTo(nav);
					var i = nav.children("li.active").index()+1;
					
					var cur = Math.ceil(i/4);
					if(cur == 0){
						cur = 1
					}
					
					var max = Math.ceil(lv3.length/4);
					var n = parseInt(cur)*4-4;
					var m = 3;
					lv3.hide();
					nav.children('li:gt('+n+'):lt('+m+')').show();
					nav.children('li').eq(n).show();
					nav.attr("data-cur",cur);
					nav.attr("data-max",max);
					//nav.children('li:nth-child(n+5)').hide();
					btns(cur,max,$(this));
					$(this).find('.nav3next').addClass('action');
					$(this).find('.nav3prev').addClass('action');

				}
			});
			
			// 事件绑定
			var add = function(){
				
						
				var nav = $(this).parents(".nav-lv3").children('.nav-lv3-link');
				var lv3 = nav.children('li');
				var cur = nav.attr("data-cur");
				// var max = nav.attr("data-max");
				var max = Math.ceil(lv3.length/4);
				// console.log(nav);
				var n = parseInt(cur)*4-1;
				var m = 4;
				
				cur++;
				var o = lv3.length%4;
				
				if(cur>max && o == 0) return;
				nav.attr("data-cur",cur);
				lv3.hide();
				nav.children('li:gt('+n+'):lt('+m+')').show();
				
				btns(cur,max,$(this).parents(".nav-lv3"));
				

			};
			var minus = function(){
				
				var nav = $(this).parents(".nav-lv3").children('.nav-lv3-link');
				var lv3 = nav.children('li');
				var cur = nav.attr("data-cur");
				// var max = nav.attr("data-max");
				var max = Math.ceil(lv3.length/4);

				// console.log(nav);
				cur--;
				var n = parseInt(cur)*4-4;
				
				var m = 3;
				
				// var max = Math.floor(lv3.length/4);
				
				if(cur<0) return;

				nav.attr("data-cur",cur);
				lv3.hide();
				nav.children('li:gt('+n+'):lt('+m+')').show();
				nav.children('li').eq(n).show();
				// nav.children("li.active").show();
				btns(cur,max,$(this).parents(".nav-lv3"));
				
			}
		
			$('.nav3next.action').on("click",add);
			$('.nav3prev.action').on("click",minus);

		}
	}
	lv2Nav();
	lv3Nav();

	var zhuanti  = function(){

	}
}

/*搜索框V1*/
 	jQuery.divselectV1 = function(){

	       var dom = $(arguments[0]);
	        dom.each(function(){
	           var main = $(this);
	            main.children('div').click(function(){
	                    var ul = main.children('ul');
	                    if(ul.css("display")=="none"){
	                        dom.children('ul:visible').slideUp("fast");
	                        ul.slideDown("fast");
	                    }else{
	                        ul.slideUp("fast");
	                    }
	            });
	            main.children('div').mouseenter(function(){
	                    var ul = main.children('ul');
	                    if(ul.css("display")=="none"){
	                        dom.children('ul:visible').slideUp("fast");
	                        ul.slideDown("fast");
	                    }
	            });
	            main.parents(".search_box ").mouseleave(function(){
	                    var ul = main.children('ul');
	                     ul.slideUp("fast");
	            });
	            main.children('ul').children('li').children('a').click(function(){
	                      var txt = "书目检索";
	            	var value = $(this).attr("selectid");
	            	if("" != value && value !=null && typeof(value)!="undefinded"){
	            		if(value == "0"){
	            			txt = $(this).text();
	            			$("#divselect1").show();
	            			$("#sb2").show();
	            		}else if(value == "1"){
	            			txt = $("#smjs").text();
	            			value = "0";
	            			$("#sb2").show();

	            		}else if(value == "2"){
	            			txt = $(this).text();
	            			$("#divselect1").hide();
	            			$("#sb2").hide();

	            		}else{
	            			txt = $(this).text();
	            			$("#inputselect1").val(value);
	            			$("#sb2").show();

	            		}
	            	}
	                main.children('div').html(txt);
	                main.children('input').val(value);
	                main.children('ul').hide();
	            });
	        });
	}

/*textarea自动增高*/
$.fn.autoHeight = function(){
	
	function autoHeight(elem){
		elem.style.height = 'auto';
		elem.scrollTop = 0; //防抖动
		elem.style.height = elem.scrollHeight + 'px';
	}
	
	this.each(function(){
		autoHeight(this);
		$(this).on('keyup', function(){
			autoHeight(this);
		});
	});
 
}


/*页面高度控制*/
jQuery.pageHeightAuto = function(){
	
	var w = $(window).height();
	
	var footer = $(".footer").height();

	var page = $(".pagecontent");
	page.css({
		"min-height": w- footer-45
	});
	$(window).on("resize",function(){
		var w = $(window).height();
		page.css({
			"min-height": w- footer-45
		});
	});

}

jQuery.filterText = function(){
	$("input[type=text],textarea").on("blur",function(){
		var g = /["'<>$%;&()+]/g;
		var flag = g.test($(this).val());

		var v = $(this).val().replace(/["'<>$%;&()+]/g, "");
	 	$(this).val(v);
		if(flag){
			Dialog.alert('请不要输入"\'<>$%;&()+这些字符');
		}
		

	})

}

$(function() {
	$('textarea[autoHeight]').autoHeight();
	$.pageHeightAuto();
	$.divselectV1("._divselect");
	
	$.filterText();

	// 切换注册按钮
	$(".showreg-btn").on("click",function(e){

		$(".top-reg").toggle();
	});

	// 访问统计
	function visitotal(){
		var _total = $('#visitotal');
		var _text = _total.text();

		var _html = "";
		_text = _text.split("");
		for(i=0;i<_text.length;i++){
			_html+='<span>'+_text[i]+'</span>'
		}
		_total.html(_html);	
	}
	visitotal();

	//tab
	//tab面板
 		$(".tab .tab-index a").on("click",function(e){
 			var t = $(this);
 			var ind = t.index();
 			// console.log(t.parents('.tab').length);
 			t.parents('.tab').find('.tab-content').eq(ind).addClass('active').siblings().removeClass("active");
 			t.addClass('active').siblings().removeClass("active");
 		});

	//各种导航
	var lastClick=0;
	var nav = {
		
		nav2init:function(){
			
			var lv2nav = $("#navslv2 .nav-menu-scroll");
			lv2nav.data('cur', null);
			lv2nav.data('top', '0');

			var _html = $("#nav-lv1 li.active ul").html();
			lv2nav.css("top",0).html(_html);
			if($("#nav-lv1 li.active ul li").length<=0){
					$("#lv2box").hide();
			}

			$("#nav-lv1>li>a").on("mouseenter",function(event){

				var t = $(this).parent("li");
				var index = t.index();
				var cur = lv2nav.data('cur');

					lv2nav.data('cur', index);
					var top = $(this).data("top");
					if(top=="undefinded" || top==null){
						top=0
					}
					
					t.siblings('li').removeClass('active');
					t.addClass('active').siblings('li').removeClass("active");

					var nav = t.find("ul");
					if(nav.find('li').length>0){
						event.stopPropagation();
						event.preventDefault();
						
						
						
						var html = nav.html();
						$("#navslv2 .nav-menu-scroll").css("top",top).html(html);
						$("#lv2box").stop().css({"display":"block"})
						var box1 = $("#navslv2").height();
						var box2 = $("#navslv2 .nav-menu-scroll").height();
						var h = box2>=88?88:44;
						$("#lv2box").animate({"height":h+"px"},200).addClass("open");

						if(box1>=box2 && box2<=88){
							$("#lv2box .nav_left,#lv2box .nav_right").css("opacity",0);
						}else{
							$("#lv2box .nav_left,#lv2box .nav_right").css("opacity",1);

						}
					}else{
						$("#lv2box").stop().animate({"height":0},200,function(){$("#lv2box").css("display","none")}).removeClass("open");
					}
				
				
			});

			/*
			$("#lv2box").stop().animate({"height":0},200).removeClass("open");
			$("#lv2box").stop().css({"display":"block","height":"0"}).animate({"height":44},200).addClass("open");


			$(".channel_nav").on("mouseleave",function(){
					$("#lv2box .nav_left,#lv2box .nav_right").css("opacity",1);

					$("#lv2box").stop().animate({"height":0},200).removeClass("open");

			});*/
			$(".channel_nav").on("mouseleave",function(){
					$("#lv2box .nav_left,#lv2box .nav_right").css("opacity",1);

					$("#lv2box").stop().animate({"height":0},200,function(){$("#lv2box").css("display","none")}).removeClass("open");

			});
			
			
			$("#nav-lv1>li>a").unbind("click").click(function(event){
				var url = $(this).attr("href");
				location.href=url;
	/*			var t = $(this).parent("li");
				var index = t.index();
				var cur = lv2nav.data('cur');
				

				if(index == cur&&$("#lv2box").height()>0){
					
					event.stopPropagation();
					event.preventDefault();

					$("#lv2box").stop().animate({"height":0},200,function(){$("#lv2box").css("display","none")}).removeClass("open");

					
					return ;
				}else if(index == cur){
					
					var nav = t.find("ul");
					if(nav.find('li').length>0){
						event.stopPropagation();
						event.preventDefault();
						$("#lv2box").stop().css({"display":"block"}).animate({"height":"44px"},200).addClass("open");

					}
					
					return ;
				}else {
					
					
					lv2nav.data('cur', index);
					var top = $(this).data("top");
					if(top=="undefinded" || top==null){
						top=0
					}
					
					t.siblings('li').removeClass('active');
					t.addClass('active').siblings('li').removeClass("active");

					var nav = t.find("ul");
					if(nav.find('li').length>0){
						event.stopPropagation();
						event.preventDefault();
						
						var html = nav.html();
						$("#navslv2 .nav-menu-scroll").css("top",top).html(html);
						$("#lv2box").stop().css({"display":"block"})
						var box1 = $("#navslv2").height();
						var box2 = $("#navslv2 .nav-menu-scroll").height();
						var h = box2>=88?88:44;
						$("#lv2box").animate({"height":h+"px"},200).addClass("open");

						if(box1>=box2 && box2<=88){
							$("#lv2box .nav_left,#lv2box .nav_right").css("opacity",0);
						}else{
							$("#lv2box .nav_left,#lv2box .nav_right").css("opacity",1);

						}
					}else{
						
						$("#lv2box").stop().animate({"height":0},200,function(){$("#lv2box").css("display","none")}).removeClass("open");
					}
				}*/
		     });

		},
		nav3:function(){
			// $("#navlv3>li.active").prependTo("#navlv3");
			$("#navlv3>li>a").on("click",function(event){

				var t = $(this).parent("li");
				
				var nav = t.find(".nav-lv4");
				if(nav.find('li').length>0){
					event.stopPropagation();
					event.preventDefault();
					t.siblings('li').removeClass('open');
					t.toggleClass('open');
					// var right = 980-t.offset().left+nav.width()/2+t.width()/2;
					nav.css("right",0);
				}
				
			});

			
		}
	}
	nav.nav2init();
	
	nav.nav3();
	$.scrollNav();
	//小型搜索框
	$("#searchToggle").on("click",function(){
		$(this).toggleClass('open');
		$("#searchbox2").toggleClass('open');
	});

	//大搜索按钮
	$(".submitSearch").on("click",function(){
		$("#searchToggle").toggleClass('open');
		$("#searchbox2").toggleClass('open');
	});


	/*侧边导航*/
	$("#sicons").on("mouseover",".si-3",function(e){
		$(this).children('.wb-box').show();
	});
	$("#sicons").on("mouseleave",".si-3",function(e){
		$(this).children('.wb-box').hide();
	});

	$("#sicons").on("mouseover",".si-4",function(e){
		$(this).children('.side-qr').show();
	});
	$("#sicons").on("mouseleave",".si-4",function(e){
		$(this).children('.side-qr').hide();
	});
});
function checkSousoType(){
	Cms.pageSiteLink("","${location}","检索","页面检索按钮");
	var keyword = $("input[name=q]").val();
	var hotsearch = $("input[name=hotsearch]").val();
	if(hotsearch != keyword){
		if(""!=keyword&&keyword!=null&&typeof(keyword)!="undefined"){
			var searchType = $("#inputselect").val();
			if("" !=searchType&&searchType !=null && typeof(searchType)!="undefinded"){
				if(searchType == "0"){
					var keywordtype = $("#inputselect1").val();
					
					var q = encodeURIComponent(keyword);
					
					window.open("http://opac.gzlib.gov.cn/opac/search?searchSource=reader&scWay=dim&sortWay=score&sortOrder=desc&rows=10&hasholding=1&curlibcode=GT&searchWay="+keywordtype+"&q="+q);
					//document.location.href="http://opac.gzlib.gov.cn/opac/search?searchSource=reader&scWay=dim&sortWay=score&sortOrder=desc&rows=10&hasholding=1&curlibcode=GT&searchWay="+keywordtype+"&q="+q;
				}else if(searchType == "2"){
					$("input[name='queryq']").val(keyword);
					$("#qFrom").submit();
				}
			}
		}
	}
}
//用于页面中文转码
var easyUTF8 = function(gbk){  
    if(!gbk){return '';}  
    var utf8 = [];  
    for(var i=0;i<gbk.length;i++){  
        var s_str = gbk.charAt(i);  
        if(!(/^%u/i.test(escape(s_str)))){utf8.push(s_str);continue;}  
        var s_char = gbk.charCodeAt(i);  
        var b_char = s_char.toString(2).split('');  
        var c_char = (b_char.length==15)?[0].concat(b_char):b_char;  
        var a_b =[];  
        a_b[0] = '1110'+c_char.splice(0,4).join('');  
        a_b[1] = '10'+c_char.splice(0,6).join('');  
        a_b[2] = '10'+c_char.splice(0,6).join('');  
        for(var n=0;n<a_b.length;n++){  
            utf8.push('%'+parseInt(a_b[n],2).toString(16).toUpperCase());  
        }  
    }  
    return utf8.join('');  
};


function __qrCode(){
	var html = '<div id="_big_qr" class="big-qr" onclick="$(this).hide()">'
        +'<img src="/r/cms/www/lasttemp/images/qr.jpg" title="二维码" class="qrimg" />'
        +'<a onclick="__qrHide()" class="closeBtn"></a></div>';
    
    var qr = $("#_big_qr");
    if(qr.length>0){
    	qr.show();
    }else{
    	$("body").append(html);
    	$("#_big_qr").show();
    }
}

function __qrHide(){
	$("#_big_qr").hide();
}