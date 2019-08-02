function ShowDiv(ObjID) {
	for(var i=1;i<5;i++) {
		if(document.getElementById("title_"+i)) {
			document.getElementById("title_"+i).className=(ObjID==i)?"cur":"";
			document.getElementById("newsul_"+i).className=(ObjID==i)?"cur":"";
		} else return;
	}
}

function ShowDiv2(ObjID) {
	for(var i=1;i<5;i++) {
		if(document.getElementById("name_"+i)) {
			document.getElementById("name_"+i).className=(ObjID==i)?"cur":"";
			document.getElementById("search_"+i).className=(ObjID==i)?"cur":"";
		} else return;
	}
}

function ShowDiv3(ObjID) {
	for(var i=1;i<14;i++) {
		if(document.getElementById("tablist_title"+i)) {
			document.getElementById("tablist_title"+i).className=(ObjID==i)?"cur":"";
			document.getElementById("showdiv3_"+i).style.display=(ObjID==i)?"block":"none";
		} else return;
	}
}
function ShowDiv4(ObjID) {
	for(var i=1;i<4;i++) {
		if(document.getElementById("rigtitle_"+i)) {
			document.getElementById("rigtitle_"+i).className=(ObjID==i)?"cur":"";
			document.getElementById("garden_nav"+i).className=(ObjID==i)?"cur":"";
		} else return;
	}
}


$(function(){
	/*Img Max-width*/
	$(".edittext img").each(function(){
		if($(this).width() > $(this).parents('.edittext').width()){
			$(this).width("100%");
			$(this).height("auto");
		}
	});

	$('.hoverlist li, .hovertable tbody tr').mouseover(function(){
		$(this).addClass('cur');
	}).mouseout(function(){
		$(this).removeClass('cur');
	});

	/*Img Loading*/
	//$('.productsort .img, .productlist .img img').attr("src", function() { return this.name });

	

	//$('.listdl_ctrl dt:first').addClass('cur');
	//$('.listdl_ctrl dd:first').show();
	$('.listdl_ctrl > dt').click(function(){
		if($(this).hasClass('cur')){
			$(this).removeClass('cur').next('dd').slideUp();
		}else {
			$(this).addClass('cur').siblings().removeClass('cur');
			$(this).next('dd').slideDown().siblings('dd').slideUp();
		}
	});

	$('.sidebarinfo ul li').mouseover(function(){
		$(this).addClass('cur');
	}).mouseout(function(){
		$(this).removeClass('cur');
	});

	$('.navigation > ul > li').each(function(){
		$(this).mouseover(function(){
			$(this).addClass('cur')
		}).mouseout(function(){
			$(this).removeClass('cur')
		})
	});

	$('body').append('<div class="hovertips_show"></div>');
	$('.hovertips').hover(function(){
		var _this = $(this)
		$('.hovertips_show').show().html(_this.attr('data-tips')).css({
			'left':_this.offset().left,
			'top':_this.offset().top
		})
	}, function(){
		$('.hovertips_show').hide();
	})




});


function refreshCode()
{
	$('.code_class').attr("src", __ctx + '/kaptcha.do?seed=' + Math.random());
}

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {   
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {   
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);   
    } else {   
        return this.replace(reallyDo, replaceWith);   
    }   
}

function guolv(value,replaceWith){
var zifu=["'","\"","\\\'","\\\"","\\)","\\*",";","<",">","%","\\(","\\|","&","\\+","$","@","\r","\n",",","select "," and "," in "," or ","insert ","delete ","update ","drop "];

	for(i=0;i<zifu.length;i++){	
		value = value.replaceAll(zifu[i],replaceWith);				
	}
	document.BibFrm.v_value.value = value;
}