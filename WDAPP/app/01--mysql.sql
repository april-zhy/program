--创建商店数据库
create database shop character set utf8;
--在数据库下操作
use shop;
--创建管理员表
create table tb_admin(
    adminId int primary key auto_increment,
    adminName varchar(20) not null unique,
    adminPwd varchar(20) not null
);

--修改自增的起始值
alter table tb_admin auto_increment=101;
--添加管理员
insert into tb_admin values(0,"lzj","1234");
insert into tb_admin values(0,"zhy","1234");

--创建用户表
create table tb_user(
    userId int primary key auto_increment,
    userName varchar(20) not null unique,
    userPwd varchar(20) not null,
    userSex varchar(10) not null,
    userAge tinyint(10) unsigned,
    userTel int unsigned,
    userMoney decimal(10,2)
);
--create table tb_user(
--      userId int primary key auto_increment,
--      userName varchar(20) not null unique,
--      userPwd varchar(20) not null,
--      userSex varchar(10) not null,  --性别
--      userAge tinyint(10) unsigned,  --年龄  做个年月日级联
 --     userTel int(15) unsigned,  --电话
 --     userMoney decimal(10,2)  --用户余额，保留来两位小数
--  );


--修改用户自增值
alter table tb_user auto_increment=16001;
--增加用户头像
alter table tb_user add userImg varchar(100) default '/images/xx.png';
--商品类型表
create table tb_goodsType(
    typeId int primary key auto_increment,
    typeName varchar(50),
    status int(2)
);
--create table tb_goodsType(
 --   typeId int primary key auto_increment,
 --   typeName varchar(50), --类型名
 --   status int(2)  --状态 当删除该类型则状态值改变
--);
alter table tb_goodsType auto_increment=1;


--创建商品信息表
create table tb_goods(
      goodsId int primary key auto_increment,
      typeId int,
      goodsName varchar(40) not null,
      goodsDetail varchar(100) not null,
      normalPrice decimal(10,2) not null,
      goodsImg varchar(100) not null,
      goodsFlag int(2) not null
);

alter table tb_goods auto_increment=110001;
--创建活动表  活动表，活动ID，开始时间，结束时间，折扣，
create table tb_action(
      actionId int primary key auto_increment,
      startTime datetime not null,
      endTime datetime not null,
      actionName varchar(50) not null,
      actionAgion int not null,
      actionPre int not null
);
alter table tb_action auto_increment=101;
--drop table tb_action;
--alter table tb_action modify actionAgion varchar(10) not null;

alter table tb_user modify userAge varchar(20);

create table tb_actionInfo(
    actionInfoId int primary key auto_increment,
    actionId int,
    goodsId varchar(255)
);
alter table tb_actionInfo auto_increment=101001;
--drop table tb_actionInfo;
--添加活动描述
--alter table tb_actionInfo add actionMark varchar(100) not null;
--活动折扣 1~9
--alter table tb_actionInfo add actInfoAgion int not null;
--活动优先级  1~4  1:没打活动时备用方案 2：活动期长的  3.节假日特价活动  4: 新闻
--alter table tb_actionInfo add actInfoPre int not null;
--参与该活动的商品ID
--alter table tb_actionInfo add goodsId varchar(255);
--添加活动后，再点击参加参与该活动的商品

--地址信息表
create table tb_address(
    addressId int primary key auto_increment,
    userId int,
    addPro varchar(50) not null,
    addCity varchar(50) not null,
    addArea varchar(50) not null,
    addStreet varchar(50) not null
);
alter table tb_address add addPost varchar(10) not null;
alter table tb_address add addFlage varchar(10);
--create table tb_address(
--    addressId int primary key auto_increment,
 --   userId int,
 --   addPro varchar(50) not null,--省份
 --   addCity varchar(50) not null,--城市
  --  addArea varchar(50) not null,--区
  --  addStreet varchar(50) not null --街道
--);

alter table tb_address auto_increment=15001;

--购物车表
create table tb_shopCart(
    shopCartId int primary key auto_increment,
    userId int not null,
    goodsId int,
    goodsCount int not null
);
alter table tb_shopCart auto_increment=1001;


--订单信息表
create table tb_orderForm(
    orderId int primary key auto_increment,
    userId int,
    goodsId int,
    orderTime varchar(50) not null,
    allCount decimal(10,2) not null,
    orderMessage varchar(255) not null
);
--create table tb_orderForm(
 --   orderId int primary key auto_increment, --订单ID
 --   userId int, --外键
  --  goodsId int,
  --  orderTime varchar(50) not null,  --订单时间  取当前下单时间
   -- allCount int(10) not null, --总计
    --address varchar(255) not null,   可取地址表中的   然后字符串拼接
  --  msgTel int,   有了用户ID，课直接从用户表取
  --  orderMessage varchar(255) not null --订单留言 备注
);
alter table tb_orderForm auto_increment=1001;

--评论表
create table tb_comment(
    commentId int primary key auto_increment,
    goodsId int,
    commentScore int not null,
    commentDesc varchar(255) not null,
    commentTime varchar(50) not null,

);

alter tb_comment add  commentImg varchar(255);
--create table tb_comment(
--    commentId int primary key auto_increment,
 --   orderId int,
 --   commentScore int(1) not null, --评论分数非空
  --  commentDesc varchar(255) not null, --评论描述
  --  commentTime varchar(50) not null  --评论时间  取当前提交时间
--);
alter table tb_comment auto_increment=1001;

select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (
select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b
	where a.actionId=b.actionid) t on t.goodsId=g.goodsId;

select g.*,ifnull((g.normalPrice*t.actionAgion*0.1),g.normalPrice) as realPrice from tb_goods g left join (
select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b
	where a.actionId=b.actionid) t on t.goodsId=g.goodsId;







--时间格式化
select date_format(endTime,'%Y-%m-%d %H:%m:%s') from tb_action;
select g.* from (select u.*,a.* from tb_user u left join tb_address a on u.userId=a.userId) g where g.userId=3;


select * from (select g.* from tb_shopCart c,tb_goods g where g.goodsId=c.goodsId) a where a.goodsId=110004;