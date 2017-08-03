/**
 * Created by 张红玉 on 2016/9/22.
 */
//=============================================请求模块=============================================
var express=require("express");//创建服务器
var nodemailer=require("nodemailer");//请求邮件模块
var cookieparser=require("cookie-parser");//cookie
var session=require("express-session");//session
var mysql=require("mysql");//数据库操作
var fs=require("fs");//文件操作
var bodyparser=require("body-parser");//处理请求的
var multer=require("multer");//处理文件上传的

var fileUpLoadPathImg="/three/img";
var fileUpLoadPathXFImg="/xfimg";    //存入数据库的路径
var fileUpLoadPathimages="/three/images";
var fileUploadPathImages="/images";//存入数据库的路径
var fileUpLoadPathZGImg="/zgimg";
var upload=multer({dest:fileUpLoadPathImg});//存入本地服务器的路径

var app=express();//创建一个应用
//=============================================配置=============================================

//配置数据库连接词
var pool=mysql.createPool({
    host:"127.0.0.1",
    port:3306,
    database:"shop",
    user:"root",
    password:"123"
});
//配置bodyparser中间件
app.use(bodyparser.urlencoded({extended:false}));
//配置和使用session中间件
app.use(session({
    secret:'keyboard cat',//私密   session id的标识
    resave:true,//每次重新请求是否重新设置  session id
    saveUninitialized:true,//设置session cookie ,默认值为connect.sid
    cookie:{ secure:false,maxAge:6000*60*5 }//secure 用于http  变成https  过期时间
}));
var transporter=nodemailer.createTransport({//邮件传输
    host:"smtp.qq.com", //qq smtp服务器地址
    secureConnection:false, //是否使用安全连接，对https协议的
    port:465, //qq邮件服务所占用的端口
    auth:{
        user:"396987000@qq.com",//开启SMTP的邮箱，有用发送邮件
        pass:"fxdohzxlfjuebjai"//授权码
    }
});


