var running = 0;
var myInterval = 10;
var timeint;
var then,now;
var mindis, secdis, subsec, subsecdis,totalsec,sec,min,nowSeconds;
function stop(evt){
    if(evt.keyCode==32&&running==1){
        clearTimeout(timeint);
    }
}
function begin(evt){
    if(evt.keyCode==32){
        if(running == 0){
            then = new Date();
            running = 1;
            show();
        }else if(running == 1){
            running = 2;
        }else{
            document.getElementById("watch").innerHTML = "00:00.00";
            running = 0;
        }
    }

}
function show(){
    var now = new Date();
    diff = now.getTime()-then.getTime();
    if(diff<1000){
        mindis = "00";
        secdis = "00";
        subsec = Math.floor(diff/10);
        if(subsec < 10){
            subsecdis= "0"+subsec;
        }else{
            subsecdis = subsec;
        }
    }else if(diff<60000){
        mindis = "00";
        sec = Math.floor(diff/1000);
        if(sec<10){
            secdis = "0"+sec;
        }else{
            secdis = sec;
        }
        subsec = Math.floor((diff%1000)/10);
        if(subsec<10){
            subsecdis = "0"+subsec;
        }else{
            subsecdis = subsec;
        }
    }else{
        totalsec = Math.floor(diff/1000);
        sec = totalsec%60;
        if(sec<10){
            secdis = "0"+sec;
        }else{
            secdis = sec;
        }
        min =(totalsec-sec)/60;
        if(min<10){
            mindis = "0"+min;
        }else{
            mindis = min;
        }
        subsec = Math.floor((diff%1000)/10);
        if(subsec<10){
            subsecdis="0"+subsec;
        }else{
            subsecdis = subsec;
        }
    }
    nowSeconds = mindis+":"+secdis+"."+subsecdis;
    document.getElementById("watch").innerHTML = nowSeconds;
    timeint = setTimeout("show()",myInterval);
}