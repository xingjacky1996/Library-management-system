//前台栏目相关js
Cms = {};
/**
 * 浏览次数
 */
Cms.viewCount = function(base, contentId, viewId, commentId, downloadId, upId,
		downId) {
	viewId = viewId || "views";
	commentId = commentId || "comments";
	downloadId = downloadId || "downloads";
	upId = upId || "ups";
	downId = downId || "downs";
	$.getJSON(base + "/content_view.jspx", {
		contentId : contentId
	}, function(data) {
		if (data.length > 0) {
			$("#" + viewId).text(data[0]);
			$("#" + commentId).text(data[1]);
			$("#" + downloadId).text(data[2]);
			$("#" + upId).text(data[3]);
			$("#" + downId).text(data[4]);
		}
	});
}
/**
 * 站点流量统计
 */
Cms.siteFlow = function(base, page, referer,flag,pvId, visitorId) {
	pvId = pvId || "pv";
	visitorId = visitorId || "visitor";
	flag = flag || 1;
	$.getJSON(base + "/flow_statistic.jspx", {
		page : page,
		referer : referer
	}, function(data) {
		if(flag==1){
			if (data.length > 0) {
				if(page.indexOf("gtapp.jspx")>0){
					$("#" + pvId).text(data[0]);
				}else{
					var pv = data[0].toString().split("");
					var pvString="";
					for(var i = 0;i<pv.length;i++){
						pvString=pvString+"<img src=\"../r/cms/www/default/images/no_"+pv[i]+".gif\" />";
					}
					$("#" + pvId).html(pvString);
				}
				$("#" + visitorId).text(data[1]);
			}
		}
	});
}
/**
 * 页面链接点击记录统计
 */
Cms.pageSiteLink = function(base, pageLink,linkName,explain) {
	
	$.post(base + "/flow_siteLink.jspx", {
		pageLink:pageLink,
		linkName:linkName,
		explain:explain
	}, function(data) {
	});
}
/**
 * 成功返回true，失败返回false。
 */
Cms.up = function(base, contentId, origValue, upId) {
	upId = upId || "ups";
	var updown = $.cookie("_cms_updown_" + contentId);
	if (updown) {
		return false;
	}
	$.cookie("_cms_updown_" + contentId, "1");
	$.get(base + "/content_up.jspx", {
		"contentId" : contentId
	}, function(data) {
		$("#" + upId).text(origValue + 1);
	});
	return true;
}
/**
 * 成功返回true，失败返回false。
 */
Cms.down = function(base, contentId, origValue, downId) {
	downId = downId || "downs";
	var updown = $.cookie("_cms_updown_" + contentId);
	if (updown) {
		return false;
	}
	$.cookie("_cms_updown_" + contentId, "1");
	$.get(base + "/content_down.jspx", {
		contentId : contentId
	}, function(data) {
		$("#" + downId).text(origValue + 1);
	});
	return true;
}
/**
 * 获取评分选项投票数
 */
Cms.scoreCount = function(base, contentId,itemPrefix) {
	itemPrefix=itemPrefix||"score-item-";
	$.getJSON(base + "/content_score_items.jspx", {
		contentId : contentId
	}, function(data) {
			$("span[id^='"+itemPrefix+"']").each(function(){
				var itemId=$(this).prop("id").split(itemPrefix)[1];
				$(this).text(data.result[itemId]);
			});
	});
}
/**
 * 成功返回true，失败返回false。
 */
Cms.score = function(base, contentId,itemId,itemPrefix) {
	itemPrefix=itemPrefix||"score-item-";
	var score = $.cookie("_cms_score_" + contentId);
	if (score) {
		return false;
	}
	$.cookie("_cms_score_" + contentId, "1");
	$.get(base + "/content_score.jspx", {
		"contentId" : contentId,
		"itemId":itemId
	}, function(data) {
		if(data.succ){
			$("#"+itemPrefix + itemId).text(data.count);
		}
	});
	return true;
}
/**
 * 获取附件地址
 */
Cms.attachment = function(base, contentId, n, prefix) {
	$.get(base + "/attachment_url.jspx", {
		"cid" : contentId,
		"n" : n
	}, function(data) {
		var url;
		for (var i = 0;i < n; i++) {
			url = base + "/attachment.jspx?cid=" + contentId + "&i=" + i
					+ data[i];
			$("#" + prefix + i).attr("href", url);
		}
	}, "json");
}
/**
 * 提交评论
 */
