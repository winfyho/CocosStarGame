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

        JumpAudio: {
            default: null,
            type: cc.AudioClip
        },

        squashDuration: 0
    },

    runJumpAction() {
        var jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: "sineOut" });
        var jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: "sineIn" });



        //添加回调函数call在前面动作执行结束后播放音效

        var squash = cc.scaleTo(this.squashDuration, 1, 0.6);
        var stretch = cc.scaleTo(this.squashDuration, 1, 1.2);
        var scaleBack = cc.scaleTo(this.squashDuration, 1, 1);

        //创建一个缓动 按jumpUp，jumpDown的顺序执行动作
        var tween = cc.tween().sequence(squash, stretch, jumpUp, scaleBack, jumpDown).call(this.playJumpAudio, this);
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


    onTouchStart(event) {
        var touchLoc = event.getLocation();
        if (touchLoc.x >= cc.winSize.width / 2) {
            this.accLeft = false;
            this.accRight = true;
        } else {
            this.accLeft = true;
            this.accRight = false;
        }
    },

    onTouchEnd(event) {
        this.accLeft = false;
        this.accRight = false;
    },

    //JumpAudio
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

        //触摸屏监听事件
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on('touchstart', this.onTouchStart, this);
        touchReceiver.on('touchend', this.onTouchEnd, this);
    },

    onDestroy() {

        //关闭键盘的监听事件
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeydown, this.node);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyup, this.node);

        //关闭触摸屏监听事件
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off('touchstart', this.onTouchStart, this);
        touchReceiver.off('touchend', this.onTouchEnd, this);
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