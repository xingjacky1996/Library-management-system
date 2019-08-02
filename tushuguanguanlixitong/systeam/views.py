from django.shortcuts import render, redirect, reverse, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt
from .forms import *
from django.contrib.auth import authenticate, login as login1, logout
import time
import datetime
from django.db.models import Sum, Count
from django.contrib import messages
from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.admin.options import get_content_type_for_model
from django.urls import reverse


# Create your views here.

# 登陆
@csrf_exempt
def login(request):
    if request.method == "GET":
        form = Login()
        return render(request, 'systeam/login.html/', {'form': form})
    else:
        form = Login(request.POST)
        if form.is_valid():
            # 成功
            login1(request, form.user)
            return redirect(reverse('systeam:index'))
        else:
            # 验证失败
            return render(request, 'systeam/login.html', {'form': form})


# 注册
def zhuce(request):
    if request.method == 'GET':
        form = Zhuce()
        form.fields['username'].help_text = None
        return render(request, 'systeam/zhuce.html', {'form': form})
    else:
        form = Zhuce(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            User.objects.create_user(username=data['username'], password=data['password'])
            return redirect(reverse('systeam:login'))
        else:
            return render(request, 'systeam/zhuce.html', {'form': form})


# 退出登录
def loginout(request):
    logout(request)
    return redirect(reverse('systeam:index'))


# 首页
@csrf_exempt
def index(request):
    if request.method == 'GET':
        username = request.user.username
        is_staff = request.user.is_staff
        gonggao = Gonggao.objects.all().order_by("-c_time")
        liuyanban_all = liuyan.objects.all().order_by("-c_time")
    return render(request, "systeam/index.html",
                  {'username': username, 'is_staff': is_staff, 'gonggao': gonggao, 'liuyanban_all': liuyanban_all})


# 用户主页
@csrf_exempt
def reader(request):
    username = request.user.username
    is_staff = request.user.is_staff
    jieinfo_list = JieInfo.objects.filter(u_name=username)
    q1 = JieInfo.objects.all().order_by("-c_time")
    if jieinfo_list.exists():
        return render(request, 'systeam/reader.html',
                      {'is_staff': is_staff, 'username': username, 'jieinfo_list': jieinfo_list,'q1':q1})
    else:
        messages.error(request, '您还没有借书呢')
        return redirect('/')
        


# 查询书结果页面
@csrf_exempt
def search(request):
    if request.method == 'GET':
        bookname = request.GET.get('bookname')
        bookinfo = Book.objects.filter(bookname=bookname)
        is_staff = request.user.is_staff
        username = request.user.username
        gonggao = Gonggao.objects.all().order_by("-c_time")
        liuyanban_all = liuyan.objects.all().order_by("-c_time")
        c2 = JieInfo.objects.filter(u_name=username, book_name=bookname)
        c3 = JieInfo.objects.filter(u_name=username).count()
        if username == '':
            messages.error(request, '亲，请您先登录,才能使用该功能。')
            return redirect('/')
        else:
            if bookname == '':
                messages.error(request, '亲，搜索内容不能为空哦。')
                return redirect('/')
            elif c2.exists():
                messages.error(request, '对不起，您不能再次借阅该图书了。')
                return redirect('/')
            elif c3 == 5:
                messages.error(request, '对不起，您将超出图书馆借阅图书数量限制。')
                return redirect('/')
            else:
                if bookinfo.exists():
                    return render(request, "systeam/searched.html",
                                  {'bookinfo': bookinfo, 'username': username, 'is_staff': is_staff})
                else:
                    messages.error(request, '亲，没有这本书呢。')
                    return redirect('/')
    else:
        return render(request, "systeam/searched.html", {'username': username})

# 借
@csrf_exempt
def jie(request):
    if request.method == 'POST':
        jieshuname = request.POST.get('jieshuname')
        jieshunum = request.POST.get('jieshunum')
        u_jieshunum = request.POST.get('u_jieshunum')
        jiedate = request.POST.get('jiedate')
        jietime = request.POST.get('jieshutime')
        huandate = request.POST.get('huandate')
        username = request.user.username
        Book.objects.filter(bookname=jieshuname).update(num=jieshunum)
        JieInfo.objects.create(u_name=username, book_name=jieshuname, c_time=jiedate, j_time=jietime,
                               book_num=u_jieshunum, f_book_num=jieshunum, h_time=huandate)
        return HttpResponse("ok")
    else:
        return HttpResponse('False')

# 还
@csrf_exempt
def huan(request):
    if request.method == 'POST':
        huanshuuname = request.POST.get('username')
        huanbookname = request.POST.get('bname')
        huanbooknum = request.POST.get('booknum')
        h_time = request.POST.get('h_time')
        fudong = request.POST.get('f_b_num')
        c_date = request.POST.get('c_date')
        j_time = request.POST.get('j_time')
        huandate = request.POST.get('huandate')
        HuanInfo.objects.create(u_name=huanshuuname, book_name=huanbookname, c_time=c_date, j_time=j_time,
                                book_num=huanbooknum, h_time=h_time, f_book_num=fudong, h_date=huandate)
        Book.objects.filter(bookname=huanbookname).update(num=fudong)
        JieInfo.objects.filter(book_name=huanbookname, u_name=huanshuuname).delete()
    return HttpResponse('ok')

# 续借
@csrf_exempt
def xujie(request):
    if request.method == "GET":
        username = request.user.username
        is_staff = request.user.is_staff
        bid = request.GET.get('bid')
        h_time = request.GET.get('h_time')
        j_time_n = request.GET.get('j_time_n')
        xj_time_a = request.GET.get('xj_time_a')
        q1 = JieInfo.objects.get(id=bid)
        log_entries = LogEntry.objects.filter(
            content_type_id = get_content_type_for_model(q1).pk,
            object_id = q1.id,
        )
        print(log_entries)
        if log_entries.exists():
            # messages.error(request, '亲,您已经续借过一次了,不能再次续借。如果有问题，及时反馈图书馆管理员。')
            return HttpResponse('亲,您已经续借过一次了,不能再次续借。如果有问题，及时反馈图书馆管理员。')
        else:
            JieInfo.objects.filter(id=bid).update(j_time=j_time_n,h_time=xj_time_a)
        return redirect('/reader/')

# 询问管理员
@csrf_exempt
def liaotian(request):
    username = request.user.username
    if username == '':
        messages.error(request, '亲，请您先登录,才能使用该功能。')
        return redirect('/')
    else:
        return render(request, "systeam/liaotian.html")


# 公告详情
@csrf_exempt
def gonggao(request, id):
    if request.method == 'GET':
        username = request.user.username
        is_staff = request.user.is_staff
        content = Gonggao.objects.first().content
        c_time = Gonggao.objects.first().c_time
        t = Gonggao.objects.filter(id=id).all()
    return render(request, "systeam/gonggao.html",
                  {'username': username, 'is_staff': is_staff, 'content': content, 'c_time': c_time, 't': t})

# 更多公告
@csrf_exempt
def gonggao_all(request):
    username = request.user.username
    is_staff = request.user.is_staff
    if request.method == 'GET':
        gonggao = Gonggao.objects.all().order_by("-c_time")
    return render(request, "systeam/gonggao_all.html", {'username': username, 'is_staff': is_staff, 'gonggao': gonggao})


# 留言
@csrf_exempt
def liuyan_(request):
    username = request.user.username
    is_staff = request.user.is_staff
    if username == '':
        messages.error(request, '亲，请您先登录,才能使用该功能。')
        return redirect('/')
    else:
        if request.method == 'POST':
            stemTxt = request.POST.get('stemTxt')
            username = request.user.username
            times = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            liuyan.objects.create(u_name=username, content=stemTxt, c_time=times)
            return HttpResponse('ok')
        else:
            return render(request, "systeam/liuyan.html", {'username': username, 'is_staff': is_staff})


# 数据
@csrf_exempt
def shuju(request):
    username = request.user.username
    is_staff = request.user.is_staff
    user_num = User.objects.filter(id__gt=1).count()
    book_num_b = Book.objects.all().aggregate(Sum('num'))
    for i in book_num_b:
        book_num_a = int(book_num_b[i])
    sk_book_num = Book.objects.filter(cate=0).aggregate(sk_book_num=Sum('num'))
    wy_book_num = Book.objects.filter(cate=1).aggregate(wy_book_num=Sum('num'))
    jj_book_num = Book.objects.filter(cate=2).aggregate(jj_book_num=Sum('num'))
    fl_book_num = Book.objects.filter(cate=3).aggregate(fl_book_num=Sum('num'))
    gj_book_num = Book.objects.filter(cate=4).aggregate(gj_book_num=Sum('num'))
    ys_book_num = Book.objects.filter(cate=5).aggregate(ys_book_num=Sum('num'))
    kj_book_num = Book.objects.filter(cate=6).aggregate(kj_book_num=Sum('num'))
    jsj_book_num = Book.objects.filter(cate=7).aggregate(jsj_book_num=Sum('num'))
    yy_book_num = Book.objects.filter(cate=8).aggregate(yy_book_num=Sum('num'))
    sh_book_num = Book.objects.filter(cate=9).aggregate(sh_book_num=Sum('num'))
    jz_book_num = Book.objects.filter(cate=10).aggregate(jz_book_num=Sum('num'))
    se_book_num = Book.objects.filter(cate=11).aggregate(se_book_num=Sum('num'))
    jf_book_num = Book.objects.filter(cate=12).aggregate(jf_book_num=Sum('num'))
    ww_book_num = Book.objects.filter(cate=13).aggregate(ww_book_num=Sum('num'))
    yx_book_num = Book.objects.filter(cate=14).aggregate(yx_book_num=Sum('num'))
    mu_book_num = Book.objects.filter(cate=15).aggregate(mu_book_num=Sum('num'))
    zz_book_num = Book.objects.filter(cate=15).aggregate(zz_book_num=Sum('num'))

    book_num_dic = {**sk_book_num, **wy_book_num, **jj_book_num, **fl_book_num, **gj_book_num, **ys_book_num,
                    **kj_book_num, **jsj_book_num, **yy_book_num, **sh_book_num, **jz_book_num, **se_book_num,
                    **jf_book_num, **ww_book_num, **yx_book_num, **mu_book_num, **zz_book_num}

    for k in book_num_dic:

        if book_num_dic[k] is None:
            book_num_dic[k] = 0
        else:
            int(book_num_dic[k])
    sk_num = list(book_num_dic.values())[0]
    wy_num = list(book_num_dic.values())[1]
    jj_num = list(book_num_dic.values())[2]
    fl_num = list(book_num_dic.values())[3]
    gj_num = list(book_num_dic.values())[4]
    ys_num = list(book_num_dic.values())[5]
    kj_num = list(book_num_dic.values())[6]
    jsj_num = list(book_num_dic.values())[7]
    yy_num = list(book_num_dic.values())[8]
    sh_num = list(book_num_dic.values())[9]
    jz_num = list(book_num_dic.values())[10]
    se_num = list(book_num_dic.values())[11]
    jf_num = list(book_num_dic.values())[12]
    ww_num = list(book_num_dic.values())[13]
    yx_num = list(book_num_dic.values())[14]
    mu_num = list(book_num_dic.values())[15]
    zz_num = list(book_num_dic.values())[16]

    return render(request, "systeam/shuju.html",
                  {'is_staff': is_staff, 'username': username, 'user_num': user_num, 'book_num_a': book_num_a,
                   'sk_num': sk_num, 'wy_num': wy_num, 'jj_num': jj_num, 'fl_num': fl_num, 'gj_num': gj_num,
                   'ys_num': ys_num, 'kj_num': kj_num, 'jsj_num': jsj_num, 'yy_num': yy_num, 'sh_num': sh_num,
                   'jz_num': jz_num, 'se_num': se_num, 'jf_num': jf_num, 'ww_num': ww_num, 'yx_num': yx_num,
                   'mu_num': mu_num, 'zz_num': zz_num})


# 留言详情
@csrf_exempt
def liuyanban(request, id):
    if request.method == 'GET':
        username = request.user.username
        is_staff = request.user.is_staff
        content = liuyan.objects.first().content
        c_time = liuyan.objects.first().c_time
        u_name = liuyan.objects.first().u_name
        t = liuyan.objects.filter(id=id).all()
    return render(request, "systeam/liuyanban.html",
                  {'content': content, 'c_time': c_time, 'u_name': u_name, 't': t, 'username': username,
                   'is_staff': is_staff})


# 更多留言
@csrf_exempt
def liuyanban_all(request):
    if request.method == 'GET':
        username = request.user.username
        is_staff = request.user.is_staff
        liuyanban_all = liuyan.objects.all().order_by("-c_time")
    return render(request, "systeam/liuyanban_all.html",
                  {'liuyanban_all': liuyanban_all, 'username': username, 'is_staff': is_staff})
