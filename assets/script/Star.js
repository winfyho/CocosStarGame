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

        //星星和主角之间的距离小于这个值才能收集
        pickRadius: 60,
    },


    getPlayerDistance() {
        var playerPos = this.game.player.getPosition();
        //console.log("playerPos", playerPos);
        //根据两点计算两点之间的距离
        var dist = this.node.position.sub(playerPos).mag();
        //console.log("Dist", dist);
        return dist;
    },

    onPick() {
        //当星星被收集时，调用Game中的接口，生成新的星星
        this.game.spawnNewStar();
        this.game.gainScore();
        //随后销毁当前星星
        this.node.destroy();
    },
    // onLoad () {},

    start() {

    },


    update(dt) {
        //console.log(this.game);
        this.pickRadius = 60;
        //console.log(this.pickRadius);
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPick();
            return;
        }


        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    },
});