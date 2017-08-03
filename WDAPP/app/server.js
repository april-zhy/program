/**
 * Created by uidp5340 on 2017/2/23.
 */
var express=require("express");             //创建服务器
var bodyparser = require("body-parser");//处理发送请求过来的内容

var app=express();                          //创建一个应用

var session=require("express-session");//session
app.use(session({
    secret:'keyboard cat',//私密   session id的标识
    resave:true,//每次重新请求是否FinalAPP重新设置  session id
    saveUninitialized:true,//设置session cookie ,默认值为connect.sid
    cookie:{ secure:false,maxAge:6000*60*5 }//secure 用于http  变成https  过期时间
}));

var mysql=require("mysql");                 //数据库操作
var path = require('path');                 //导入path模块


//配置bodyparser中间件//将请求的内容进行解析
app.use(bodyparser.urlencoded({extended:false}));
//配置数据库连接词
var pool=mysql.createPool({
    host:"127.0.0.1",
    port:3306,
    database:"shop",
    user:"root",
    /*password:"Aa123456"*/
    password:"aaaa"
});


//检测用户登录    OK
app.get("/checkLogin",function(req,res){
    //console.log("检测登录 ",req.session.userInfo);
    if(req.session.userInfo==null || req.session.userInfo==undefined || req.session.userInfo.length==0){
        res.send({status:"0"});
    }else {
        res.send({status:'1',datas:req.session.userInfo});
    }
});
app.post("/checkLoginByUserId",function(req,res){
    var userId=req.body.userId;
    if(userId!=""){
        pool.getConnection(function(err,connection){
            if(err){
                console.error('checkLoginByUserId链接数据库错误：',err);
                res.send({'status':'2'});
            }else {
                sql='select b.*,b.userId from (select a.* from tb_address a,tb_user u where a.userId=u.userId) b where b.userId=?';
                connection.query(sql,[userId],function(err,result){
                    connection.release();//释放连接池
                    if(err){
                        console.info('checkLoginByUserId查询数据错误：',err);
                        res.send({'status':'3'});
                    } else {
                       // console.log("检测登录 ",result);
                        res.send({'status':'1',datas:result});//注册成功
                    }
                });
            }
        });
    }
});