//=======================================管理员操作==============================================
//获取所有的商品类型
app.get("/getAllGoodsType",function(req,res){
    pool.getConnection(function(err,connection){
        if(err){
            console.error(err);
            res.send("0");
        }else {
            connection.query("select * from tb_goodstype where status=1 ",function(err,result){
                connection.release();
                if(err){
                    console.error(err);
                    res.send("2");
                }else {
                    res.send(result);
                }
            });
        }
    });
});
//添加商品类型  OK
app.use("/addGoodsType",function(req,res){
    var goodsTypeName=req.body.goodsTypeName;
   if(goodsTypeName==""){
       res.send("0");
   }else {
       pool.getConnection(function(err,connection){
           connection.query("insert into tb_goodsType values(0,?,1)",[goodsTypeName],function(err,result){
               connection.release();
               if(err) {
                   console.error(err);
                   res.send("2");
               }else {
                   //console.info(result);
                   res.send("1");

               }
           });
       });
   }
})
//添加商品         OK         获取图片的name
app.post("/addGoods",upload.array("goodsPic"),function(req,res){
    var goodsName=req.body.goodsName;
    var normalPrice=req.body.normalPrice;
    var typeId=req.body.typeId;
    var str="新娘婚礼一字肩结婚婚纱韩版新款齐地敬酒服";
    if(typeId=="1"){
        fileUploadPath=fileUpLoadPathOuImg;
    }else if(typeId=="2"){
        fileUploadPath=fileUpLoadPathHanImg;
    }else {
        fileUploadPath=fileUpLoadPathZhongImg;
    }
    if(goodsName=="" || normalPrice==""){
        res.send("0");
        console.info("没有获取到数据");
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                console.error(err);
                res.send("2");
            }else{
                var fileName="";
                var filePath="";
                var file;
                if(req.files!=undefined){
                    for(var i in req.files){
                       file=req.files[i];
                        fileName=file.originalname;
                        str=__dirname+fileUpLoadPathImg+"/"+fileName
                        console.log("strpath",str);
                        fs.renameSync(file.path,str);
                        if(filePath!=""){//则说明已经有图片了，因此用，隔开
                            filePath+=",";
                        }
                        filePath+=fileUploadPath+"/"+fileName;
                    }
                }
                connection.query("insert into tb_goods values(0,?,?,?,?,?,?)",[typeId,goodsName,str,normalPrice,filePath,"1"],function(err,result){
                    connection.release();
                    if(err){
                        console.error(err);
                        res.send("0");
                    }else {
                        res.send("1");
                    }
                });
            }
        });
    }
});
//获取所有商品信息  OK
app.post("/getAllGoodsInfo",function(req,res){
    pool.getConnection(function(err,connection){
        if(err){
            console.error(err);
            res.send(' {"err":"0"} ');
        }else {
            var sql="select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId;";
            pool.query(sql,function(err,result){
                connection.release();
                if(err){
                    console.error(err);
                    res.send(' {"err":"0"} ');
                }else {
                    res.send(result);
                }
            });
        }
    });
});
//商品上下架  OK
app.post("/onSale",function(req,res){
    var goodsId=req.body.goodsId;
    var value=req.body.value;
    //console.info( value );
    var flag="1";
    flag=value=="[上架]"? "0":"1";
    //console.info( flag );
    pool.getConnection(function(err,connection){
        if(err){
            console.error(err);
            res.send("0");
        }else {
            console.log("flag : ",flag);
            console.log("goodsId : ",goodsId);
            connection.query("update tb_goods set goodsFlag=?  where goodsId=?",[flag,goodsId],function(err,result){
                connection.release();
                if(err){
                    console.error(err);
                    res.send("2");
                }else {
                    res.send("1")
                }
            });
        }
    });
});
//添加商品活动  OK
app.post("/addAction",function(req,res){
    var actionName=req.body.actionName;
    var actionPre=req.body.actionPre;
    var actionAgion=req.body.actionAgion;
    var startTime=req.body.startTime;
    var endTime=req.body.endTime;
    if(startTime=="" || endTime=="" || actionName=="" || actionPre=="" || actionAgion==""){
        res.send("0");
    }else {
        pool.getConnection(function(err,connection){
            connection.query("insert into tb_action values(0,?,?,?,?,?)",[startTime,endTime,actionName,actionAgion,actionPre],function(err,result){
                connection.release();
                if(err){
                    res.send("0");
                    console.error(err);
                }else {
                    res.send("1");
                }
            });
        });
    }
});
//添加参与活动的商品  OK
app.post("/addActionInfo",function(req,res){
     var actionId=req.body.actionID;
     var goodsId= eval(req.body.goodsId);
    console.log( "actionId : ",actionId );
    if( actionId=="" || goodsId==""){
        res.send("0");
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                res.send("0");
                console.log(err);
            }else {
                var arr=[];
                var sql="";
                pool.getConnection(function(err,connection){
                    if(err){
                        res.send("0");
                        console.log("1 : ",err);
                    }else {
                        connection.query("select goodsId from tb_actionInfo where actionId=?",actionId,function(err,result){
                            if(err){
                                res.send("0");
                                console.log("2 : ",err);
                            }else{
                                var temp=[],temparray=[];
                                for(var i=0;i<result.length;i++){
                                    temp[result[i].goodsId]=true;
                                }
                                for(var i=0;i<goodsId.length;i++){
                                    if(!temp[goodsId[i]]){
                                        arr.push(goodsId[i]);
                                    }
                                }
                                //console.log("result[0] : ",result[0].goodsId);
                                //console.log("result.lentg:  : ",result.length);
                                console.log("goodsId: ",goodsId);

                                console.log( "arr : ",arr );
                                sql="insert into tb_actionInfo (actionId,goodsId) values";
                                for(var i=0;i<arr.length-1;i++){
                                    sql+=" ("+actionId+","+arr[i]+"),";
                                }
                                sql+="("+actionId+","+arr[arr.length-1]+");";

                                console.log("sql : ",sql);
                                connection.query(sql,function(err,result){
                                   if(err){
                                       res.send("3");
                                       console.log("3 : ",err);
                                   } else {
                                       res.send("1");
                                   }
                                });

                            }
                        });
                    }
                });
            }
        });

    }
});
//获取所有商品活动  OK
app.get("/getAllAction",function(req,res){
    pool.getConnection(function(err,connection){
        if(err){
            res.send("0");
        }else {
            connection.query("select * from tb_action ",function(err,result){
                if(err){
                    console.log( err );
                    res.send("2");
                }else {
                   // console.log(result);
                    res.send(result);
                }
            });
        }
    });
});
//检测注册名  OK
app.post("/checkAdminName",function(req,res){
    console.info( req.body );
    if(req.body.adRegName==""){
        res.send("0");
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                res.send("0");
            }else {
                connection.query("select adminId from tb_admin where adminName=?",[req.body.adRegName],function(err,result){
                    if(err){
                        res.send("0");
                    }else {
                        if(result.length>0){
                            console.log( result );
                            res.send("3");
                        }else {
                            res.send("1");
                        }
                    }
                });
            }
        });
    }
});
//管理员登录  OK
app.post("/adminLogin",function(req,res){
    /*adLoginName:adLoginName,adLoginPwd:adLoginPwd*/
   if(req.body.adLoginName=="" || req.body.adLoginPwd==""){
       res.send("0");
   } else {
       pool.getConnection(function(err,connection){
           if(err){
               res.send("0");
           }else {
               connection.query("select * from tb_admin",[req.body.adLoginName,req.body.adLoginPwd],function(err,result){
                     if(err){
                         res.send("0");
                     }else {
                         req.session.adminInfo=result[0];
                         res.send("1");//登录成功
                     }
               });
           }
       });
   }
});
//管理员注册  OK
app.use("/adminReg",function(req,res){
    /*adRegName:adRegName,adRegPwd:adRegPwd*/
    var adRegName=req.body.adRegName;
    var adRegPwd=req.body.adRegPwd;
    if(adRegName=="" || adRegPwd==""){
        res.send("0");
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                res.send("0");
                
            }else {
                connection.query("insert into tb_admin values(0,?,?)",[adRegName,adRegPwd],function(err,result){
                   if(err){
                       res.send("0");
                   } else {
                       res.send("1");
                   }
                });
            }
        });
    }
});
//管理员检测登录   OK
app.get("/checkAdminLogin",function(req,res){
    if(req.session.adminInfo=="" || req.session.adminInfo==null || req.session.adminInfo==undefined){
        res.send("0");
    }else {
        res.send("1");
    }
})
//管理员退出  OK
app.post("/adLogout",function(req,res){
    req.session.adminInfo=null;
    res.send("1");
});

