

function StatusBar(parent, level, passID) {
    this.parent = parent;
    this.level = level;
    this.passID = passID;
    this.wrap = parent.appendChild(elt("div", "statusBar"));
    this.wrap.style.height = ((level.height * scale > 450) ? 450 : level.height * scale) + "px";
    this.infoWrap;
    // this.isStop = false;
}

StatusBar.prototype.clear = function () {
    this.wrap.innerHTML = "";
}
StatusBar.prototype.run = function () {
    if (this.passID != 0) {
        this.showStatus(this.passID);
    } else {
        this.drawDesc();
    }
    this.drawInfo(this.passID);
}
StatusBar.prototype.drawDesc = function () {
    this.clear();
    var descDiv = this.wrap.appendChild(elt("div", "descDiv"));
    descDiv.innerText = "游戏说明";

    var tableDiv = this.wrap.appendChild(elt("div", "tableDiv"));
    var table = elt("table", "descTable");
    //操作说明：
    var trAltDesc = table.appendChild(elt("tr"));
    var tdAltDescLabel = trAltDesc.appendChild(elt("td", "label"));
    var tdAltDesc = trAltDesc.appendChild(elt("td", "content"));
    tdAltDescLabel.innerText = "操作说明:";
    tdAltDesc.innerHTML = "↑或k：跳跃<br>←或a：人物左移<br>→或d：人物右移<br>空格或j：射击子弹<br>";
    //游戏目标：
    var trGameDesc = table.appendChild(elt("tr"));
    var tdGameDescLabel = trGameDesc.appendChild(elt("td", "label"));
    var tdGameDesc = trGameDesc.appendChild(elt("td", "content"));
    tdGameDescLabel.innerText = "游戏目标:";
    tdGameDesc.innerHTML = "合理操作，得到披风，顺利闯关";
    //其他说明:
    var trOtherDesc = table.appendChild(elt("tr"));
    var tdOtherDescLabel = trOtherDesc.appendChild(elt("td", "label"));
    var tdOtherDesc = trOtherDesc.appendChild(elt("td", "content"));
    tdOtherDescLabel.innerText = "其他说明:";
    tdOtherDesc.innerHTML = "1.玩家一开始有三格血量，能量若为0则游戏结束<br><br>2.若玩家触碰到了熔岩则减少一点血量<br><br>3.若玩家掉到水下或掉出地图则血量减少至0<br><br>";
    tableDiv.appendChild(table);
}


/**
 * 展示当前的状态(当前剩余血量，总金币数，总耗时，当前状态)
 */
