# from django.contrib import admin
import xadmin
from systeam.models import *
from .models import *
from django.contrib.admin.models import LogEntry
from xadmin.views import BaseAdminView, CommAdminView
from xadmin.plugins.actions import BaseActionView
# Register your models here.

class bookAdmin(object):
    list_display = ('bookname','cate','zuozhe','chubanshe','num','weizhi','c_time') # 字段在列表的显示
    search_fields = ['bookname','zuozhe'] #同过书名进行查找
    list_filter =('cate', 'chubanshe', 'weizhi','c_time') #过滤器
    list_per_page = 10  # 默认为100条



class jieAdmin(object):
    list_display = ('u_name','book_name','c_time','j_time','h_time')
    search_fields = ['u_name','book_name','c_time']
    list_filter =('u_name', 'book_name', 'c_time')
    list_per_page = 10

class huanAdmin(object):
    list_display = ('u_name','book_name','c_time','j_time','h_time','h_date')
    search_fields = ['u_name','book_name','c_time']
    list_filter =('u_name', 'book_name', 'c_time')
    list_per_page = 10

class GonggaoAdmin(object):
    list_display = ('content','c_time')
    search_fields = ['c_time']
    list_filter =['c_time']
    list_per_page = 5

class liuyan_Admin(object):
    list_display = ('u_name','c_time','content')
    search_fields = ['u_name','c_time']
    list_filter =['u_name','c_time']
    list_per_page = 10

class LogEntryAdmin(object):
    list_display = ['object_repr','object_id','action_flag','user','change_message']

class ThemeSetting(object):
    enable_themes = True
    use_bootswatch = True

class CustomView(object):
        site_title = '求真图书馆后台管理系统'   # 网页头部导航
        site_footer = '求真图书馆'      # 底部版权内容
        # menu_style = 'accordion'  # 左侧导航折叠框

#绑定到xadmin的views.BaseAdminView
xadmin.site.register(BaseAdminView, ThemeSetting)
xadmin.site.register(CommAdminView, CustomView)

xadmin.site.site_header = '求真图书馆管理系统'
xadmin.site.register(Book,bookAdmin)
xadmin.site.register(JieInfo,jieAdmin)
xadmin.site.register(HuanInfo,huanAdmin)
xadmin.site.register(Gonggao,GonggaoAdmin)
xadmin.site.register(liuyan,liuyan_Admin)
xadmin.site.register(LogEntry,LogEntryAdmin)



