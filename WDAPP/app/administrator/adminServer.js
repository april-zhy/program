/**
 * Created by uidp5340 on 2017/2/23.
 */


var fs=require("fs");//文件操作
var multer=require("multer");//处理文件上传的

var express=require("express");             //创建服务器
var bodyparser = require("body-parser");//处理发送请求过来的内容

var app=express();                          //创建一个应用
var mysql=require("mysql");                 //数据库操作
var path = require('path');                 //导入path模块



var session=require("express-session");//session
app.use(session({
    secret:'keyboard cat',//私密   session id的标识
    resave:true,//每次重新请求是否重新设置  session id
    saveUninitialized:true,//设置session cookie ,默认值为connect.sid
    cookie:{ secure:false,maxAge:6000*60*5 }//secure 用于http  变成https  过期时间
}));

/*图片上传存储在数据库的路径*/
var upLoadZSimg="/ZSimg";
var upLoadHSimg="/HSimg";
var upLoadOSimg="/OSimg";



var upLoadImgPath="/WDAPP/app/administrator/goodsImg";//本地路经
var upload=multer({dest:upLoadImgPath});//将上传的图片，存入本地服务器的路径


//配置bodyparser中间件//将请求的内容进行解析
app.use(bodyparser.urlencoded({extended:false}));
//配置数据库连接词
var pool=mysql.createPool({
    host:"127.0.0.1",
    port:3306,
    database:"shop",
    user:"root",
   /* password:"Aa123456"*/
    password:"aaaa"
});




/*获取所有类型      OK*/
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
//删除商品类型     OK
app.post("/delGoodsType",function (req,res) {
    var typeId=req.body.typeId;
    if(typeId==""){
        res.send("0");
    }else {
        pool.getConnection(function (err,connection) {
            if(err){
                res.send("2");
            }else {
                connection.query('update tb_goodsType set status=0 where typeId='+typeId,function (err,result) {
                    if(err){
                        console.log("err   ",err);
                        res.send("3");
                    }else {
                        console.log(result);
                        res.send("1");
                    }
                })
            }
        })
    }
});

//管理员退出   OK
app.post("/adLogout",function (req,res) {
    req.session.adminInfo=null;
    res.send("1");
});
//管理员注册
app.use("/adminReg",function(req,res){
    var adRegName=req.body.adRegName;
    var adRegPwd=req.body.adRegPwd;
    if(adRegName=="" || adRegPwd==""){
        res.send("0");
    }else {
        pool.getConnection(function(err,connection){
            if(err){
                res.send("2");
            }else {
                connection.query("insert into tb_admin values(0,?,?)",[adRegName,adRegPwd],function(err,result){
                    if(err){
                        console.log('管理员注册错误：',err);
                        res.send("3");
                    } else {
                        res.send("1");
                    }
                });
            }
        });
    }
});
//管理员登录       OK
app.post("/adminLogin",function (req,res) {
    var adminName=req.body.adLoginName;
    var adminPwd=req.body.adLoginPwd;
    if(adminName=="" || adminPwd==""){
        res.send("0");
    }else {
        pool.getConnection(function (err,connnection) {
            if(err){
                console.log(err);
                res.send("0")
            }else {
                connnection.query("select * from tb_admin where adminName=? and adminPwd=?",[adminName,adminPwd],function (err,result) {
                    if(err){
                        res.send("2");
                    }else if(result.length>0){
                        /*console.log(result);*/
                        req.session.adminInfo=result[0];
                        res.send("1");
                    }else {
                        console.log(result);
                        res.send("3")
                    }
                })
            }
        })
    }

})
//管理员检测登录   OK
app.get("/checkAdminLogin",function(req,res){
    if(req.session.adminInfo=="" || req.session.adminInfo==null || req.session.adminInfo==undefined){
        res.send("0");
    }else {
        res.send(req.session.adminInfo);
    }
});

//显示所有的商品活动   OK
app.get("/getAllAction",function(req,res){
    pool.getConnection(function(err,connection){
        if(err){
            res.send("0");
        }else {
            var str="select actionId,actionName,actionAgion,actionPre,date_format(startTime,'%Y-%m-%d %H:%m:%s')as startTime,date_format(endTime,'%Y-%m-%d %H:%m:%s') as endTime from tb_action where (endTime>=now())"
            connection.query(str,function(err,result){
                if(err){
                    console.log( err );
                    res.send("2");
                }else {
                    res.send(result);
                }
            });
        }
    });
});

