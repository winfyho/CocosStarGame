// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        starPrefab: {
            default: null,
            type: cc.Prefab,
        },

        maxStarDuration: 0,
        minStarDuration: 0,

        //地面节点，用于确定星星的生成高度
        ground: {
            default: null,
            type: cc.Node,
        },

        player: {
            default: null,
            displayName: "player",
            tooltip: "player",
            type: cc.Node,
        },

        ScoreText: {
            default: null,
            type: cc.Label
        },

        GainAudio: {
            default: null,
            type: cc.AudioClip
        },

        GameOverText: {
            default: null,
            type: cc.Label
        },


        startButton: {
            default: null,
            type: cc.Button,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //初始化计时器
        this.timer = 0;
        this.starDuration = 0;

        //获取地平面的y轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;


        //展现菜单还是运行游戏,enable确立是否调用update
        this.enabled = false;
    },


    //开始游戏
    startGame() {
        //初始化计分
        this.resetScore();

        this.enabled = true;

        this.GameOverText.node.active = false;

        this.startButton.node.active = false;

        this.player.getComponent('Player').StartmoveAt(cc.v2(0, this.groundY));

        this.spawnNewStar();
    },

    spawnNewStar() {
        var newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.getComponent('Star').game = this;
        newStar.setPosition(this.getNewStarPosition());

        //生成Duration
        this.starDuration = this.minStarDuration + Math.random(this.maxStarDuration - this.minStarDuration);
        //重置计时器
        this.timer = 0;
    },


    getNewStarPosition() {
        var randX = 0;
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;

        //根据屏幕宽度，随机得到一个x坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        return cc.v2(randX, randY);
    },


    gainScore() {
        this.score += 1;
        this.ScoreText.string = 'Score:' + this.score;

        cc.audioEngine.playEffect(this.GainAudio, false);
    },

    resetScore() {
        this.score = 0;
        this.ScoreText.string = 'Score:' + this.score;
    },


    update(dt) {
        //console.log(this.starDuration);
        if (this.timer > this.starDuration) {
            this.gameOver();
            this.enabled = false;
            return;
        }
        this.timer += dt;
    },


    gameOver() {
        //展示gameOverText
        this.GameOverText.node.active = true;

        this.startButton.node.active = true;

        this.player.getComponent('Player').stopMove();
    }

});