Cms.comment = function(callback, form) {
	form = form || "commentForm";
	$("#" + form).validate( {
		submitHandler : function(form) {
			$(form).ajaxSubmit( {
				"success" : callback,
				"dataType" : "json"
			});
		}
	});
}
/**
 * 获取评论列表
 * 
 * @param siteId
 * @param contentId
 * @param greatTo
 * @param recommend
 * @param orderBy
 * @param count
 */
Cms.commentList = function(base, c, options) {
	c = c || "commentListDiv";
	$("#" + c).load(base + "/comment_list.jspx", options);
}

Cms.childCommentList = function(base, c, options) {
	c = c || "commentListDiv";
	$("#" + c).load(base + "/childSite/comment_list.jspx", options);
}
/**
 * 客户端包含登录
 */
Cms.loginCsi = function(base, c, options) {
	c = c || "loginCsiDiv";
	$("#" + c).load(base + "/login_csi.jspx", options);
}
/**
 * 向上滚动js类
 */
Cms.UpRoller = function(rid, speed, isSleep, sleepTime, rollRows, rollSpan,
		unitHight) {
	this.speed = speed;
	this.rid = rid;
	this.isSleep = isSleep;
	this.sleepTime = sleepTime;
	this.rollRows = rollRows;
	this.rollSpan = rollSpan;
	this.unitHight = unitHight;
	this.proll = $('#roll-' + rid);
	this.prollOrig = $('#roll-orig-' + rid);
	this.prollCopy = $('#roll-copy-' + rid);
	// this.prollLine = $('#p-roll-line-'+rid);
	this.sleepCount = 0;
	this.prollCopy[0].innerHTML = this.prollOrig[0].innerHTML;
	var o = this;
	this.pevent = setInterval(function() {
		o.roll.call(o)
	}, this.speed);
}
Cms.UpRoller.prototype.roll = function() {
	if (this.proll[0].scrollTop > this.prollCopy[0].offsetHeight) {
		this.proll[0].scrollTop = this.rollSpan + 1;
	} else {
		if (this.proll[0].scrollTop % (this.unitHight * this.rollRows) == 0
				&& this.sleepCount <= this.sleepTime && this.isSleep) {
			this.sleepCount++;
			if (this.sleepCount >= this.sleepTime) {
				this.sleepCount = 0;
				this.proll[0].scrollTop += this.rollSpan;
			}
		} else {
			var modCount = (this.proll[0].scrollTop + this.rollSpan)
					% (this.unitHight * this.rollRows);
			if (modCount < this.rollSpan) {
				this.proll[0].scrollTop += this.rollSpan - modCount;
			} else {
				this.proll[0].scrollTop += this.rollSpan;
			}
		}
	}
}
Cms.LeftRoller = function(rid, speed, rollSpan) {
	this.rid = rid;
	this.speed = speed;
	this.rollSpan = rollSpan;
	this.proll = $('#roll-' + rid);
	this.prollOrig = $('#roll-orig-' + rid);
	this.prollCopy = $('#roll-copy-' + rid);
	this.prollCopy[0].innerHTML = this.prollOrig[0].innerHTML;
	var o = this;
	this.pevent = setInterval(function() {
		o.roll.call(o)
	}, this.speed);
}
Cms.LeftRoller.prototype.roll = function() {
	if (this.proll[0].scrollLeft > this.prollCopy[0].offsetWidth) {
		this.proll[0].scrollLeft = this.rollSpan + 1;
	} else {
		this.proll[0].scrollLeft += this.rollSpan;
	}
}
/**
 * 收藏信息
 */
Cms.collect = function(base, cId, operate,showSpanId,hideSpanId) {
	$.post(base + "/member/collect.jspx", {
		"cId" : cId,
		"operate" : operate
	}, function(data) {
		if(data.result){
			if(operate==1){
				Dialog.alert("收藏成功！");
				$("#"+showSpanId).show();
				$("#"+hideSpanId).hide();
			}else{
				Dialog.alert("取消收藏成功！");
				$("#"+showSpanId).hide();
				$("#"+hideSpanId).show();
			}
		}else{
			if(data.state==1){
				Dialog.alert("请先登录");
			}else if(data.state==2){
				Dialog.alert("收藏失败！");
			}else if(data.state==3){
				Dialog.alert("收藏失败！");
			}else if(data.state==4){
				Dialog.alert("该书不能收藏");
			}
		}
	}, "json");
}
/**
 * 列表取消收藏信息
 */
