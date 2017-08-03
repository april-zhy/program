/**
 * Created by 张红玉 on 2016/10/8.
 */
function YMD(obj){
        id=$(obj).attr("id");
        var i=2015;
        var date=new Date();
        var year=date.getFullYear();//获取当前年份
        var dropList;
        for(var i;i<2019;i++){
            if(i==year){
                dropList=dropList+"<option value='"+i+"'  selected='selected'>"+i+"</option>";
            }else {
                dropList=dropList+"<option value='"+i+"'>"+i+"</option>";
            }
        }
        $('#'+id+' select[name=year]').html(dropList);//生成年份下拉列表
        $('#'+id+' select[name=year]').html(dropList);//生成年份下拉列表
        var monthly;
        var month=date.getMonth()+1;
        for(var j=1;j<13;j++){
            if(j==month){
                monthly=monthly+'<option value="'+j+'" selected="selected">'+j+'</option>'
            }else {
                monthly=monthly+'<option value="'+j+'">'+j+'</option>'
            }
        }
        $('#'+id+' select[name=month]').html(monthly);//生成月份下拉列表
        var daily;
        var today=date.getDay()+9;
        for(var day=1;day<=31;day++){
            if(day==today){
                daily=daily+'<option value="'+day+'" selected="selected">'+day+'</option>';
            }else {
                daily=daily+'<option value="'+day+'">'+day+'</option>';
            }
        }
        $('#'+id+' select[name=day]').html(daily);
        $('#'+id+' select[name=month]').change(function(){
            var currentDay;
            var total;
            var flag=$('#dateForm select[name=year]:selected').val();
            var currentMonth=$('#dateForm select[name=month]').val();
            switch (currentMonth){
                case "1":
                case "3":
                case "5":
                case "7":
                case "8":
                case "10":
                case "12":total=31;break;
                case "4":
                case "6":
                case "9":
                case "11":total=30;break;
                case "2":
                    if( (flag%4==0 && flag%100!=0 ) || flag%400){//闰年  整除4但是不整除100  或者整除400
                        total=29;
                    }else {
                        total=28;
                    }
                default :break
            }
            for(day=1;day<=total;day++){
                currentDay=currentDay+'<option value="'+day+'">'+day+'</option>'
            }
            $('#'+id+' select[name=day]').html(currentDay);//生成日期下拉列表
        });
    }
