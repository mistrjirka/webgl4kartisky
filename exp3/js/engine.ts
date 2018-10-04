//main game file

//references
/// <reference path = "lib/phaser.d.ts" />


class KartiskyGL {

    public game: Phaser.Game;

    public spriteLoading: {
        sprite: string,
        name: string
    } [] = [];

    public toCreate: {
        value: {
            [propName: string]: any
        },
        name: string,
        anchor: number[]
    } [] = [];

    constructor(div: string, rendering: string, spriteLoading: {
        sprite: string,
        name: string
    } [], toCreate: {
        value: {
            [propName: string]: any
        },
        name: string,
        anchor: number[]
    } [], width = 1280, height = 720) {

        var settingsForPhaser = {
            preload: this.preload,
            create: this.create,
            spriteLoading: spriteLoading,
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
        this.spriteLoading.forEach(function (element) {
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

    loadSpirte(sprites: {
        sprite: string,
        name: string
    } [], callback: () => void) {
        sprites.forEach(function (element) {
            this.gme.load.image(element.name, element.sprite);
        });
        this.game.load.start();
        this.game.load.onLoadComplete.add(callback, this);
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
