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
        //跳跃高度
        jumpHeight: 0,
        //跳跃持续事件
        jumpDuration: 0,
        //最大速度
        maxSpeed: 0,
        //加速度
        accel: 0,

        IntialPos: 0,

        JumpAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    runJumpAction() {
        var jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: "sineOut" });
        var jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: "sineIn" });


        //创建一个缓动 按jumpUp，jumpDown的顺序执行动作
        var tween = cc.tween().sequence(jumpUp, jumpDown).call(this.playJumpAudio, this);
        //添加回调函数call在前面动作执行结束后播放音效
        //this.playJumpAudio();
        //重复执行动作
        return cc.tween().repeatForever(tween);
    },


    onKeydown(event) {
        console.log(event.keyCode);
        switch (event.keyCode) {
            case 37:
                this.accLeft = true;
                break;
            case 39:
                this.accRight = true;
                break;
        }
    },

    onKeyup(event) {
        switch (event.keyCode) {
            case 37:
                this.accLeft = false;
                break;
            case 39:
                this.accRight = false;
                break;
        }
    },

    playJumpAudio() {
        cc.audioEngine.playEffect(this.JumpAudio, false);
    },

    onLoad() {
        this.accLeft = false;
        this.accRight = false;

        this.xSpeed = 0;
        //键盘的监听事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeydown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyup, this);
    },

    onDestroy() {

        //关闭键盘的监听事件
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeydown, this.node);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyup, this.node);
    },


    StartmoveAt: function(pos) {
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);

        var jumpAction = this.runJumpAction();
        cc.tween(this.node).then(jumpAction).start();
    },


    stopMove() {
        this.node.stopAllActions();
        this.enabled = false;
    },

    update(dt) {

        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        if (Math.abs(this.xSpeed) > this.maxSpeed) {
            this.xSpeed = this.maxSpeed * this.xSpeed / Math.abs(this.maxSpeed);
        }

        //根据速度更新主角位置
        this.node.x += this.xSpeed * dt;

        // console.log(this.node.parent.width);
        // console.log(this.node.x);

        //限制在屏幕内
        if (this.node.x > this.node.parent.width / 2) {
            this.node.x = this.node.parent.width / 2
            this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width / 2) {
            this.node.x = -this.node.parent.width / 2
            this.xSpeed = 0;
        }
    },
});