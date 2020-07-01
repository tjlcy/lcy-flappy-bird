// 对象收编变量，减少全局变量，代码冲突风险降低
// var obj = {
//     a: 
//     b:
//     test:function(){}
// }
var bird = {
    // 初始化背景图片位置
    skyPosition: 0,
    skyStep: 2,
    // 初始化小鸟的位置
    birdTop: 220,
    birdStepY: 0,
    // 文字颜色初始化
    startColor: "blue",
    startFlag: false,
    // 初始化上下边缘值
    minTop: 0,
    maxTop: 570,
    pipeLength: 7,
    pipeArr: [],
    pipeLastIndex: 6,
    score: 0,
    // 初始化函数
    init: function() {
        this.initData();
        this.animate();
        this.handle();
        if (sessionStorage.getItem('play')) {
            this.start();
        }
    },
    // 绑定事件，初始化数据
    initData: function() {
        this.el = document.getElementById("game");
        this.oBird = this.el.querySelector(".bird");
        this.oStart = this.el.querySelector(".start");
        this.oScore = this.el.querySelector(".score");
        this.oMask = this.el.querySelector(".mask");
        this.oEnd = this.el.querySelector(".end");
        this.oFinalScore = this.el.querySelector(".final-result");
        this.oRankList = this.oEnd.getElementsByClassName('rank-list')[0];
        this.oRestart = this.oEnd.getElementsByClassName('restart')[0];
        this.scoreArr = this.getScore();
    },
    getScore: function() {
        var scoreArr = getLocal("score"); //键值不存在为defined
        return scoreArr ? scoreArr : [];
    },
    // 动画 管理所有动画
    animate: function() {
        var self = this;
        var count = 0;
        // 初始化计数器
        this.timer = setInterval(function() {

            self.skyMove();
            if (self.startFlag) {
                self.birdDrop();
                self.pipeMove();
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
    // 单一执行原则，一个函数只管一个事
    // 天空动
    skyMove: function() {
        // var self = this;
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
        this.addScore();
    },
    // 小鸟飞
    birdFly: function(count) {
        this.oBird.style.backgroundPositionX = count % 3 * 30 + "px";
    },
    // 管子移动
    pipeMove: function() {
        for (var i = 0; i < this.pipeLength; i++) {
            var oUpPipe = this.pipeArr[i].up;
            var oDownPipe = this.pipeArr[i].down;
            var x = oUpPipe.offsetLeft - this.skyStep;
            oUpPipe.style.left = x + 'px';
            oDownPipe.style.left = x + 'px';
            if (x < -52) {
                var pipeLastIndex = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
                oUpPipe.style.left = pipeLastIndex + 300 + "px";
                oDownPipe.style.left = pipeLastIndex + 300 + "px";
                this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;
                this.getPipeHeight();
                continue;
            }
        }
    },
    getPipeHeight: function() {
        var upHeight = 50 + Math.floor(Math.random() * 175);
        var downHeight = 600 - 150 - upHeight;
        return {
            up: upHeight,
            down: downHeight
        }
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
    judgePipe: function() {
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y;
        var birdY = this.birdTop;
        if ((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
            this.failGame();
        }
    },
    // 分数显示
    addScore: function() {
        var index = this.score % this.pipeLength;;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        if (pipeX < 13) {
            this.oScore.innerText = ++this.score;
        }
    },
    setScore: function() {
        this.scoreArr.push({
                score: this.score,
                time: this.getDate(),
            })
            // this.scoreArr.sort(function(a, b) {
            //     return b.score - a.score;
            // })
        this.scoreArr.sort((a, b) => b.score - a.score);
        setLocal("score", this.scoreArr);
    },
    getDate: function() {
        var d = new Date();
        var year = d.getFullYear();
        var month = formatNum(d.getMonth() + 1);
        var day = formatNum(d.getDate());
        var hour = formatNum(d.getHours());
        var minute = formatNum(d.getMinutes());
        var second = formatNum(d.getSeconds());
        return `${year}.${month}.${day}${hour}:${minute}:${second}`
    },
    // 事件处理
    handle: function() {
        this.handleStart();
        this.handleClick();
        this.handleRestart();
    },
    // 点击开始
    handleStart: function() {
        var self = this;
        this.oStart.onclick = this.start.bind(this);
    },
    start: function() {
        var self = this;
        self.startFlag = true;
        self.oBird.style.left = '80px';
        self.oBird.style.transition = 'none';
        self.oStart.style.display = 'none';
        self.oScore.style.display = 'block';
        self.skyStep = 5;

        for (var i = 0; i < self.pipeLength; i++) {
            self.createPipe(300 * (i + 1));
        }
    },
    handleClick: function() {
        var self = this;
        this.el.onclick = function(e) {
            if (!e.target.classList.contains("start")) {
                self.birdStepY = -10;
            }

        };
    },
    handleRestart: function() {
        this.oRestart.onclick = function() {
            sessionStorage.setItem('play', true);
            window.location.reload();
        };
    },
    // 创建柱子
    createPipe: function(x) {

        // pipeHeight 0-1 600-150 = 450 / 2 =225
        // 0-225小数需要取整但是仍会小于50 所以需要加上50并且乘225改为乘175

        var upHeight = 50 + Math.floor(Math.random() * 175);
        var downHeight = 600 - 150 - upHeight;

        var oUpPipe = createEle('div', ['pipe', 'pipe-up'], {
            height: upHeight + 'px',
            left: x + 'px',
        })

        var oDownPipe = createEle('div', ['pipe', 'pipe-bottom'], {
                height: downHeight + 'px',
                left: x + 'px',
            })
            // var oDiv = document.createElement("div");
            // oDiv.classList.add("pipe");
            // oDiv.classList.add("pipe-up");
            // oDiv.style.height = upHeight + "px";
        this.el.appendChild(oUpPipe);
        this.el.appendChild(oDownPipe);
        this.pipeArr.push({
            up: oUpPipe,
            down: oDownPipe,
            y: [upHeight, upHeight + 150]
        })

    },
    // 游戏结束
    failGame: function() {
        // 清除定时器
        clearInterval(this.timer);
        this.oMask.style.display = "block";
        this.oEnd.style.display = "block";
        this.oBird.style.display = "none";
        this.oScore.style.display = "none";
        this.oFinalScore.innerText = this.score;
        this.setScore();
        this.renderRankList();
    },
    renderRankList: function() {
        var template = '';
        for (var i = 0; i < 8; i++) {
            var degreeClass = '';
            switch (i) {
                case 0:
                    degreeClass = 'first';
                    break;
                case 1:
                    degreeClass = 'second';
                    break;
                case 2:
                    degreeClass = 'third';
                    break;
            }

            template += `
        <li class="rank-item">
          <span class="rank-degree ${degreeClass}">${i + 1}</span>
          <span class="rank-score">${this.scoreArr[i].score}</span>
          <span class="rank-time">${this.scoreArr[i].time}</span>
        </li>
      `;
        }

        this.oRankList.innerHTML = template;
    },
};