//用户注册     OK
app.post("/register",function(req,res){
    var regName=req.body.regName;
    var regPwd=req.body.regPwd;
    //console.log("用户开始注册  : ",req.body);
    if(regName=="" || regPwd==""){
        res.send({'status':'0'});
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                console.error('用户注册链接数据库错误：',err);
                res.send({'status':'2'});
            }else {
                connection.query("insert into tb_user (userId,userName,userPwd) values(0,?,?)",[regName,regPwd],function(err,result){
                    connection.release();//释放连接池
                    if(err){
                        console.info('用户注册插入数据错误：',err);
                        res.send({'status':'3'});
                    } else {
                        res.send({'status':'1'});//注册成功
                    }
                });
            }
        });
    }
});
//用户登录   OK
app.post("/login",function (req,res) {
    var loginName=req.body.loginName;
    var loginPwd=req.body.loginPwd;
    console.log("用户发起了登录请求");
    pool.getConnection(function(err,connection){
        if(err){
            console.error('用户登录链接数据库错误： ',err);
            res.send({ status:"0" });
        }else {
            connection.query("select * from tb_user where userName=? and userPwd=?",[loginName,loginPwd],function(err,result){
                connection.release();
                if(err){
                    res.send({ status:"2" });
                    console.info('用户登录查询数据库错误：',err);
                } else {
                    if(result.length>0){
                        req.session.userInfo=result[0];
                        console.log("用户登录",result[0]);

                        res.send({ status:"1",datas:result[0] });//登录成功
                    }else {
                        res.send({ status:"3" });
                    }
                }
            });
        }
    });
});
//用户退出  OK
app.get("/logout",function (req,res) {
    req.session.userInfo=null;
    res.send({status:"1"});
});
//用户修改头像
app.post('/uploadHeadImg',function(req,res){
    var userImg=req.body.pic;
    var userId=req.body.userId;
    pool.getConnection(function(err,connection){
        if(err){
            console.error('用户修改头像链接数据库错误：',err);
            res.send({'status':'2'});
        }else {
            connection.query("update tb_user set userImg=? where userId=?",[userImg,userId],function(err,result){
                connection.release();//释放连接池
                if(err){
                    console.info('用户修改头像插入数据错误：',err);
                    res.send({'status':'3'});
                } else {
                    res.send({'status':'1'});
                }
            });
        }
    });
});
//保存地址
app.post("/saveAddress",function(req,res){
    var userId=req.body.userId;
    var addName=req.body.addressUserName;
    var addTel=req.body.addressUserTel;
    var addAddress=req.body.addressProCity;
    var addPost=req.body.addressPost;
    var addStreet=req.body.addressStreet;

    //console.log('saveAddress',req.body);
    if(userId!="" && addName!="" && addTel !="" && addAddress!="" && addPost!="" && addStreet!=""){
        pool.getConnection(function(err,connection){
            if(err){
                console.error(err);
                res.send({status:"0"});
            }else {
                var sql;
                var sql2='insert into tb_address (addressId,userId,addAddress,addStreet,addPost,addFlage,addName,addTel) values (0,?,?,?,?,1,?,?)'

                pool.query(sql2,[userId,addAddress,addStreet,addPost,addName,addTel],function(err,result){
                    connection.release();
                    if(err){
                        console.error(err);
                        res.send({status:"3"});
                    }else {
                        //console.log('getGoodsFromShopCart',result);
                        res.send({status:"1",datas:result});
                    }
                });
            }
        });
    }else {
        res.send({status:"2"});
    }
});
//付款
app.post("/payfor",function(req,res){
    var userId=req.body.userId;
    var goodPrice=req.body.goodPrice;
    if(userId!="" && goodPrice!=""){
        pool.getConnection(function(err,connection){
            if(err){
                console.error(err);
                res.send({status:"0"});
            }else {
                var sql1='select userMoney from tb_user where userId=?';
               //线查询
                pool.query(sql1,[userId],function(err,result){
                    if(err){
                        res.send({status:"3"});
                    }else {
                        var userMoney1=result[0].userMoney;
                        var userMoney2;
                        if(goodPrice>userMoney1){
                            res.send({status:'2'});
                        }else {
                            userMoney2=userMoney1-goodPrice;
                            var sql2='update tb_user set userMoney=? where userId=?;'
                            pool.query(sql2,[userMoney2,userId],function(err,result){
                                connection.release();
                                if(err){
                                    res.send({status:"4"});
                                }else {
                                    res.send({status:"1",datas:result});
                                }
                            });
                        }

                    }
                });
            }
        });
    }else {
        res.send({status:"2"});
    }
});

