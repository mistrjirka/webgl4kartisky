//main game file

//references
/// <reference path = "lib/phaser.d.ts" />


class KartiskyGL {

    public game: Phaser.Game;

    public spriteLoading: {
        URL: string,
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
        URL: string,
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
            phaser.game.load.image(element.name, element.URL);
        });

    }

    create() {
        var phaser = this;
        this.toCreate.forEach(function (element) {
            element.value = phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name);
            element.value.anchor.setTo(element[0], element[1]);
        });
    }

    loadSprite(sprites: {
        URL: string,
        name: string
    } [], callback: any) {
        var game = this.game;
        var loader = new Phaser.Loader(game);
        for (var i = 0; i < sprites.length; i++) {
            loader.image(sprites[i].name, sprites[i].URL); /* loader.atlasJSONHash('anotherAtlas', '//url/to/texture', '//url/to/atlas'); */
            loader.onLoadComplete.addOnce(callback);
            loader.start();
            loader.onLoadComplete.add(function () {
                console.log('everything is loaded and ready to be used');
                callback(true);
            });
            console.log(game);
            //loader.onFileError(alert)

        }
    }

}

//window.onload = () => {
var player = {};
let game = new KartiskyGL("game", "auto", [{
    name: "ahoj",
    URL: "obr/ahoj.png"
    }], [{
    value: player,
    name: "ahoj",
    anchor: [0.5, 0.5]
    }]);
setTimeout(() => game.loadSprite([{
    URL: "obr/ahoj.png",
    name: "nien"
    }], alert), 5000);

//};