Cms.cmsCollect = function(base, cId, operate,bookrecno) {
	$.post(base + "/member/collect.jspx", {
		"cId" : cId,
		"operate" : operate,
		"bookrecno" : bookrecno
	}, function(data) {
		if(data.result){
			if(operate==1){
				Dialog.alert("收藏成功!");
			}else{
				Dialog.alert("删除收藏成功!",function(){
					location.href=location.href;
				});
				
			}
		}else{
			if(data.state == 1){
				Dialog.alert("登录超时，请重新登录!");
			}else if(data.state == 2){
				Dialog.alert("删除失败，该收藏不存在。");
			}else if(data.state == 3){
				Dialog.alert("删除失败，接口调用异常或参数异常。");
			}
		}
	}, "json");
}
/**
 * 检测是否已经收藏信息
 */
Cms.collectexist = function(base, cId,showSpanId,hideSpanId) {
	$.post(base + "/member/collect_exist.jspx", {
		"cId" : cId
	}, function(data) {
		if(data.result){
			$("#"+showSpanId).show();
			$("#"+hideSpanId).hide();
		}else{
			$("#"+showSpanId).hide();
			$("#"+hideSpanId).show();
		}
	}, "json");
}
function openCollectDialog(title,htmlStr,isAutoClose){
	var dlg=new Dialog();//定义Dialog对象
	dlg.Model=true;
	dlg.AutoClose=isAutoClose;
	dlg.Width=350;//定义长度
	dlg.Height=100;
	dlg.OKEvent=function(){
		location.href=location.href;
		dlg.close();
	};
	dlg.Title=title;
	dlg.InnerHtml=htmlStr;
	dlg.show();
}
function loading(c){
	$("#" + c).block({  
        message: '<h1 style="text-align:center;"><img src="../r/cms/www/lasttemp/images/loading.gif" /><span style="position: relative;top: -8px;"> 加载中，请稍后...</span></h1>',  
        css: {  
            width: '350px',  
            padding: '2px',
            width: '30%',
            backgroundColor: '#3c819e',  
            opacity: .6,  
            color: '#FFF'  
        }  
    });  
}

/**
 * 获取活动预告列表
 */