//获取商品信息 OK 日期过滤查找
app.post("/getGoodsByTime",function (req,res) {
    var typeId=req.body.typeId;
    var startTimeStr=req.body.startTimeStr;
    var endTimeStr=req.body.endTimeStr;

    /*console.log("日期过滤查找startTimeStr : ",startTimeStr);
    console.log("日期过滤查找endTimeStr : ",endTimeStr);
    console.log("日期过滤查找typeId : ",typeId);*/

    if(typeId=="" && startTimeStr=="" && endTimeStr==""){
        res.send({status:"0"});
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                console.error('商品分类查询数据库连接失败：',err);
                res.send({status:"2"});
            }else {
                var sql="select * from tb_goods where typeId=1 and goodsTime>=date_format('2017-03-01','%Y-%m-%d %H:%m:%s');";
                pool.query("select * from (select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId) tb where tb.goodsId in(select tb_goods.goodsId from tb_goods where (typeId=?) and (goodsTime>=date_format('"+startTimeStr+"','%Y-%m-%d %H:%m:%s') ) and( goodsTime<=date_format('"+endTimeStr+"','%Y-%m-%d %H:%m:%s') ));",[typeId],function(err,result){
                    connection.release();
                    if(err){
                        console.error('商品分类查询数据查询失败：',err);
                        res.send({status:"3"});
                    }else {
                       //console.log("日期过滤查找 : ",result);
                        res.send({status:"1",datas:result});
                    }
                });
            }
        });
    }
});
//获取商品信息 OK 商品ID过滤查找
app.post("/getGoodsByGoodsID",function (req,res) {
    var goodsId=req.body.goodsId;
    if(goodsId=="" ){
        res.send({status:"0"});
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                console.error('商品ID分类查询数据库连接失败：',err);
                res.send({status:"2"});
            }else {
                sql='select * from (select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId) tb where tb.goodsId=?;'
                pool.query(sql,[goodsId],function(err,result){
                    connection.release();
                    if(err){
                        console.error('商品ID分类查询数据查询失败：',err);
                        res.send({status:"3"});
                    }else {
                        console.log("商品ID分类查询数据结果 : ",result);
                        res.send({status:"1",datas:result});
                    }
                });
            }
        });
    }
});
//获取商品信息  OK 类型ID过滤查找
app.post("/getGoodsByTypeID",function (req,res) {
    var goodsTypeId=req.body.goodsTypeId;
    if(goodsTypeId=="" ){
        res.send({status:"0"});
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                console.error('商品类型ID分类查询数据库连接失败：',err);
                res.send({status:"2"});
            }else {
                pool.query('select * from tb_goods where typeId=?',[goodsTypeId],function(err,result){
                    connection.release();
                    if(err){
                        console.error('商品ID分类查询数据查询失败：',err);
                        res.send({status:"3"});
                    }else {
                      //  console.log("商品ID分类查询数据结果 : ",result);
                        res.send({status:"1",datas:result});
                    }
                });
            }
        });
    }
});
//获取商品信息   活动ID过滤查找   getGoodsByActionId
app.post("/getGoodsByActionId",function (req,res) {
    var actionId=req.body.actionId;
    if(actionId=="" ){
        res.send({status:"0"});
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                console.error('活动类型ID分类查询数据库连接失败：',err);
                res.send({status:"2"});
            }else {
                sql='select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId where g.goodsFlag=1 and g.goodstatus=1;"'
                pool.query('select * from (select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId where g.goodsFlag=1 and g.goodstatus=1) t where t.goodsId in (select ta.goodsId from tb_actionInfo ta where ta.actionId=?)',[actionId],function(err,result){
                    connection.release();
                    if(err){
                        console.error('活动ID分类查询数据查询失败：',err);
                        res.send({status:"3"});
                    }else {
                        //  console.log("活动ID分类查询数据结果 : ",result);
                        res.send({status:"1",datas:result});
                    }
                });
            }
        });
    }
});
//获取商品信息   通过关键字查找
app.post("/getGoodsByKeyWord",function (req,res) {
    var keyWord=req.body.keyWord;
    if(keyWord=="" ){
        res.send({status:"0"});
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                console.error('活动类型ID分类查询数据库连接失败：',err);
                res.send({status:"2"});
            }else {
                sql='select * from (select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId where g.goodsFlag=1 and g.goodstatus=1) t where t.goodsName like "%'+keyWord+'%" or t.goodsDetail like "%'+keyWord+'%" order by t.goodsId asc;';
                pool.query(sql,function(err,result){
                    connection.release();
                    if(err){
                        console.error('活动ID分类查询数据查询失败：',err);
                        res.send({status:"3"});
                    }else {
                        //console.log("关键字查询 : ",result);
                        res.send({status:"1",datas:result});
                    }
                });
            }
        });
    }
});



//获取所有商品信息    OK
app.get("/getAllGoodsInfo",function(req,res){
    pool.getConnection(function(err,connection){
        if(err){
            console.error(err);
            res.send({status:"0"});
        }else {
            var sql="select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId where g.goodsFlag=1 and g.goodstatus=1;";
            pool.query(sql,function(err,result){
                connection.release();
                if(err){
                    console.error(err);
                    res.send({status:"2"});
                }else {
                    res.send({status:"1",datas:result});
                }
            });
        }
    });
});

//获取商品评论
app.post("/getGoodsCommnet",function(req,res){
    var goodId=req.body.goodsId;
    if(goodId==""){
        res.send({status:'0'});
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                res.send({status:"2"});
            }else {
                var sql="select tb.*,c.* from (select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice "
               +"from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,"
                 +" (select * from tb_action where startTime<=now() and endTime>=now()) b"
               +" where a.actionId=b.actionid) t on t.goodsId=g.goodsId) tb left join tb_comment c on tb.goodsId=c.goodsId"
               +" where tb.goodsId=?";
                pool.query(sql,[goodId],function(err,result){

                    connection.release();
                    if(err){
                        console.error(err);
                        res.send({status:"3"});
                    }else {
                        //console.log('商品评论：',result);
                        res.send({status:"1",datas:result});
                    }
                });
            }
        });
    }
});



//加入购物车

