function clearForm(){
    document.getElementById("userName").value="";
    document.getElementById("password").value="";
    document.getElementById("passwordCheck").value="";
    document.getElementById("email").value="";
}


function check(){
    var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var name = document.getElementById("userName").value;
    var pwd = document.getElementById("password").value;
    var pwdcheck = document.getElementById("passwordCheck").value;
    var email = document.getElementById("email").value;
    if(pwd.length<6&&pwd!=""){
        alert("密码过短请重新输入!");
        document.getElementById("password").value="";
        document.getElementById("passwordCheck").value="";
        return;
    }
    if(pwd!=pwdcheck){
        alert("俩次输入的密码不相同!");
        document.getElementById("password").value="";
        document.getElementById("passwordCheck").value="";
        return;
    }
    if(!pattern.test(email)){
        alert("邮箱地址输入有误！");
        document.getElementById("email").value="";
        return;
    }
    if(email!=""&&pwd!=""&&pwdcheck!=""){
        alert("注册成功！");
    }
}