//==========================================客户端操作===================================================

//用户注册  OK
app.post("/register",function(req,res){
    var regName=req.body.regName;
    var regPwd=req.body.regPwd;
    var regPwdAgain=req.body.regPwdAgain;
    var sex=req.body.sex;
    var verify=req.body.verify;
   // console.log("req.body  : ",req.body);
    if(regName=="" || regPwd==""){
        res.send("0");
    }else if(regPwd!=regPwdAgain) {
        res.send("2");
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                res.send("3");
                console.error(err);
            }else {
                connection.query("insert into tb_user (userId,userName,userPwd,userSex) values(0,?,?,?)",[regName,regPwd,sex],function(err,result){
                    connection.release();
                    if(err){
                        res.send("4");
                        console.info(err);
                    } else {
                        if( verify==req.session.verify){
                            res.send("1");//注册成功
                        }else {
                            res.send("5");
                        }

                    }
                });
            }
        });
    }
});
//检测用户名是否被占用  OK
app.post("/checkName",function(req,res){
    var name=req.body.regName;
    //console.log("check name  req.body  : ",req.body);
    pool.getConnection(function(err,connection){
        if(err){
            res.send("0");
        }else {
            connection.query("select userId from tb_user where userName=?",[name],function(err,result){
                connection.release();
                if(err){
                    console.log( err );
                    res.send("2")
                }else {
                    if(result.length>0){
                        console.log( result );
                        res.send("3");
                    }else {
                        res.send("1");
                    }
                }
            });
        }
    });
});
//用户登录  OK
app.post("/login",function(req,res){
    var loginName=req.body.loginName;
    var loginPwd=req.body.loginPwd;
    if(loginName==""){
        res.send("0");
    }else if(loginPwd=="") {
        res.send("2");
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                res.send("3");
                console.error(err);
            }else {
                connection.query("select * from tb_user where userName=? and userPwd=?",[loginName,loginPwd],function(err,result){
                    connection.release();
                    if(err){
                        res.send("4");
                        console.info(err);
                    } else {

                       if(result.length>0){
                           req.session.userInfo=result[0];
                           res.send(result);//登录成功
                       }else {
                           res.send("5");
                       }

                    }
                });
            }
        });
    }
});
//检测登录  OK
app.post("/checkLogin",function(req,res){
    //console.info("---- check   --", req.session.userInfo );
    if(req.session.userInfo==null || req.session.userInfo==undefined || req.session.userInfo.length==0){
       res.send("0");
   }else {
        //console.log(req.session.userInfo);
        //req.session.userInfo.userId;
        res.send(req.session.userInfo);
    }
});
//用户退出 OK
app.post("/logout",function(req,res){
    req.session.userInfo=null;
    res.send("1");
});

