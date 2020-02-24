
var str = new Array;
var des = new Array;
str[0] = "../images/background1.png";
str[1] = "../images/background2.png";
str[2] = "../images/background3.png";
    
        
function left(){
    var temp = " ";
    temp = str[1];
    str[1] = str[0];
    str[0] = temp;
    temp = str[2];
    str[2] = str[0];
    str[0]  = temp;
    document.getElementById("m").src=str[1];
}

function right(){
    var temp = " ";
    temp = str[0];
    str[0] = str[2];
    str[2] = temp;
    temp = str[1];
    str[1] = str[0];
    str[0] = temp;
    document.getElementById("m").src=str[1];            
}
