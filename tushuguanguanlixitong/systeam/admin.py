# from django.contrib import admin
# from systeam.models import *
# from .models import *
# from django.contrib.admin.models import LogEntry
# # Register your models here.

# class bookAdmin(admin.ModelAdmin):
#     list_display = ('bookname','cate','zuozhe','chubanshe','num','weizhi','c_time') # 字段在列表的显示
#     search_fields = ['bookname','zuozhe'] #同过书名进行查找
#     list_filter =('cate', 'chubanshe', 'weizhi','c_time') #过滤器
#     list_per_page = 10  # 默认为100条

# class jieAdmin(admin.ModelAdmin):
#     list_display = ('u_name','book_name','c_time','j_time','h_time')
#     search_fields = ['u_name','book_name','c_time']
#     list_filter =('u_name', 'book_name', 'c_time')
#     list_per_page = 10

# class huanAdmin(admin.ModelAdmin):
#     list_display = ('u_name','book_name','c_time','j_time','h_time','h_date')
#     search_fields = ['u_name','book_name','c_time']
#     list_filter =('u_name', 'book_name', 'c_time')
#     list_per_page = 10

# class GonggaoAdmin(admin.ModelAdmin):
#     list_display = ('content','c_time')
#     search_fields = ['c_time']
#     list_filter =['c_time']
#     list_per_page = 5

# class liuyan_Admin(admin.ModelAdmin):
#     list_display = ('u_name','c_time','content')
#     search_fields = ['u_name','c_time']
#     list_filter =['u_name','c_time']
#     list_per_page = 10

# admin.site.site_header = '求真图书馆管理系统'
# admin.site.register(Book,bookAdmin)
# admin.site.register(JieInfo,jieAdmin)
# admin.site.register(HuanInfo,huanAdmin)
# admin.site.register(Gonggao,GonggaoAdmin)
# admin.site.register(liuyan,liuyan_Admin)

