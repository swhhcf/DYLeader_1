function pwdStrength(pwd) {
    var O_color = "#dfffff";
    var L_color = "#FF0000";
    var M_color = "#FF9900";
    var H_color = "#33CC00";
    var Lcolor,
        Mcolor,
        Hcolor;
    var level = 0, strength = "O";
    if (pwd == null || pwd == '') {
        strength = "O";
        Lcolor = Mcolor = Hcolor = O_color;
    }
    else {
        var mode = 0;
        if (pwd.length <= 4)
            mode = 0;
        else {
            for (i = 0; i < pwd.length; i++) {
                var charMode, charCode;
                charCode = pwd.charCodeAt(i);
                // 判断输入密码的类型
                if (charCode >= 48 && charCode <= 57) //数字
                    charMode = 1;
                else if (charCode >= 65 && charCode <= 90) //大写
                    charMode = 2;
                else if (charCode >= 97 && charCode <= 122) //小写
                    charMode = 4;
                else
                    charMode = 8;
                mode |= charMode;
            }
            // 计算密码模式
            level = 0;
            for (i = 0; i < 4; i++) {
                if (mode & 1)
                    level++;
                mode >>>= 1;
            }
        }
        switch (level) {
            case 0:
                strength = "O";
                Lcolor = Mcolor = Hcolor = O_color;
                break;
            case 1:
                strength = "L";
                Lcolor = L_color;
                Mcolor = Hcolor = O_color;
                break;
            case 2:
                strength = "M";
                Lcolor = Mcolor = M_color;
                Hcolor = O_color;
                break;
            default:
                strength = "H";
                Lcolor = Mcolor = Hcolor = H_color;
                break;
        }
    }
    document.getElementById("strength_L").style.background = Lcolor;
    document.getElementById("strength_M").style.background = Mcolor;
    document.getElementById("strength_H").style.background = Hcolor;
    return strength;
}