StatusBar.prototype.showStatus = function (passID) {
    this.clear();
    var passInfoDiv = this.wrap.appendChild(elt("div", "passInfoDiv"));
    passInfoDiv.innerText = "第" + passID + "关";
    var tableDiv = this.wrap.appendChild(elt("div", "tableDIV"));
    var statusTable = tableDiv.appendChild(elt("table", "statusTabel"));

    /**
     * 获取剩余血量
     */
    var trHP = statusTable.appendChild(elt("tr"));
    var tdHPLabel = trHP.appendChild(elt("td", "statusLabel"));
    tdHPLabel.innerText = "血量：";
    var tdHPContent = trHP.appendChild(elt("td"));
    for (var i = 0; i < this.level.hp; i++) {
        tdHPContent.innerText += "❤";
    }

    /**
     * 获取当前击败的怪物数量
     */
    var trBeatEnemyCount = statusTable.appendChild(elt("tr"));
    var tdBeatEnemyCountLabel = trBeatEnemyCount.appendChild(elt("td", "statusLabel"));
    tdBeatEnemyCountLabel.innerText = "当前击败的怪物数为：";
    var tdBeatEnemyCountContent = trBeatEnemyCount.appendChild(elt("td"));
    tdBeatEnemyCountContent.innerText = this.level.beatEnemyCount + "/" + gameData.cur_allEnemyNums;
    /**
     * 获取当前总金币数
     */
    var trCoinCount = statusTable.appendChild(elt("tr"));
    var tdCoinCountLable = trCoinCount.appendChild(elt("td", "statusLable"));
    tdCoinCountLable.innerText = "总金币数："
    var tdCoinContent = trCoinCount.appendChild(elt("td"));
    tdCoinContent.innerText = this.level.coinCount + "/" + gameData.cur_allCoinNums;

    /**
     * 获取当前状态以及无敌状态可持续的剩余时间
     */
    var trUnmatched = statusTable.appendChild(elt("tr"));
    var tdUnmatchedLabel = trUnmatched.appendChild(elt("td", "statusLable"));
    tdUnmatchedLabel.innerText = "当前状态："
    var tdUnmatchedContent = trUnmatched.appendChild(elt("td"));
    tdUnmatchedContent.innerHTML = (this.level.unmatched == true ? "无敌模式<br>(剩余" + (this.level.getUnmatchedTime() < 3 ? this.level.getUnmatchedTime() + "s" : "inf") + ")" : "普通模式");

    /**
     * 获取当前耗时
     */
    var trGetTime = statusTable.appendChild(elt("tr"));
    var tdGetTimeLabel = trGetTime.appendChild(elt("td", "statusLabel"));
    tdGetTimeLabel.innerHTML = "当前耗时：";
    var tdGetTime = trGetTime.appendChild(elt("td"));
    tdGetTime.innerText = this.level.getGameTime();
}


StatusBar.prototype.newInfoWrap = function () {
    this.infoWrap = this.parent.appendChild(elt("div", "infoWrap"));
    this.infoWrap.style.height = ((this.level.height * scale > 450) ? 450 : this.level.height * scale) + "px";
    this.infoWrap.style.width = ((this.level.width * scale > 600) ? 650 : this.level.width * scale) + "px";
}
/**
 * 游戏结束时显示游戏信息
 */

StatusBar.prototype.drawInfo = function (passID) {
    this.removeInfo();
    if (this.level.status) {
        this.newInfoWrap();
        this.drawInfoTable(passID);
    }
    if (this.level.isFinished()) {
        this.removeInfo();
    }
    if (this.level.isFinished() && passID == 4 && this.level.status == "won") {
        this.newInfoWrap();
        this.drawInfoTable(passID);
        this.drawFinallyResult();
    }
}
//游戏暂停时显示的数据
//Deprecated
// StatusBar.prototype.drawStopInfo = function () {
//     this.removeInfo();
//     this.newInfoWrap();
//     var stopInfoTable = this.infoWrap.appendChild(elt("table", "stopInfoTable"));
//     //显示关卡
//     var tipTr = stopInfoTable.appendChild(elt("tr"));
//     var tipTd = tipTr.appendChild(elt("td", "tipTd"));
//     tipTd.innerHTML = "游戏暂停中！<br>按ESC键继续游戏";