Cms.actForecastList = function(base, c, options) {
	c = c || "actForecastListDiv";
	loading(c);
	$("#" + c).load(base + "/activity/actForecast_list.jspx", options, function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取在线展览列表
 */
Cms.onlineExhibitList = function(base, c, options) {
	c = c || "onlineExhibitListDiv";
	$("#" + c).load(base + "/activity/onlineExhibit_list.jspx", options);
};
/**
 * 获取广图报道列表
 * @author ljp
 */
Cms.gtReportList = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/service/gtReport_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取服务-常见问题列表
 * @author dfm
 */
Cms.cjwtList = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/service/cjwt_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取广州市地方志联合目录检索列表
 * @author dfm
 */
Cms.gtDiFangZhiList = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/service/gtDiFangZhiList.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取活动报道列表（服务）
 * @author ljp
 */
Cms.ReportList_svc = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/service/gtReport_list_svc.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取业务公告列表
 * @author ljp
 */
Cms.gtywNoticeList = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/gywm/ywNotice_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取媒体报道列表
 * @author ljp
 */
Cms.gtmtReportList = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/gywm/mtReport_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取赠书芳名列表
 * @author sjj
 * */
Cms.zsfmList = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/zsfm/zsfm_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取读者荐购列表
 * @author sjj
 * */
Cms.dzjgList = function(base, c, options) {
	c = c || "contentPageDiv";
	$("#" + c).load(base + "/dzjg_list.jspx", options);
};
/**
 * 获取馆情通讯列表
 * @author sjj
 * */
Cms.gqtxList = function(base, c, options) {
	c = c || "contentList";
	loading(c);
	$("#" + c).load(base + "/gywm/gqtx_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取论坛列表
 * @author sjj
 * */
Cms.forumList = function(base, c, options) {
	c = c || "forumsList";
	loading(c);
	$("#" + c).load(base + "/forums/list.jspx", options,function() {
		$("#" + c).unblock();
	});};
/**
 * 获取论坛详情列表
 * @author sjj
 * */
Cms.forumDetailList = function(base, c, options) {
	c = c || "forumsList";
	loading(c);
	$("#" + c).load(base + "/forums/detailList.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取专题推荐列表
 * @author ljp
 */
Cms.getZttjList = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/service/getZttj_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取少儿服务专题推荐列表
 * @author ljp
 */
Cms.getChildZttjList = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/childSite/getZttj_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取活动点播列表
 * @author ljp
 */
Cms.getGtzrsList = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/service/getGtzrs_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取活动通道列表
 * @author ljp
 */
Cms.getActivitytdjxList = function(base, c, options) {
	c = c || "getActivitytdjxListDiv";
	loading(c);
	$("#" + c).load(base + "/service/getActivitytdjx_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取资源导航列表
 * @author ljp
 */
Cms.getResNavigaList = function(base, c, options) {
	c = c || "getResNavigaListDiv";
	loading(c);
	$("#" + c).load(base + "/service/getResNaviga_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取下载专区列表
 * @author ljp
 */
Cms.getdownloadAreaList = function(base, c, options) {
	c = c || "downloadDiv";
	loading(c);
	$("#" + c).load(base + "/resource/getdownloadArea_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取广州之窗列表
 * @author ljp
 */
Cms.getGzWindowsList = function(base, c, options) {
	c = c || "gzWindowsDiv";
	loading(c);
	$("#" + c).load(base + "/service/getGzWindowsList_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取视障资源列表
 * @author ljp
 */
Cms.getResoucesList = function(base, c, options) {
	c = c || "resourceDiv";
	loading(c);
	$("#" + c).load(base + "/forResourceSvcAct/getResource_Front.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取服务资讯列表
 * @author ljp
 */
Cms.getFuwuZixunList = function(base, c, options) {
	c = c || "fuwuZixunDiv";
	loading(c);
	$("#" + c).load(base + "/service/getFuwuZixun_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取图书馆服务点列表
 * @author ljp
 */
Cms.GzlibServicePointList = function(base, c, options) {
	c = c || "GzlibServicePointDiv";
	loading(c);
	$("#" + c).load(base + "/libraryCityAct/getData_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 图书馆之城
 * @author ljp
 */
Cms.libraryCityMethod = function(url, htmlItemID, options) {
	$("#" + htmlItemID).load(url, options);
};
/**
 * 获取一点通列表
 * @author ljp
 */
Cms.getOnePointList = function(base, c, options) {
	c = c || "onePointDiv";
	loading(c);
	$("#" + c).load(base + "/service/getOnePoint_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取文献推荐列表
 * @author ljp
 */
Cms.getColtDoctList = function(base, c, options) {
	c = c || "getColtDoctDiv";
	loading(c);
	$("#" + c).load(base + "/service/getColtDoct_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取音视频库列表
 * @author ljp
 */
Cms.getAudioVideoList = function(base, c, options) {
	c = c || "getAudioVideoDiv";
	loading(c);
	$("#" + c).load(base + "/service/getAudioVideo_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取文档库列表
 * @author ljp
 */
Cms.getDocuDBList = function(base, c, options) {
	c = c || "getDocuDBDiv";
	loading(c);
	$("#" + c).load(base + "/service/getDocuDB_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取多媒体鉴赏区-馆藏资源列表
 * @author ljp
 */
Cms.getLibResou = function(base, c, options) {
	c = c || "getLibResouDiv";
	loading(c);
	$("#" + c).load(base + "/service/getLibResou_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取借阅排行榜列表
 * @author ljp
 */
Cms.getLoanRankList = function(base, c, options) {
	c = c || "getLoanRankList";
	loading(c);
	$("#" + c).load(base + "/resource/getLoanRank_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取少儿借阅排行榜列表
 * @author ljp
 */
Cms.getChildLoanRankList = function(base, c, options) {
	c = c || "getChildLoanRankList";
	
	$("#" + c).load(base + "/childSite/getLoanRank_list.jspx", options);
};
/**
 * 获取借阅排行榜期号列表
 * @author ljp
 */
Cms.getLoanRankViewNoList = function(base, c, options) {
	c = c || "LoanRankViewNoList";
	loading(c);
	$("#" + c).load(base + "/resource/getViewNo_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取资源-资源推荐-新书廊列表
 * @author ljp
 */
Cms.getAllNewBooksList = function(base, c, options) {
	c = c || "AllNewBooksDiv";
	loading(c);
	$("#" + c).load(base + "/resource/getAllNewBooks_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取资源-资源推荐-读者推荐-最新推荐列表（新书推荐）
 * @author ljp
 */
Cms.getNewRecommendList = function(base, c, options) {
	c = c || "AllNewBooksDiv";
	loading(c);
	$("#" + c).load(base + "/resource/getNewRecommend_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取新书廊列表
 * @author sjj
 */
Cms.getIndexNewBooksList = function(base, c, options) {
	c = c || "IndexNewBooksDiv";
	loading(c);
	$("#" + c).load(base + "/resource/getNewBooks_index_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取热门推荐列表(好书推荐)
 * @author ljp
 */
Cms.getAllGoodBookList = function(base, c, options) {
	c = c || "AllGoodBookDiv";
	loading(c);
	$("#" + c).load(base + "/resource/getAllGoodBooks_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取个性化推送列表
 * @author ljp
 */
Cms.getLastRecomList = function(base, c, options) {
	c = c || "getLastRecomDiv";
	loading(c);
	$("#" + c).load(base + "/resource/getLastRecom_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取最新消息列表（少儿图书馆）
 * @author ljp
 */

Cms.getHotNewsList = function(base, c, options) {
	c = c || "hotNewsPageDiv";
	loading(c);
	$("#" + c).load(base + "/childSite/gtHotNews_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取最新消息列表（少儿图书馆）
 * @author ljp
 */

Cms.getChildWjgList = function(base, c, options) {
	c = c || "childWjgPageDiv";
	loading(c);
	$("#" + c).load(base + "/childSite/getchildWjg_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取精彩瞬间列表（少儿图书馆）
 * @author ljp
 */
Cms.getsplendMomtList = function(base, c, options) {
	c = c || "splendMonmtPageDiv";
	loading(c);
	$("#" + c).load(base + "/childSite/gtsplendMomt_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * 获取会员专区-作品展示列表
 * @author ljp
 */
Cms.getWorkDisplayList = function(base, c, options) {
	c = c || "workDisplayListDiv";
	loading(c);
	$("#" + c).load(base + "/service/getWorkDisplay_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取创意作品列表
 * @author ljp
 */
Cms.getCreateMemberList = function(base, c, options) {
	c = c || "createMemberListDiv";
	loading(c);
	$("#" + c).load(base + "/service/createMember_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取活动报道列表
 */
Cms.actReportList = function(base, c, options) {
	c = c || "actReportListDiv";
	loading(c);
	$("#" + c).load(base + "/activity/report_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取讲座-->羊城学堂首页列表
 */
Cms.actYcSchoolIndexList = function(base, c, options) {
	c = c || "actYcSchoolIndexListDiv";
	loading(c);
	$("#" + c).load(base + "/activity/ycSchool_indexList.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取讲座-->羊城学堂首页列表
 */
Cms.actGzCultForumIndexList = function(base, c, options) {
	c = c || "actGzCultForumIndexListDiv";
	loading(c);
	$("#" + c).load(base + "/activity/gzCultForum_indexList.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取其他讲座资源列表
 */
Cms.actOtherLectResList = function(base, c, options) {
	c = c || "actOtherLectResListDiv";
	loading(c);
	$("#" + c).load(base + "/activity/otherLectRes_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 获取友情链接列表
 */
Cms.getFriendLinkList = function(base, c, options) {
	c = c || "FriendLinkListDiv";
	$("#" + c).load(base + "/friendLinkNavit/getFriendLink_list.jspx", options);
};

Cms.dzdcList = function(base, c, options) {
	c = c || "contentPageDiv";
	loading(c);
	$("#" + c).load(base + "/vote_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};

/**
 * 友情链接跳转js
 * */
	function MM_jumpMenu(selObj,restore){ //v3.0 
		if("0"!=selObj.value){
			var baseURI="";
			var url=selObj.options[selObj.selectedIndex].value;
			var urI1=selObj.baseURI.lastIndexOf("/");
			baseURI=selObj.baseURI.substring(0,urI1);
			var urI2=baseURI.lastIndexOf("/");
			if(urI1-urI2==1){
				baseURI=selObj.baseURI.substring(0,urI2);
			}
			eval("$.get('"+baseURI+"/friendlink_view.jspx?id="+selObj.options[selObj.selectedIndex].id+"')");
			if(url.indexOf('/')=='0'){
				url=baseURI+url;
				eval("window.location.href='"+url+"?versionId="+selObj.options[selObj.selectedIndex].id+"'");
			}else{
				eval("window.open('"+url+"')"); 
			}
			if (restore) selObj.selectedIndex=0;
		}
	} 
function checkUrl(base){
	$("#memberdh a").each(function(){
		if($(this).attr("href").indexOf("/gzlib") == 0 || $(this).attr("href").indexOf("http://") == 0 ){
			return true;
		}else{
		  if($(this).attr("href").indexOf('/')==$(this).attr("href").lastIndexOf("/")){
			 $(this).attr("href",base+"/"+$(this).attr("href"));  
		  }else{
			 $(this).attr("href",base+"/"+$(this).attr("href").substring(0,$(this).attr("href").indexOf('/')));  
		  }
		}
	})
}

/**
 * 获取《广州图书馆通讯》
 */
Cms.getGzlibTXList = function(base, c, options) {
	c = c || "gzlibtx";
	loading(c);
	$("#" + c).load(base + "/gywm/gzlibtx_list.jspx", options,function() {
		$("#" + c).unblock();
	});
};
/**
 * SSO退出(支持跨越退出时，请注意dataType设置为jsonp，jsonp值为jsoncallback，url值请修改目前是测试地址)
 */
Cms.SSOLogout = function() {
	$.ajax({
		async:false, 
		url: "http://121.8.227.20:8080/sso-server/logout", 
		type: "GET", 
		dataType: 'jsonp', 
		jsonp: 'jsoncallback', 
		timeout: 5000, 
		beforeSend: function(){ 
			//jsonp 方式此方法不被触发.原因可能是dataType如果指定为jsonp的话,就已经不是ajax事件了 
		}, 
		error: function(xhr){ 
			//jsonp 方式此方法不被触发.原因可能是dataType如果指定为jsonp的话,就已经不是ajax事件了 
			//请求出错处理 
		} 
	}); 
}

//我的空间相关js
Cms.getIntegralList = function(base, c, options) {
	c = c || "myIntegralList";
	$("#" + c).load(base + "/member/myIntegralList.jspx", options);
};

/**
 * 将字符串编码
 * 编码：utf-8
 * @author ljp
 */
Cms.EncodeUtf8 = function(s1) {
      var s = escape(s1);
      var sa = s.split("%");
      var retV ="";
      if(sa[0] != "")
      {
         retV = sa[0];
      }
      for(var i = 1; i < sa.length; i ++)
      {
           if(sa[i].substring(0,1) == "u")
           {
               retV += Hex2Utf8(Str2Hex(sa[i].substring(1,5)));
           }
           else retV += "%" + sa[i];
      }
      return retV;
}

function Str2Hex(s)
{
      var c = "";
      var n;
      var ss = "0123456789ABCDEF";
      var digS = "";
      for(var i = 0; i < s.length; i ++)
      {
         c = s.charAt(i);
         n = ss.indexOf(c);
         digS += Dec2Dig(eval(n));
          
      }
      //return value;
      return digS;
}

function Dec2Dig(n1)
{
      var s = "";
      var n2 = 0;
      for(var i = 0; i < 4; i++)
      {
         n2 = Math.pow(2,3 - i);
         if(n1 >= n2)
         {
            s += '1';
            n1 = n1 - n2;
          }
         else
          s += '0';
         
      }
      return s;
     
}

function Dig2Dec(s)
{
      var retV = 0;
      if(s.length == 4)
      {
          for(var i = 0; i < 4; i ++)
          {
              retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
          }
          return retV;
      }
      return -1;
}

function Hex2Utf8(s)
{
     var retS = "";
     var tempS = "";
     var ss = "";
     if(s.length == 16)
     {
         tempS = "1110" + s.substring(0, 4);
         tempS += "10" + s.substring(4, 10);
         tempS += "10" + s.substring(10,16);
         var sss = "0123456789ABCDEF";
         for(var i = 0; i < 3; i ++)
         {
            retS += "%";
            ss = tempS.substring(i * 8, (eval(i)+1)*8);
            retS += sss.charAt(Dig2Dec(ss.substring(0,4)));
            retS += sss.charAt(Dig2Dec(ss.substring(4,8)));
         }
         return retS;
     }
     return "";
} 