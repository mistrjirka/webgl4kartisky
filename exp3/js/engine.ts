//main game file

//references
/// <reference path = "lib/phaser.d.ts" />

type LoadingForm = {
    URL: string,
    name: string,
    type ? : "image" | "text" | "tilemap" | "audio"
}

interface ISprite_loading extends Array < LoadingForm > {}

type Sprite = {
    id: string,
    name: string,
    anchor: number[],
    x ? : number,
    y ? : number,
    scale ? : {
        width: number,
        height: number
    }
}

interface ISpriteForMap extends Sprite {
    typeOfScale?: "automatic" | "manual"
}

interface ISprite_create extends Array < Sprite > {}

type CellOfMap = {
    empty: boolean,
    card ? : {
        sprite: ISpriteForMap
        statistics: {}

    }
}

interface IGraphicMap {
    [index: number]: {
        [index: number]: Phaser.Sprite | undefined
    }
}

interface background {
    id: string,
        scale: boolean,
        x ? : number,
        y ? : number,
        name: string
}

interface cardBox {
    x: number,
        y: number,
        width: number,
        height: number,
        anchor: number[],
        card_size: {
            width: number,
            height: number
        },
        stackingAfterOverflow: boolean,
        background: background
}

interface IMap_for_rendering {
    map: Array < Array < CellOfMap >> ,
        x: number,
        y: number,
        x_size: number,
        y_size: number,
        background: background
}


class KartiskyGL {

    public game: Phaser.Game;

    public spriteLoading: ISprite_loading;

    public toCreate: ISprite_create;

    public mapIndex: Array < IMap_for_rendering > ;

    public sprites: Array < {
            sprite: Phaser.Sprite,
            id: string
        } >

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
                this.sprites.push({
                    sprite: phaser.game.add.sprite(element.x, element.y, element.name),
                    id: this.toCreate.id
                });
            } else {
                this.sprites.push({
                    sprite: phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name),
                    id: this.toCreate.id
                });
            }
            this.sprites[this.sprites.length].anchor.setTo(element[0], element[1]);
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

        var value: Array < Phaser.Sprite > = [] ;

        sprites.forEach(function (element, index) {

            if (typeof element.x === "number" && typeof element.y === "number") {
                console.log("xy position");
                value.push(phaser.game.add.sprite(element.x, element.y, element.name));
            } else {
                console.log(element.x + " ahoj  " + element.y);
                value.push(phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name));
            }

            if (element.scale) {
                console.log("scale");
                console.log(element.scale.width + " " + element.scale.height);
                value[value.length - 1].width = element.scale.width;
                value[value.length - 1].height = element.scale.height;
            }

            value[value.length - 1].anchor.setTo(element[0], element[1]);
        });

        return value;
    }

    public renderMap(map: IMap_for_rendering) {
        this.renderBackground(map.background, {
            width: map.map.length * map.x_size,
            height: map.map[0].length * map.y_size
        });

        for (var x = 0; x < map.map.length; x++) {
            console.log("x" + x);
            for (var y = 0; y < map.map[x].length; y++) {
                console.log("y" + y);
                if (!map.map[x][y].empty) {
                    var configOfSprite: ISprite_create = [{
                        id: map.map[x][y].card.sprite.id,
                        name: map.map[x][y].card.sprite.name,
                        anchor: map.map[x][y].card.sprite.anchor,
                        x: map.x + x * map.x_size,
                        y: map.y + y * map.y_size
                    }];

                    
                        if (map.map[x][y].card.sprite.typeOfScale === "automatic") {
                            console.log("automatic")
                            configOfSprite[0].scale = {
                                width: 0,
                                height: 0
                            };
                            configOfSprite[0].scale.width = map.x_size;
                            configOfSprite[0].scale.height = map.y_size;
                        } else if (map.map[x][y].card.sprite.typeOfScale === "manual" && typeof map.map[x][y].card.sprite.scale !== "undefined") {
                            configOfSprite[0].scale = {
                                width: 0,
                                height: 0
                            };
                            configOfSprite[0].scale.width = map.map[x][y].card.sprite.scale.width;
                            configOfSprite[0].scale.height = map.map[x][y].card.sprite.scale.height;
                        }
                    

                    this.createSprite(configOfSprite);
                }
            }
        }
    }

    public removeFromMap(map: IMap_for_rendering, coordinates: number[]) {
        if (!map.map[coordinates[0]][coordinates[1]].empty) {
            //map.map[coordinates[0]][coordinates[1]].card.sprite.
        }
    }

    public createCardbox(config: cardBox) {
        this.renderBackground(config.background, {
            width: config.width,
            height: config.height
        });


    }

    public addToCardBox() {

    }
    public removeFromCardBox() {

    }

    private renderBackground(background: background, scale ? : {
        width: number,
        height: number
    }) {
        if (background.scale && typeof scale != "undefined") {
            this.createSprite([{
                x: background.x,
                y: background.y,
                name: background.name,
                anchor: [1, 1],
                id: background.id,
                scale: {
                    width: scale.width,
                    height: scale.height
                }
            }]);
        } else {
            this.createSprite([{
                x: background.x,
                y: background.y,
                id: background.id,
                name: background.name,
                anchor: [1, 1]
            }]);
        }
    }
}

window.onload = () => {
    var player = {};
    let game = new KartiskyGL("game", "auto", [{
        name: "car",
        URL: "obr/car.png"
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
                empty: false,
                card: {
                    sprite: {
                        id: "car",
                        name: "car",
                        anchor: [0.1, 0.1]
                    },
                    statistics: {}
                }
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
                empty: false,
                card: {
                    sprite: {
                        id: "var2",
                        name: "car",
                        anchor: [0.1, 0.1],
                        typeOfScale: "automatic"
                        
                    },
                    statistics: {}
                }
            }]
        ],
        x: 0,
        y: 0,
        x_size: 100,
        y_size: 100,
        background: {
            id: "background2",
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
    }, 2000);
}