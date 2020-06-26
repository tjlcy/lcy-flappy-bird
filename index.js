// 对象收编变量，减少全局变量，代码冲突风险降低
// var obj = {
//     a: 
//     b:
//     test:function(){}
// }
// 单一执行原则，一个函数只管一个
// 动画 animate 管理所有动画
var bird = {
    // 初始化背景图片位置
    skyPosition: 0,
    skyStep: 2,
    birdTop: 220,
    birdStepY: 0,
    startColor: "blue",
    startFlag: false,
    minTop: 0,
    maxTop: 570,
    // 初始化函数
    init: function() {
        this.initData();
        this.animate();
        this.handle();
    },
    initData: function() {
        this.el = document.getElementById("game");
        this.oBird = this.el.querySelector(".bird");
        this.oStart = this.el.querySelector(".start");
        this.oScore = this.el.querySelector(".score");
        this.oMask = this.el.querySelector(".mask");
        this.oEnd = this.el.querySelector(".end");

    },
    animate: function() {
        var self = this;
        var count = 0;
        // 初始化计数器
        this.timer = setInterval(function() {
            self.skyMove();
            if (self.startFlag) {
                self.birdDrop();
            }
            // 执行10次之后再执行 birdJump
            if (++count % 10 === 0) {
                // 先+ 然后利用+之后的数进行运算
                if (!self.startFlag) {
                    self.birdJump();
                    self.startBound();
                }
                self.birdFly(count);
            }
        }, 30)

    },
    // 天空动
    skyMove: function() {
        var self = this;
        // 每隔30毫秒背景图片移动一定位置
        // setInterval(function() {
        this.skyPosition -= this.skyStep;
        this.el.style.backgroundPositionX = this.skyPosition + "px";
        // }, 30)
    },
    // 小鸟蹦
    birdJump: function() {
        // 每隔300毫秒运动一次
        // setInterval(function() {
        // 当top为220时变到260，否则变为220
        this.birdTop = this.birdTop === 220 ? 260 : 220;
        this.oBird.style.top = this.birdTop + "px";
        // }, 300)
    },
    // 小鸟落
    birdDrop: function() {
        this.birdTop += ++this.birdStepY;
        this.oBird.style.top = this.birdTop + "px";
        this.judgeKnock();
    },
    // 小鸟飞
    birdFly: function(count) {
        this.oBird.style.backgroundPositionX = count % 3 * 30 + "px";
    },
    // 切换文字
    startBound: function() {
        var prevColor = this.startColor;
        this.startColor = prevColor === "blue" ? "white" : "blue";
        this.oStart.classList.remove("start-" + prevColor);
        this.oStart.classList.add("start-" + this.startColor);
        // var color;
        // if (this.startColor === "blue") {
        //     color = "white";
        // } else {
        //     color = "blue";
        // }
        // classList.remove("start-" + this.startColor);
        // classList.add("start-" + color);
        // this.startColor = color;
    },
    //碰撞检测
    judgeKnock: function() {
        this.judgeBoundary();
        this.judgePipe();
    },
    // 边界碰撞检测
    judgeBoundary: function() {
        if (this.birdTop < this.minTop || this.birdTop > this.maxTop) {
            this.failGame();
        }
    },
    // 柱子碰撞检测
    judgePipe: function() {},
    handle: function() {
        this.handleStart();
    },
    handleStart: function() {
        var self = this;
        this.oStart.onclick = function() {
            self.oStart.style.display = "none";
            self.oScore.style.display = "block";
            self.oBird.style.left = "80px";
            self.skyStep = 5;
            self.startFlag = true;
        }
    },
    failGame: function() {
        // 清除定时器
        clearInterval(this.timer);
        this.oMask.style.display = "block";
        this.oEnd.style.display = "block";
        this.oBird.style.display = "none";
        this.oScore.style.display = "none";
    }
};