//添加商品活动   OK
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
//添加商品   OK
app.post("/addGoods",upload.array("goodsPic"),function(req,res){
    var goodsName=req.body.goodsName;
    var normalPrice=req.body.normalPrice;
    var typeId=req.body.typeId;
    var str="";
    if(typeId=="1"){//格调中式   var upLoadZSimg="./ZSimg";
        fileUploadPath=upLoadZSimg;
        str="2017新款新娘结婚嫁衣礼服,古装中式婚纱秀敬酒服";

    }else if(typeId=="2"){//奢华欧式    var upLoadOSimg="./OSimg";
        fileUploadPath=upLoadOSimg;
        str="欧式2017一字肩新娘结婚婚纱深V蕾丝复古大牌礼服";

    }else if(typeId=="3"){//唯美韩式     var upLoadHSimg="./HSimg";
        fileUploadPath=upLoadHSimg;
        str="2017新娘结婚婚纱韩版新款齐地敬酒服";
    }
    if(goodsName=="" || normalPrice==""){
        res.send("0");
        console.info("添加商品没有获取到数据");
    }else {
        pool.getConnection(function (err,connection) {
            if(err){
                console.log("添加商品链接数据库错误:",err);
                res.send("2")
            }else {
                var fileName="";  var filePath="";  var file;

              //  console.log('上传的文件,res.files: ',req.files);

                if(req.files!=undefined){
                    for(var i in req.files){
                        file=req.files[i];
                        fileName=file.originalname;
                        //__dirname  :   g:\WDAPP\service
                        pathStr=file.destination+fileUploadPath+"/"+fileName

                       // console.log("文件原始路径 file.path: ",file.path);
                        //console.log("重命名后的路径 pathstr: ",pathStr);
                        //fs.renameSync(oldpath,newpath);
                        fs.rename(file.path,pathStr,function(){
                            if(err){
                                console.log("文件重命名错误，",err);
                            }
                        });
                        if(filePath!=""){//则说明已经有图片了，因此用，隔开
                            filePath+=",";
                        }
                        filePath+="/goodsImg"+fileUploadPath+"/"+fileName;
                       // console.log('存入数据库后的所有文件路径',filePath);

                    }
                }
               // res.send("1");
                connection.query("insert into tb_goods values(0,?,?,?,?,?,?,now(),?)",[typeId,goodsName,str,normalPrice,filePath,'1','1'],function(err,result){
                    connection.release();
                    if(err){
                        console.error("添加商品插入数据错误： ",err);
                        res.send("2");
                    }else {
                        res.send("1");
                    }
                });

            }
        })
    }
});
//获取商品信息    OK
app.post("/getAllGoodsInfo",function(req,res){
    pool.getConnection(function(err,connection){
        if(err){
            console.error(err);
            res.send("0");
        }else {
            var sql="select g.*,(g.normalPrice*t.actionAgion*0.1) as realPrice from tb_goods g left join (select b.*,a.goodsId from tb_actioninfo a,(select * from tb_action where startTime<=now() and endTime>=now()) b where a.actionId=b.actionid) t on t.goodsId=g.goodsId where g.goodstatus=1;";
            pool.query(sql,function(err,result){
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

//商品上下架  OK
app.post("/onSale",function(req,res){
    var goodsId=req.body.goodsId;
    var value=req.body.value;
    var flag="1";
    flag=value=="[上架]"? "0":"1";
    pool.getConnection(function(err,connection){
        if(err){
            console.error(err);
            res.send("0");
        }else {
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

//删除商品
app.use("/onDelete",function (req,res) {
    var goodsId=req.body.goodsId;
    pool.getConnection(function(err,connection){
        if(err){
            console.error(err);
            res.send("0");
        }else {
            connection.query("update tb_goods set goodstatus=0 where goodsId=?",[goodsId],function(err,result){
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


//添加参与活动的商品  OK
app.post("/addActionInfo",function(req,res){
    var actionId=req.body.actionID;
    var goodsId= eval(req.body.goodsId);
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
                    }else {
                        connection.query("select goodsId from tb_actionInfo where actionId=?",actionId,function(err,result){
                            if(err){
                                res.send("0");
                            }else{
                                //数组差集
                                var sqlItem;
                                var fromSqlgoodsIdArr=[];
                                var sendToSqlgoodsIdArr=[];
                                var tempArr=new Object();

                                //数据库里面的goodsId
                                for(var i=0;i<result.length;i++){
                                    sqlItem=result[i].goodsId;
                                    fromSqlgoodsIdArr.push(sqlItem);
                                }
                                fromSqlgoodsIdArr=fromSqlgoodsIdArr.sort();
                                goodsId=goodsId.sort();
                                //用户提交的goodsId

                                //存储至数据库的goodsId
                                for(var j=0;j<fromSqlgoodsIdArr.length;j++){
                                    tempArr[fromSqlgoodsIdArr[j]]=1;
                                }
                                for(z=0;z<goodsId.length;z++){
                                    if(tempArr[goodsId[z]]!=1){
                                        sendToSqlgoodsIdArr.push(goodsId[z])
                                    }
                                }
                                sql="insert into tb_actionInfo (actionId,goodsId) values";
                                for(var i=0;i<sendToSqlgoodsIdArr.length-1;i++){
                                    sql+=" ("+actionId+","+sendToSqlgoodsIdArr[i]+"),";
                                }
                                sql+="("+actionId+","+sendToSqlgoodsIdArr[sendToSqlgoodsIdArr.length-1]+");";
                                //console.log("sql : ",sql);
                                connection.query(sql,function(err,result){
                                    if(err){
                                        res.send("3");

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

//D:\Program Files (x86)\MyProgram\practice\final\service
app.use(express.static("../administrator"));//默认到page文件下面查找静态资源
app.listen(80,'127.0.0.1',function(err){
    if(err){
        console.error('服务器启动失败：',err);
    } else {
        console.log('当前路径',__dirname);
        console.log("服务器已经启动..");
    }
});