//查看用户详情
app.post("/getUserInfo",function(req,res){
    var userId=req.body.userId;
    if(req.body.userId==""){
        res.send("0");
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                res.send("2");
            }else {
                connection.query("select u.*,a.* from tb_user u,tb_address a where u.userId=a.userId and u.userId=?",[userId],function(err,result){
                    if(err){
                        res.send("3");
                    }else {
                        console.log(result);
                        res.send(result);
                    }
                });
            }
        });
    }
});
//个人资料保存
app.post("/conserve",function(req,res){
    console.log(req.body);
    res.send("1");
});


//第一次查询分页
app.post("/showGoodsInfoByPageOne",function(req,res){
    var pageNo=req.body.pageNo;
    pool.getConnection(function(err,conn){
        res.header("Content-Type","application/json");
        if(err){
            console.info('{"err":"0"}');
        }else{
            conn.query("select g.* from tb_goods g,tb_goodsType t where g.typeId=t.typeId limit "+pageNo*6+","+6,function(err,result){
                if(err){
                    console.info('{"err":"0"}');
                }else{
                    var obj={objs:result};
                    conn.query("select count(goodsId) as total from tb_goods",function(err,result){
                        conn.release();
                        var total=0;
                        if(err){
                            total=0;
                        }else{
                            total=result[0].total;
                        }
                        obj.total=total;
                        res.send(obj);
                    });
                }
            });
        }
    });
});
//点击刷新
app.post("/showGoodsInfoByPage",function(req,res){
    var pageNo=req.body.pageNo;
    pool.getConnection(function(err,conn){
        res.header("Content-Type","application/json");
        if(err){
            res.send('{"err":"0"}');
        }else{                                                                                      //  (pageNo*6,6) 0,1
            conn.query("select g.* from tb_goods g,tb_goodsType t where g.typeId=t.typeId limit "+(pageNo*6)+","+6,function(err,result){
                var obj={objs:result};
                conn.release();
                if(err) {
                    res.send('{"err":"0"}');
                }else{
                    res.send(obj);
                }
            });
        }
    });
});
//发表评论
app.post("/deliverComment",upload.array("file"),function(req,res){
    pool.getConnection(function(err,conn){
        if (err) {
            console.info(err);
            res.send("2");
        } else {
            var fileName="";
            var filePath="";
            var file;
            if(req.files!=undefined){
                for(var i in req.files){
                    file=req.files[i];
                    fileName=new Date().getTime()+"_"+file.originalname;
                    console.log("file.path :   ",file.path);
                    fs.renameSync(file.path,__dirname+fileUpLoadPathimages+"/"+fileName);
                    if( filePath!=""){
                        filePath+=",";
                    }
                    filePath+=fileUploadPathImages+"/"+fileName;//1.jpg,2.jpg
                }
            }
            conn.query("insert into tb_comment values(0,0,0,?,now(),?)", [req.body.commentDesc,filePath], function (err, result) {
                console.info( result );
                if (err) {
                    console.info(err);
                    res.send("3");
                } else {
                    res.send(result.insertId+"");
                }
                conn.release();
            });
        }
    });

});





