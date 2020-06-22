/**
 * 创建DOM元素对象
 * @param {指定的DOM元素名} name 
 * @param {指定的DOM元素的className} className 
 */
function elt(name, className) {
    var elt = document.createElement(name);
    if (className) elt.className = className;
    return elt;
}
/**
 * 构造监视器对象
 * @param {指定父类对象的监视器} parent 
 * @param {传入指定的地图} level 
 */
function DOMDisplay(parent, level) {
    this.wrap = parent.appendChild(elt("div", "game"));//游戏的包装器
    this.level = level;
    this.wrap.appendChild(this.drawBackground());
    this.actorLayer = null;//保存活动元素的动作
    this.drawFrame();//绘制活动元素
}

var scale = 20;//实际方格的高

/**
 * 绘制关卡背景
 */
DOMDisplay.prototype.drawBackground = function () {
    var table = elt("table", "background");
    table.style.width = this.level.width * scale + "px";
    this.level.grid.forEach(function (row) {
        var rowElt = table.appendChild(elt("tr"));
        rowElt.style.height = scale + "px";
        row.forEach(function (type) {
            rowElt.appendChild(elt("td", type));
        });
    });
    return table;
};

/**
 * 绘制活动元素
 * 
 * 
 * 注意这里的top
 */
DOMDisplay.prototype.drawActors = function () {
    var wrap = elt("div");//用于包装活动元素的包装器
    this.level.actors.forEach(function (actor) {//设置每一个活动元素的长高以及位置
        var rect = wrap.appendChild(elt("div", "actor " + actor.type));
        rect.style.width = actor.size.x * scale + "px";
        rect.style.height = actor.size.y * scale + "px";
        rect.style.left = actor.pos.x * scale + "px";
        rect.style.top = actor.pos.y * scale + 2 + "px";
    });
    return wrap;
};

DOMDisplay.prototype.drawFrame = function () {//需要被实时的调用，更新地图的显示
    if (this.actorLayer) this.wrap.removeChild(this.actorLayer);//删除所有的旧活动元素
    this.actorLayer = this.wrap.appendChild(this.drawActors());
    this.wrap.className = "game " + (this.level.status || (this.level.unmatched ? "unmatched" : ""));
    this.scrollPlayerIntoView();
};

/**
 * 调整窗口的视图
 */


DOMDisplay.prototype.scrollPlayerIntoView = function () {
    var width = this.wrap.clientWidth;//获取wrap的可视宽度
    var height = this.wrap.clientHeight;//获取wrap的可视高度
    var margin = width / 3;

    // The viewport
    var left = this.wrap.scrollLeft,//设置或获取位于wrap左边界和窗口中目前可见内容的最左端之间的距离
        right = left + width;
    var top = this.wrap.scrollTop,//获取wrap对象的滚动高度
        bottom = top + height;

    var player = this.level.player;
    var center = player.pos.plus(player.size.times(0.5)).times(scale);//获取人物的中心坐标

    if (center.x < left + margin) this.wrap.scrollLeft = center.x - margin;//视图左移
    else if (center.x > right - margin)
        this.wrap.scrollLeft = center.x + margin - width;                   //视图右移
    if (center.y < top + margin) this.wrap.scrollTop = center.y - margin; //视图上移
    else if (center.y > bottom - margin)
        this.wrap.scrollTop = center.y + margin - height;                   //视图下移
};

/**
 * 清除关卡中所有的元素，在重新关卡或进入下一个关卡时调用此方法
 * 并更新状态栏
 */
DOMDisplay.prototype.clear = function () {
    this.wrap.parentNode.removeChild(this.wrap);
};
