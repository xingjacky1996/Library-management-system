from django.db import models
from django.contrib.auth.models import User
import django.utils.timezone as timezone
# Create your models here.

class Info(models.Model):
    username = models.CharField(verbose_name="用户名", max_length=10,unique=True)
    password = models.CharField(verbose_name="密码",max_length=20)
    class Meta:
        verbose_name_plural="用户信息"

class Book(models.Model):
    bookname = models.CharField(verbose_name="书名",max_length=100,unique=True)
    cate = models.CharField(verbose_name="分类",max_length=10,choices=(
        ('0','社科'),('1','文艺'),('2','经济'),('3','法律'),('4','古籍'),('5','艺术') ,('6','科技'),('7','计算机'),('8','医药卫生'),('9','生活'),('10','建筑'),('11','少儿'),('12','教辅'),('13','外文'),('14','音像'),('15','音乐'),('16','杂志')
    ),default=0)
    zuozhe = models.CharField(verbose_name="作者",max_length=20)
    chubanshe = models.CharField(verbose_name="出版社",max_length=20)
    num = models.PositiveIntegerField(verbose_name="数量")
    weizhi = models.CharField(verbose_name="位置",max_length=30,default='')
    c_time = models.DateTimeField(verbose_name="入库时间")
    class Meta:
        verbose_name_plural = "图书信息"

class JieInfo(models.Model):
    u_name = models.CharField(verbose_name="用户名",max_length=10)
    book_name = models.CharField(verbose_name="书名",max_length=10)
    c_time = models.CharField(verbose_name="借书时间",max_length=10)
    j_time = models.CharField(verbose_name="借书期限",max_length=10)
    updata_time = models.DateField(verbose_name="最后更新时间",auto_now=True)
    h_time = models.CharField(verbose_name="规定还书日期",max_length=10,default='')
    book_num = models.CharField(verbose_name='借书数量',max_length=10,default='')
    f_book_num = models.CharField(verbose_name='借书后的库存',max_length=10,default='')
    class Meta:
        verbose_name_plural = "借阅情况"

class HuanInfo(models.Model):
    u_name = models.CharField(verbose_name="用户名",max_length=10)
    book_name = models.CharField(verbose_name="书名",max_length=10)
    c_time = models.CharField(verbose_name="借书日期",max_length=10)
    j_time = models.CharField(verbose_name="借书期限",max_length=10)
    h_time = models.CharField(verbose_name="规定还书日期",max_length=10,default='')
    h_date = models.CharField(verbose_name="借书人还书的日期",max_length=10,default='')
    book_num = models.CharField(verbose_name='还书数量',max_length=10,default='')
    f_book_num = models.CharField(verbose_name='还书后的库存',max_length=10,default='')
    class Meta:
        verbose_name_plural = "还书情况"

class Gonggao(models.Model):
    content = models.TextField(verbose_name="内容",max_length=100)
    c_time = models.DateTimeField(verbose_name="创建时间")
    class Meta:
        verbose_name_plural = "公告"

class liuyan(models.Model):
    u_name = models.CharField(verbose_name="用户名",max_length=10)
    c_time = models.CharField(verbose_name="创建时间",max_length=20)
    content = models.CharField(verbose_name="留言内容",max_length=100)
    class Meta:
        verbose_name_plural = "留言"






