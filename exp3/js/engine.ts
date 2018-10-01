//main game file

//references
/// <reference path = "lib/phaser.d.ts" />
class KartiskyGL {

    public game: Phaser.Game;

    public toPreload: {
        sprite: string,
        name: string
    } [] = [];

    public toCreate: {
        value: {[propName: string]: any},
        name: string,
        anchor: number[]
    } [] = [];

    constructor(div: string, rendering: string, toPreload: {
        sprite: string,
        name: string
    } [], toCreate: {
        value: {[propName: string]: any},
        name: string,
        anchor: number[]
    } [], width = 1280, height = 720) {
        var settingsForPhaser = {
            preload: this.preload,
            create: this.create,
            toPreload: toPreload,
            toCreate: toCreate
        };
        switch (rendering) {
            case "auto":
                this.game = new Phaser.Game(width, height, Phaser.AUTO, div, settingsForPhaser);
                break;
            case "webgl":
                this.game = new Phaser.Game(width, height, Phaser.WEBGL, div, settingsForPhaser);
                break;
            case "canvas":
                this.game = new Phaser.Game(width, height, Phaser.CANVAS, div, settingsForPhaser);
                break;
        }
    }

    preload() {
        var phaser = this;
        this.toPreload.forEach(function (element) {
            phaser.game.load.image(element.name, element.sprite);
        });
    }

    create() {
        var phaser = this;
        this.toCreate.forEach(function (element) {
            element.value = phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name);
            element.value.anchor.setTo(element[0], element[1]);
        });
    }

}

window.onload = () => {
    var player = {};
    let game = new KartiskyGL("game", "auto", [{
        name: "ahoj",
        sprite: "obr/ahoj.png"
    }], [{
        value: player,
        name: "ahoj",
        anchor: [0.5, 0.5]
    }]);
};
