//main game file

//references
/// <reference path = "lib/phaser.d.ts" />

type LoadingForm = {
    URL: string,
    name: string,
    type ? : "image" | "text" | "tilemap" | "audio",
}

interface ISprite_loading extends Array < LoadingForm > {}

type Sprite = {
    value: {
        [propName: string]: any
    },
    name: string,
    anchor: number[],
    x ? : number,
    y ? : number,
    scale ? : {
        width: number,
        height: number
    }
}


interface ISprite_create extends Array < Sprite > {}

type CellOfMap = {
    empty: boolean,
    card ? : {
        sprite: {
            value: {},
            name: string,
            anchor: number[]
        },
        statistics: {}

    }
}

interface IMap_for_rendering {
    map: Array < Array < CellOfMap >> ,
        x: number,
        y: number,
        x_size: number,
        y_size: number,
        background: {
            value: {},
            scale: boolean,
            x ? : number,
            y ? : number,
            name: string
        }
}


class KartiskyGL {

    public game: Phaser.Game;

    public spriteLoading: ISprite_loading;

    public toCreate: ISprite_create;

    public mapIndex: Array < IMap_for_rendering > ;

    constructor(div: string, rendering: string, spriteLoading: ISprite_loading, toCreate: ISprite_create, width = 1280, height = 720) {

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

    private preload() {
        var phaser = this;
        this.spriteLoading.forEach(function (element) {
            phaser.game.load.image(element.name, element.URL);
        });

    }

    private create() {
        var phaser = this;
        this.toCreate.forEach(function (element) {
            if (element.x && element.y) {
                element.value = phaser.game.add.sprite(element.x, element.y, element.name);
            } else {
                element.value = phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name);
            }
            element.value.anchor.setTo(element[0], element[1]);
        });
    }

    public load(sprites: ISprite_loading, callback: any) {
        var game = this.game;
        var loader = new Phaser.Loader(game);

        function afterLoad() {
            loader.onLoadComplete.addOnce(callback);
            loader.start();
            loader.onLoadComplete.add(function () {
                console.log('everything is loaded and ready to be used');
                callback(true);
            });
        }

        sprites.forEach(function (element) {
            switch (element.type) {
                case "image":
                    loader.image(element.name, element.URL);
                    afterLoad();
                    break;
                case "text":
                    loader.text(element.name, element.URL);
                    afterLoad();
                    break;
                case "tilemap":
                    loader.tilemap(element.name, element.URL);
                    afterLoad();
                    break;
                case "audio":
                    loader.text(element.name, element.URL);
                    afterLoad();
                    break;
                case undefined:
                    loader.image(element.name, element.URL);
                    afterLoad();
                    break;
            }

        });
    }

    public createSprite(sprites: ISprite_create) {

        var phaser = this;

        sprites.forEach(function (element) {

            if (element.x && element.y) {
                element.value = phaser.game.add.sprite(element.x, element.y, element.name);
            } else {
                element.value = phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name);
            }

            if (element.scale) {
                element.value.scale.x = element.scale.width;
                element.value.scale.y = element.scale.height;
            }

            element.value.anchor.setTo(element[0], element[1]);
        });
    }

    public renderMap(map: IMap_for_rendering) {
        if (map.background.scale) {
            alert(map.background.scale);
            this.createSprite([{
                x: map.background.x,
                y: map.background.y,
                value: map.background.value,
                name: map.background.name,
                anchor: [1, 1],
                scale: {
                    width: map.x * map.x_size,
                    height: map.y * map.y_size
                }
            }]);
        } else {
            this.createSprite([{

                value: map.background.value,
                name: map.background.name,
                anchor: [1, 1]
            }]);
        }

        for (var x = 0; x < map.map.length; x++) {
            console.log("x" + x);
            for (var y = 0; y < map.map[x].length; y++) {
                console.log("y" + y);
                if (!map.map[x][y].empty) {
                    this.createSprite([{
                        value: map[x][y].card.sprite.value,
                        name: map[x][y].card.sprite.name,
                        anchor: map[x][y].card.sprite.anchor,
                        x: map.x + x * map.x_size,
                        y: map.y + y * map.y_size
                    }]);
                }
            }
        }
    }

    public setStaticBackground(sprite: string, x: number, y: number, scale ? : boolean, width ? : number, height ? : number) {

    }
}

window.onload = () => {
    var player = {};
    let game = new KartiskyGL("game", "auto", [{
        name: "ahoj",
        URL: "obr/ahoj.png"
    }], [
        /*{
                value: player,
                name: "ahoj",
                anchor: [0.2, 0.2]
            }*/
    ]);

    var sprite = {};

    /*    setTimeout(() => game.load([{
            URL: "obr/ahoj.png",
            name: "nien"
        }], function () {
            game.createSprite([{
                name: "nien",
                value: sprite,
                anchor: [0.5, 0.5]
            }]);
        }), 1000);*/
    let exampleMap: IMap_for_rendering = {
        map: [
            [{
                empty: true
            }, {
                empty: true
            }, {
                empty: true
            }],
            [{
                empty: true
            }, {
                empty: true
            }, {
                empty: true
            }]
        ],
        x: 0,
        y: 0,
        x_size: 100,
        y_size: 100,
        background: {
            value: {},
            scale: true,
            x: 0,
            y: 0,
            name: "redBackground"
        }
    }
    setTimeout(function () {
            game.load([{
                URL: "obr/background.png",
                name: "redBackground",
                type: "image"
            }], function () {
                game.renderMap(exampleMap)
            });
        }, 2000
    );
}