app.post("/addToCart",function (req,res) {
    var userId=(req.body.userId);
    var goodsId=parseInt(req.body.goodsId);
    if(userId!="" && userId!=undefined && goodsId!="" && goodsId!=undefined){
        pool.getConnection(function(err,connection){
            if(err){
                console.error(err);
                res.send({status:'0'});
            }else {
                //先查询购物车中是否以及有了该商品
                connection.query('select goodsId from tb_shopCart where userId=?',[userId],function(err,result){
                    if(err){
                        console.error(err);
                        res.send({status:'2'});
                    }else {
                        var goodsIdArr=[];

                        for(var i=0;i<result.length;i++){
                            goodsIdArr.push(result[i].goodsId);
                        }
                        if(result.leng=0){
                            connection.query("insert into tb_shopCart (shopCartID,userId,goodsId) values(0,?,?)",[userId,goodsId],function(err,result){
                                connection.release();
                                if(err){
                                    console.error(err);
                                    res.send({status:'5'});
                                }else {
                                    res.send({status:'1'});
                                }
                            });
                        }else {

                            if(goodsIdArr.indexOf(goodsId)!=-1) {
                                res.send({status: '4'});
                            }else {
                                connection.query("insert into tb_shopCart (shopCartID,userId,goodsId,goodsCount) values(0,?,?,1)",[userId,goodsId],function(err,result){
                                    connection.release();
                                    if(err){
                                        res.send({status:'5'});
                                    }else {
                                        res.send({status:'1'});
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    }
});
//获取购物车中的商品
app.post("/getGoodsFromShopCart",function(req,res){
    var userId=req.body.userId;
   // console.log('getGoodsFromShopCart',userId);
    if(userId!=""){
        pool.getConnection(function(err,connection){
            if(err){
                console.error(err);
                res.send({status:"0"});
            }else {
                sss=';";'
                var sql="select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId;";
                var sql2='select * from (select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId where g.goodsFlag=1 and g.goodstatus=1) g where goodsId in (select goodsId from tb_shopCart where userId='+userId+');'
                pool.query(sql2,function(err,result){
                    connection.release();
                    if(err){
                        console.error(err);
                        res.send({status:"2"});
                    }else {
                        //console.log('getGoodsFromShopCart',result);
                        res.send({status:"1",datas:result});
                    }
                });
            }
        });
    }
});

//确认订单
app.post('/getOrder',function(req,res){
    var userId=req.body.userId;
    var goodId=req.body.goodId;
    if(userId!="" && goodId!=""){
        pool.getConnection(function(err,connection){
            if(err){
                console.error(err);
                res.send({status:"0"});
            }else {
                var sql="select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId;";
                var sql2='select * from tb_goods where goodsId in (select goodsId from tb_shopCart where userId='+userId+');'
                pool.query(sql2,function(err,result){
                    connection.release();
                    if(err){
                        console.error(err);
                        res.send({status:"2"});
                    }else {
                        //console.log('getGoodsFromShopCart',result);
                        res.send({status:"1",datas:result});
                    }
                });
            }
        });
    }
})

//获取所有商品类型      OK
app.get("/getAllGoodsType",function(req,res){
    pool.getConnection(function(err,connection){
        if(err){
            console.error(err);
            res.send({status:'0'});
        }else {
            connection.query("select * from tb_goodstype where status=1 ",function(err,result){
                connection.release();
                if(err){
                    console.error(err);
                    res.send({status:'2'});
                }else {
                    res.send({status:'1',datas:result});
                }
            });
        }
    });
});

//获取所有商品活动
app.get("/getAllAction",function(req,res){
    pool.getConnection(function(err,connection){
        if(err){
            res.send({status:'0'});
        }else {
            //select actionId,actionName,actionAgion,actionPre,date_format(startTime,'%Y-%m-%d %H:%m:%s')as startTime,date_format(endTime,'%Y-%m-%d %H:%m:%s') as endTime from tb_action where (startTime<=now() and endTime>=now());
            var str="select actionId,actionName,actionAgion,actionPre,date_format(startTime,'%Y-%m-%d %H:%m:%s')as startTime,date_format(endTime,'%Y-%m-%d %H:%m:%s') as endTime from tb_action where (year(startTime)>=year(now()))";
            connection.query(str,function(err,result){
                if(err){
                    console.log( err );
                    res.send({status:'2'});
                }else {
                    res.send({status:'1',datas:result});
                }
            });
        }
    });
});



app.use(express.static("./"));//默认到page文件下面查找静态资源
//192.168.191.3         172.29.85.2
app.listen(6868,'192.168.43.145',function(err){
    if(err){
        console.error(err);
    } else {
        //D:\Program Files (x86)\MyProgram\practice\final\WD-APP
        console.log("当前路径",__dirname);
        console.log("服务器已经启动..");
    }
});
