/*
Navicat MySQL Data Transfer

Source Server         : zhy
Source Server Version : 50513
Source Host           : localhost:3306
Source Database       : shop

Target Server Type    : MYSQL
Target Server Version : 50513
File Encoding         : 65001

Date: 2017-05-16 18:44:45
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `tb_action`
-- ----------------------------
DROP TABLE IF EXISTS `tb_action`;
CREATE TABLE `tb_action` (
  `actionId` int(11) NOT NULL AUTO_INCREMENT,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `actionName` varchar(100) NOT NULL,
  `actionAgion` int(11) NOT NULL,
  `actionPre` int(11) NOT NULL,
  PRIMARY KEY (`actionId`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_action
-- ----------------------------
INSERT INTO tb_action VALUES ('101', '2016-04-30 00:00:00', '2016-05-03 00:00:00', '欢乐过五一', '8', '3');
INSERT INTO tb_action VALUES ('102', '2016-05-31 00:00:00', '2016-06-02 00:00:00', '端午节，尽情放粽', '8', '3');
INSERT INTO tb_action VALUES ('103', '2016-05-01 00:00:00', '2016-05-03 00:00:00', '五一来了，清凉一夏', '6', '3');
INSERT INTO tb_action VALUES ('104', '2016-10-01 00:00:00', '2016-10-07 00:00:00', '庆国庆', '7', '3');
INSERT INTO tb_action VALUES ('105', '2017-05-31 00:00:00', '2017-06-02 00:00:00', '端午节，尽情放粽', '8', '3');
INSERT INTO tb_action VALUES ('107', '2017-01-01 00:00:00', '2017-06-01 00:00:00', '测试活动', '8', '3');
INSERT INTO tb_action VALUES ('108', '2017-11-01 00:00:00', '2017-11-11 00:00:00', '双十一，半价狂欢', '5', '3');

-- ----------------------------
-- Table structure for `tb_actioninfo`
-- ----------------------------
DROP TABLE IF EXISTS `tb_actioninfo`;
CREATE TABLE `tb_actioninfo` (
  `actionInfoId` int(11) NOT NULL AUTO_INCREMENT,
  `actionId` int(11) DEFAULT NULL,
  `goodsId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`actionInfoId`)
) ENGINE=InnoDB AUTO_INCREMENT=101086 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_actioninfo
-- ----------------------------
INSERT INTO tb_actioninfo VALUES ('101001', '101', '110001');
INSERT INTO tb_actioninfo VALUES ('101057', '107', '110001');
INSERT INTO tb_actioninfo VALUES ('101058', '107', '110002');
INSERT INTO tb_actioninfo VALUES ('101059', '107', '110003');
INSERT INTO tb_actioninfo VALUES ('101060', '107', '110004');
INSERT INTO tb_actioninfo VALUES ('101061', '107', '110005');
INSERT INTO tb_actioninfo VALUES ('101062', '107', '110006');
INSERT INTO tb_actioninfo VALUES ('101063', '107', '110007');
INSERT INTO tb_actioninfo VALUES ('101064', '107', '110008');
INSERT INTO tb_actioninfo VALUES ('101065', '107', '110031');
INSERT INTO tb_actioninfo VALUES ('101066', '107', '110032');
INSERT INTO tb_actioninfo VALUES ('101067', '107', '110033');
INSERT INTO tb_actioninfo VALUES ('101068', '107', '110034');
INSERT INTO tb_actioninfo VALUES ('101069', '107', '110035');
INSERT INTO tb_actioninfo VALUES ('101070', '107', '110036');
INSERT INTO tb_actioninfo VALUES ('101071', '107', '110037');
INSERT INTO tb_actioninfo VALUES ('101072', '107', '110038');
INSERT INTO tb_actioninfo VALUES ('101073', '107', '110039');
INSERT INTO tb_actioninfo VALUES ('101074', '105', '110001');
INSERT INTO tb_actioninfo VALUES ('101075', '105', '110002');
INSERT INTO tb_actioninfo VALUES ('101076', '105', '110003');
INSERT INTO tb_actioninfo VALUES ('101077', '105', '110004');
INSERT INTO tb_actioninfo VALUES ('101078', '105', '110005');
INSERT INTO tb_actioninfo VALUES ('101079', '105', '110006');
INSERT INTO tb_actioninfo VALUES ('101080', '105', '110007');
INSERT INTO tb_actioninfo VALUES ('101081', '105', '110008');
INSERT INTO tb_actioninfo VALUES ('101082', '107', '110009');
INSERT INTO tb_actioninfo VALUES ('101083', '105', '110009');
INSERT INTO tb_actioninfo VALUES ('101084', '105', '110010');
INSERT INTO tb_actioninfo VALUES ('101085', '107', '110011');

-- ----------------------------
-- Table structure for `tb_address`
-- ----------------------------
DROP TABLE IF EXISTS `tb_address`;
CREATE TABLE `tb_address` (
  `addressId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `addAddress` varchar(255) NOT NULL,
  `addStreet` varchar(50) NOT NULL,
  `addPost` varchar(10) NOT NULL,
  `addFlage` varchar(10) DEFAULT NULL,
  `addName` varchar(30) DEFAULT NULL,
  `addTel` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`addressId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_address
-- ----------------------------
INSERT INTO tb_address VALUES ('1', '16005', '湖南省衡阳市珠晖区', '衡花路23号', '421000', '1', '张红玉', '13087344578');
INSERT INTO tb_address VALUES ('2', '16003', '北京市北京市东城区', '解放路12号', '421519', '1', '张三', '13087344578');
INSERT INTO tb_address VALUES ('3', '16003', '北京市北京市东城区', '解放路20号', '421618', '1', '李四', '13087344578');
INSERT INTO tb_address VALUES ('4', '16014', '北京市北京市东城区', '测试数据', '123456', '1', 'zhyzhy', '111111111111');

-- ----------------------------
-- Table structure for `tb_admin`
-- ----------------------------
DROP TABLE IF EXISTS `tb_admin`;
CREATE TABLE `tb_admin` (
  `adminId` int(11) NOT NULL AUTO_INCREMENT,
  `adminName` varchar(20) NOT NULL,
  `adminPwd` varchar(20) NOT NULL,
  PRIMARY KEY (`adminId`),
  UNIQUE KEY `adminName` (`adminName`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_admin
-- ----------------------------
INSERT INTO tb_admin VALUES ('101', 'lzj', '1234');
INSERT INTO tb_admin VALUES ('102', 'zhy', '1234');
INSERT INTO tb_admin VALUES ('103', 'zhy123', 'zhy123456');
INSERT INTO tb_admin VALUES ('104', 'zhy123456', 'zhy123456');
INSERT INTO tb_admin VALUES ('105', '123456', '123456');
INSERT INTO tb_admin VALUES ('106', '123456789', '123456789');

-- ----------------------------
-- Table structure for `tb_comment`
-- ----------------------------
DROP TABLE IF EXISTS `tb_comment`;
CREATE TABLE `tb_comment` (
  `commentId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(50) NOT NULL,
  `commentDesc` varchar(255) NOT NULL,
  `commentTime` varchar(50) NOT NULL,
  `goodsId` int(11) NOT NULL,
  PRIMARY KEY (`commentId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_comment
-- ----------------------------
INSERT INTO tb_comment VALUES ('1', 'zhy', '评价内容', '2017-04-01', '110001');
INSERT INTO tb_comment VALUES ('2', 'zhy2', '评价内容2', '2017-04-01', '110001');

-- ----------------------------
-- Table structure for `tb_goods`
-- ----------------------------
DROP TABLE IF EXISTS `tb_goods`;
CREATE TABLE `tb_goods` (
  `goodsId` int(11) NOT NULL AUTO_INCREMENT,
  `typeId` int(11) DEFAULT NULL,
  `goodsName` varchar(40) NOT NULL,
  `goodsDetail` varchar(100) NOT NULL,
  `normalPrice` decimal(10,2) NOT NULL,
  `goodsImg` varchar(255) NOT NULL,
  `goodsFlag` int(2) NOT NULL,
  `goodsTime` datetime NOT NULL,
  `goodstatus` int(2) NOT NULL,
  PRIMARY KEY (`goodsId`)
) ENGINE=InnoDB AUTO_INCREMENT=110013 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_goods
-- ----------------------------
INSERT INTO tb_goods VALUES ('110001', '1', '敬酒服01', '2017新款新娘结婚嫁衣礼服,古装中式婚纱秀敬酒服', '789.00', '/goodsImg/ZSimg/zs0101.jpg,./goodsImg/ZSimg/zs0102.jpg,./goodsImg/ZSimg/zs0103.jpg,./goodsImg/ZSimg/zs0104.jpg,./goodsImg/ZSimg/zs0105.jpg', '1', '2017-02-01 10:28:54', '1');
INSERT INTO tb_goods VALUES ('110002', '1', '敬酒服02', '2017新款新娘结婚嫁衣礼服,古装中式婚纱秀敬酒服', '689.00', '/goodsImg/ZSimg/zs0201.jpg,./goodsImg/ZSimg/zs0202.jpg,./goodsImg/ZSimg/zs0203.jpg,./goodsImg/ZSimg/zs0204.jpg,./goodsImg/ZSimg/zs0205.jpg', '1', '2017-02-01 10:34:45', '1');
INSERT INTO tb_goods VALUES ('110003', '1', '敬酒服03', '2017新款新娘结婚嫁衣礼服,古装中式婚纱秀敬酒服', '531.00', '/goodsImg/ZSimg/zs0301.jpg,./goodsImg/ZSimg/zs0302.jpg,./goodsImg/ZSimg/zs0303.jpg,./goodsImg/ZSimg/zs0304.jpg,./goodsImg/ZSimg/zs0305.jpg', '0', '2017-03-01 10:45:55', '1');
INSERT INTO tb_goods VALUES ('110004', '1', '敬酒服04', '2017新款新娘结婚嫁衣礼服,古装中式婚纱秀敬酒服', '458.00', '/goodsImg/ZSimg/zs0405.jpg,/goodsImg/ZSimg/zs0401.jpg,/goodsImg/ZSimg/zs0402.jpg,/goodsImg/ZSimg/zs0403.jpg,/goodsImg/ZSimg/zs0404.jpg', '1', '2017-03-01 11:01:43', '1');
INSERT INTO tb_goods VALUES ('110005', '1', '敬酒服05', '2017新款新娘结婚嫁衣礼服,古装中式婚纱秀敬酒服', '569.00', '/goodsImg/ZSimg/zs0505.jpg,/goodsImg/ZSimg/zs0501.jpg,/goodsImg/ZSimg/zs0502.jpg,/goodsImg/ZSimg/zs0503.jpg,/goodsImg/ZSimg/zs0504.jpg', '1', '2017-04-13 11:05:28', '1');
INSERT INTO tb_goods VALUES ('110006', '2', '欧式长裙01', '欧式2017一字肩新娘结婚婚纱深V蕾丝复古大牌礼服', '669.00', '/goodsImg/OSimg/os0105.jpg,/goodsImg/OSimg/os0101.jpg,/goodsImg/OSimg/os0102.jpg,/goodsImg/OSimg/os0103.jpg,/goodsImg/OSimg/os0104.jpg', '1', '2017-04-13 11:10:55', '1');
INSERT INTO tb_goods VALUES ('110007', '2', '欧式长裙02', '欧式2017一字肩新娘结婚婚纱深V蕾丝复古大牌礼服', '689.00', '/goodsImg/OSimg/os0205.jpg,/goodsImg/OSimg/os0201.jpg,/goodsImg/OSimg/os0202.jpg,/goodsImg/OSimg/os0203.jpg,/goodsImg/OSimg/os0204.jpg', '0', '2017-04-13 11:11:53', '1');
INSERT INTO tb_goods VALUES ('110008', '2', '欧式长裙03', '欧式2017一字肩新娘结婚婚纱深V蕾丝复古大牌礼服', '669.00', '/goodsImg/OSimg/os0301.jpg,/goodsImg/OSimg/os0302.jpg,/goodsImg/OSimg/os0303.jpg,/goodsImg/OSimg/os0304.jpg,/goodsImg/OSimg/os0305.jpg', '0', '2017-04-26 08:53:55', '1');
INSERT INTO tb_goods VALUES ('110009', '2', '欧式长裙04', '欧式2017一字肩新娘结婚婚纱深V蕾丝复古大牌礼服', '598.00', '/goodsImg/OSimg/os0401.jpg,/goodsImg/OSimg/os0402.jpg,/goodsImg/OSimg/os0403.jpg,/goodsImg/OSimg/os0404.jpg,/goodsImg/OSimg/os0405.jpg', '1', '2017-05-04 21:50:42', '1');
INSERT INTO tb_goods VALUES ('110010', '3', '韩式一字肩01', '2017新娘结婚婚纱韩版新款齐地敬酒服', '454.00', '/goodsImg/HSimg/hs0105.jpg,/goodsImg/HSimg/hs0101.jpg,/goodsImg/HSimg/hs0102.jpg,/goodsImg/HSimg/hs0103.jpg,/goodsImg/HSimg/hs0104.jpg', '1', '2017-05-09 15:44:42', '1');
INSERT INTO tb_goods VALUES ('110011', '3', '韩式一字肩02', '2017新娘结婚婚纱韩版新款齐地敬酒服', '589.00', '/goodsImg/HSimg/hs0205.jpg,/goodsImg/HSimg/hs0201.jpg,/goodsImg/HSimg/hs0202.jpg,/goodsImg/HSimg/hs0203.jpg,/goodsImg/HSimg/hs0204.jpg', '1', '2017-05-12 20:54:45', '1');
INSERT INTO tb_goods VALUES ('110012', '3', '韩式一字肩03', '2017新娘结婚婚纱韩版新款齐地敬酒服', '600.00', '/goodsImg/HSimg/hs0305.jpg,/goodsImg/HSimg/hs0301.jpg,/goodsImg/HSimg/hs0302.jpg,/goodsImg/HSimg/hs0303.jpg,/goodsImg/HSimg/hs0304.jpg', '1', '2017-05-13 11:57:26', '1');

-- ----------------------------
-- Table structure for `tb_goodstype`
-- ----------------------------
DROP TABLE IF EXISTS `tb_goodstype`;
CREATE TABLE `tb_goodstype` (
  `typeId` int(11) NOT NULL AUTO_INCREMENT,
  `typeName` varchar(50) DEFAULT NULL,
  `status` int(2) DEFAULT NULL,
  PRIMARY KEY (`typeId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_goodstype
-- ----------------------------
INSERT INTO tb_goodstype VALUES ('1', '格调中式', '1');
INSERT INTO tb_goodstype VALUES ('2', '奢华欧式', '1');
INSERT INTO tb_goodstype VALUES ('3', '唯美韩式', '1');
INSERT INTO tb_goodstype VALUES ('4', '唯美韩式', '0');
INSERT INTO tb_goodstype VALUES ('5', '测试数据', '0');
INSERT INTO tb_goodstype VALUES ('6', '测试数据类型', '0');
INSERT INTO tb_goodstype VALUES ('7', '测试类型04', '1');

-- ----------------------------
-- Table structure for `tb_orderform`
-- ----------------------------
DROP TABLE IF EXISTS `tb_orderform`;
CREATE TABLE `tb_orderform` (
  `orderId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `goodsId` int(11) DEFAULT NULL,
  `orderTime` varchar(50) NOT NULL,
  `allCount` decimal(10,2) NOT NULL,
  `orderMessage` varchar(255) NOT NULL,
  PRIMARY KEY (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_orderform
-- ----------------------------

-- ----------------------------
-- Table structure for `tb_shopcart`
-- ----------------------------
DROP TABLE IF EXISTS `tb_shopcart`;
CREATE TABLE `tb_shopcart` (
  `shopCartId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `goodsId` int(11) DEFAULT NULL,
  `goodsCount` int(11) NOT NULL,
  PRIMARY KEY (`shopCartId`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_shopcart
-- ----------------------------
INSERT INTO tb_shopcart VALUES ('73', '16001', '110001', '1');
INSERT INTO tb_shopcart VALUES ('74', '16001', '110002', '1');
INSERT INTO tb_shopcart VALUES ('75', '16001', '110015', '1');
INSERT INTO tb_shopcart VALUES ('76', '16001', '110018', '1');
INSERT INTO tb_shopcart VALUES ('77', '16001', '110014', '1');
INSERT INTO tb_shopcart VALUES ('78', '16001', '110006', '1');
INSERT INTO tb_shopcart VALUES ('79', '16001', '110005', '1');
INSERT INTO tb_shopcart VALUES ('80', '16005', '110009', '1');
INSERT INTO tb_shopcart VALUES ('81', '16005', '110005', '1');
INSERT INTO tb_shopcart VALUES ('82', '16003', '110005', '1');
INSERT INTO tb_shopcart VALUES ('83', '16005', '110003', '1');
INSERT INTO tb_shopcart VALUES ('84', '16003', '110008', '1');
INSERT INTO tb_shopcart VALUES ('85', '16005', '110008', '1');
INSERT INTO tb_shopcart VALUES ('86', '16005', '110001', '1');
INSERT INTO tb_shopcart VALUES ('87', '16003', '110001', '1');
INSERT INTO tb_shopcart VALUES ('88', '16003', '110007', '1');
INSERT INTO tb_shopcart VALUES ('89', '16005', '110006', '1');
INSERT INTO tb_shopcart VALUES ('90', '16005', '110007', '1');
INSERT INTO tb_shopcart VALUES ('91', '16005', '110004', '1');
INSERT INTO tb_shopcart VALUES ('92', '16003', '110009', '1');
INSERT INTO tb_shopcart VALUES ('93', '16014', '110009', '1');
INSERT INTO tb_shopcart VALUES ('94', '16014', '110005', '1');
INSERT INTO tb_shopcart VALUES ('95', '16016', '110001', '1');

-- ----------------------------
-- Table structure for `tb_user`
-- ----------------------------
DROP TABLE IF EXISTS `tb_user`;
CREATE TABLE `tb_user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(20) NOT NULL,
  `userPwd` varchar(20) NOT NULL,
  `userTel` int(10) unsigned DEFAULT NULL,
  `userImg` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `userMoney` decimal(10,2) DEFAULT NULL,
  `userBirth` datetime DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userName` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=16017 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_user
-- ----------------------------
INSERT INTO tb_user VALUES ('16001', 'zhy13087344578', 'zhy0319', null, '\"/storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/apps/HBuilder/doc/head.png?version=1493908344447\"', '1.00', null);
INSERT INTO tb_user VALUES ('16003', 'zhy123456', 'zhy123456', null, null, '22.00', null);
INSERT INTO tb_user VALUES ('16005', 'zhy123', 'zhy123456', null, null, '90.00', null);
INSERT INTO tb_user VALUES ('16012', 'zhang01', 'zhy123456', null, null, '1.00', null);
INSERT INTO tb_user VALUES ('16013', 'zhanghy', 'zhy123456', null, null, '1.00', null);
INSERT INTO tb_user VALUES ('16014', 'zhyzhy', 'zhyzhy', null, null, '67.00', null);
INSERT INTO tb_user VALUES ('16015', 'zhyzhy01', 'zhyzhy', null, null, null, null);
INSERT INTO tb_user VALUES ('16016', 'zhyzhy002', 'zhyzhy', null, null, '1000.00', null);

-- ----------------------------
-- Table structure for `tb_wd`
-- ----------------------------
DROP TABLE IF EXISTS `tb_wd`;
CREATE TABLE `tb_wd` (
  `wdId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `wdTime` datetime DEFAULT NULL,
  `wdContent` varchar(1000) DEFAULT NULL,
  `wdImg` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`wdId`)
) ENGINE=InnoDB AUTO_INCREMENT=1008 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tb_wd
-- ----------------------------
INSERT INTO tb_wd VALUES ('1001', '16001', '2016-10-13 19:39:13', '这个是个假的', '/images/1476358753977_icon.png');
INSERT INTO tb_wd VALUES ('1002', '16001', '2016-10-13 19:47:00', '我再来一调', '/images/1476359220752_TB2_006.jpg');
INSERT INTO tb_wd VALUES ('1003', '16001', '2016-10-15 19:40:32', '很好', '/images/1476531632594_yc2.png');
INSERT INTO tb_wd VALUES ('1004', '16001', '2016-10-15 19:45:03', '发开发', '/images/1476531903965_yc2.png');
INSERT INTO tb_wd VALUES ('1005', '16001', '2016-10-15 19:54:01', '很好', '/images/1476532441203_yc2.png');
INSERT INTO tb_wd VALUES ('1006', '16001', '2016-10-15 21:03:15', '很好很漂亮很满意', '/images/1476536595087_5购物车.jpg');
INSERT INTO tb_wd VALUES ('1007', '16001', '2016-12-02 16:29:50', 'ncjsd ', '');