/////////通过商品ID获取当前商品信息，跳转到shopping.html/////////////////////////////////////////////////
app.post("/bygIdgetInfo",function(req,res){
    var goodsId=req.body.goodsId;
    pool.getConnection(function(err,conn){
        res.header("Content-Type","application/json");
        if(err){
            console.info('{"err":"0"}');
        }else{
            conn.query("select * from tb_goods where goodsId="+goodsId,function(err,result){
                conn.release();
                if(err){
                    console.info('{"err":"0"}');
                }else{
                    var obj={objs:result};
                    res.send( obj );
                }
            });
        }
    });
});
//判断用户是否登录,用  req.session
app.post("/judgeIsLogin",function(req,res){
    var userInfo=req.session.userInfo;
    if(userInfo){
        res.send(req.session.userInfo);
    }else{
        res.send("0");
    }
});
//获取当前用户购物车的信息
app.post("/getUserCartInfo",function(req,res){
    var userId=req.body.userId;
    pool.getConnection(function(err,conn){
        if(err){
            console.info(err);
        }else{
            conn.query("select goodsId from tb_shopCart where userId="+userId,function(err,result){
                conn.release();
                if(err){
                    console.info(err);
                }else{
                    res.send(result);
                }
            });
        }
    });
});


//点击加入购物车，存数据到数据库
app.post("/addCart",function(req,res){
    var goodsId=req.body.goodsId;
    var userId=req.body.userId;
    pool.getConnection(function(err,conn){
        if(err){
            console.info(err);
        }else{
            conn.query("insert into tb_shopCart values(0,?,?,1)",[userId,goodsId],function(err,result){
                conn.release();
                if(err){
                    console.info("ERR"+err);
                }else{
                    res.send( result );
                }
            });
        }
    });
});

app.post("/lookCart",function(req,res){
    var goodsId=req.body.local;
    pool.getConnection(function(err,conn){
        res.header("Content-Type","application/json");
        if(err){
           console.info(err);
       }else{
           conn.query("select * from (select g.* from tb_shopCart c,tb_goods g where g.goodsId=c.goodsId) a where a.goodsId in ("+goodsId+")",function(err,result){
              conn.release();
               if(err){
                   console.info("查商品"+err);
               }else{
                   var obj={objs:result};
                   res.send( obj );
               }
           });
       }
   }) ;
});

app.post("/delete",function(req,res){

});

//使用邮箱发送验证码  OK
app.post("/getEmail",function(req,res){ //调用指定的邮箱给用户发送邮件
    var email=req.body.email
    //console.log(req.body.email);
   if(email==""){
       res.send("0");
   }else {
       var code="";
       while(code.length<5){
           code+=Math.floor(Math.random()*10);
       }
       var mailOption={
           from:"396987000@qq.com",//邮件发送方
           to:email,//邮件接收方
           subject:"WD婚纱网站注册校验码",//主题
           html:"<h1>欢迎注册WD婚纱网站，您本次的注册验证码为："+code+"一分钟内有效，如非本人操作，请忽略</h1>"
       };
       transporter.sendMail(mailOption,function(error,info){
           if(error){
               res.send("2");
               return console.info(error);
           }else{
               req.session.verify=code;
               res.send("1");
               console.info("Message send"+code);
           }
       })
   }
});

















//使用中间件
//=============================================配置=============================================
app.use(express.static("three"));//默认到page文件下面查找静态资源

app.listen(80,function(err){
    if(err){
        console.error(err);
    } else {
        console.log(__filename);
        console.log("服务器已经启动..");
    }
});