// }
StatusBar.prototype.removeInfo = function () {
    if (this.infoWrap) {
        this.parent.removeChild(this.infoWrap);
        this.infoWrap = null;
    }
}
//关卡结束后显示数据
StatusBar.prototype.drawInfoTable = function (passID) {
    this.infoWrap.innerHTML = ""
    var resultTable = this.infoWrap.appendChild(elt("table", "resultTable"));
    //显示关卡
    var tipTr = resultTable.appendChild(elt("tr"));
    var tipTd = tipTr.appendChild(elt("td", "tipTd"));
    tipTd.collspan = 2;
    if (passID == 0) {
        tipTd.innerHTML = "恭喜通过游戏引导！即将开始游戏";
        return;
    } else if (this.level.status == "lost") {
        tipTd.innerHTML = "不要气馁，可以重新来过！请等待...";
        return;
    } else if (this.level.status == "won") {
        tipTd.innerHTML = "恭喜通过第" + passID + "关";
        //显示玩家消耗的时间
        var timeTr = resultTable.appendChild(elt("tr"));
        var timeLabelTd = timeTr.appendChild(elt("td", "timeLabelTd"));
        var timeTd = timeTr.appendChild(elt("td", "timeTd"));
        timeLabelTd.innerHTML = "本关卡所耗费的时间为：";
        timeTd.innerHTML = gameData.getTime(gameData.cur_time);
        //显示玩家吃到的硬币
        var coinTr = resultTable.appendChild(elt("tr"));
        var coinLabelTd = coinTr.appendChild(elt("td", "coinLabelTd"));
        var coinTd = coinTr.appendChild(elt("td", "timeTd"));
        coinLabelTd.innerHTML = "本关卡获得的硬币数为：";
        coinTd.innerHTML = gameData.cur_countCoin + "/" + gameData.cur_allCoinNums;;
        //显示玩家击败的怪物数
        var enemyTr = resultTable.appendChild(elt("tr"));
        var enemyLabelTd = enemyTr.appendChild(elt("td", "enemyLabelTd"));
        var enemyTd = enemyTr.appendChild(elt("td", "timeTd"));
        enemyLabelTd.innerHTML = "本关卡击败的怪物数为：";
        enemyTd.innerHTML = gameData.cur_countBeatEnemy + "/" + gameData.cur_allEnemyNums;
        //显示玩家消耗的血量
        var hpTr = resultTable.appendChild(elt("tr"));
        var hpLabelTd = hpTr.appendChild(elt("td", "hpLabelTd"));
        var hpTd = hpTr.appendChild(elt("td", "timeTd"));
        hpLabelTd.innerHTML = "本关卡消耗的血量为：";
        hpTd.innerHTML = gameData.cur_hp;
    }
}
//通过所有关卡后显示的数据
StatusBar.prototype.drawFinallyResult = function () {
    this.infoWrap.innerHTML = ""
    var resultTable = this.infoWrap.appendChild(elt("table", "resultTable"));
    //显示关卡
    var tipTr = resultTable.appendChild(elt("tr"));
    var tipTd = tipTr.appendChild(elt("td", "tipTd"));
    tipTd.collspan = 2;
    tipTd.innerHTML = "恭喜通过所有关卡！(刷新重新开始游戏)";
    //显示玩家消耗的时间
    var timeTr = resultTable.appendChild(elt("tr"));
    var timeLabelTd = timeTr.appendChild(elt("td", "timeLabelTd"));
    var timeTd = timeTr.appendChild(elt("td", "timeTd"));
    timeLabelTd.innerHTML = "通过所有关卡耗费的时间为：";
    timeTd.innerHTML = gameData.getTime(gameData.tot_time);
    //显示玩家吃到的硬币
    var coinTr = resultTable.appendChild(elt("tr"));
    var coinLabelTd = coinTr.appendChild(elt("td", "coinLabelTd"));
    var coinTd = coinTr.appendChild(elt("td", "timeTd"));
    coinLabelTd.innerHTML = "所有关卡获得的硬币数为：";
    coinTd.innerHTML = gameData.tot_countCoin + "/" + gameData.tot_allCoinNums;
    //显示玩家击败的怪物数
    var enemyTr = resultTable.appendChild(elt("tr"));
    var enemyLabelTd = enemyTr.appendChild(elt("td", "enemyLabelTd"));
    var enemyTd = enemyTr.appendChild(elt("td", "timeTd"));
    enemyLabelTd.innerHTML = "所有关卡击败的怪物数为：";
    enemyTd.innerHTML = gameData.tot_countBeatEnemy + "/" + gameData.tot_allEnemyNums;
    //显示玩家消耗的血量
    var hpTr = resultTable.appendChild(elt("tr"));
    var hpLabelTd = hpTr.appendChild(elt("td", "hpLabelTd"));
    var hpTd = hpTr.appendChild(elt("td", "timeTd"));
    hpLabelTd.innerHTML = "所有关卡消耗的血量为：";
    hpTd.innerHTML = gameData.tot_hp;

}