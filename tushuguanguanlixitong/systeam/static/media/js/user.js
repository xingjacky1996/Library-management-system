/*我的空间*/
$(function(){
	$("#usernav>li>a").on("click",function(e){

		var p = $(this).parents("li");
		if(p.attr("id")=="mszy") return;
		p.addClass('cur').siblings('li').removeClass('cur');
	});
		$(".userinfobox .row.no-gutter:nth-child(odd)").css("background-color","#f9f9f9");
});


