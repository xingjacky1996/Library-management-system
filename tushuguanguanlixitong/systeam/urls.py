from django.urls import path
from . import views

app_name = "systeam"

urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.login, name="login"),
    path('reader/', views.reader,name="reader"),
    path('zhuce/', views.zhuce,name="zhuce"),#form表单验证后跳转
    path('loginout/', views.loginout , name='loginout'), # 登出
    path('searched/', views.search, name='search'),
    path('jie/', views.jie, name='jie'),
    path('huan/', views.huan, name='huan'),
    path('xujie/',views.xujie, name='xujie'),
    path('liaotian/', views.liaotian, name='liaotian'),
    path('gonggao_all/', views.gonggao_all, name='gonggao_all'),
    path('gonggao/<id>/', views.gonggao, name='gonggao'),
    path('liuyan/', views.liuyan_,name='liuyan'),
    path('liuyanban_all/', views.liuyanban_all, name='liuyanban_all'),
    path('liuyanban/<id>',views.liuyanban,name='liuyanban'),
    path('shuju/',views.shuju,name='shuju'),
]