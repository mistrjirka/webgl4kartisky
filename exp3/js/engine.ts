//main game file
//ahoj
//references
/// <reference path = "lib/phaser.d.ts" />

type LoadingForm = {
    URL: string;
    name: string;
    type?: "image" | "text" | "tilemap" | "audio";
};

type Image = {
    id: string;
    name: string;
    x?: number;
    y?: number;
    anchor: number[];
    scale?: {
        width: number;
        height: number;
    };
};

type Sprite = {
    id: string;
    name: string;
    anchor: number[];
    x?: number;
    y?: number;
    scale?: {
        width: number;
        height: number;
    };
};

type CellOfMap = {
    empty: boolean;
    card?: {
        sprite: ISpriteForMap;
        statistics: {};
    };
};

interface ISprite_loading extends Array<LoadingForm> {}

interface ISpriteForMap extends Sprite {
    typeOfScale?: "automatic" | "manual";
}

interface ISprite_create extends Array<Sprite> {}

interface IGraphicMap {
    map: Array<Array<{ sprite: Phaser.Sprite | undefined; empty: boolean }>>;
    x: number;
    y: number;
    x_size: number;
    y_size: number;
    background: Phaser.Image;
}

interface IBackground extends Image {
    id: string;
    autoScale: boolean;
}

interface cardBox {
    x: number;
    y: number;
    width: number;
    height: number;
    anchor: number[];
    card_size: {
        width: number;
        height: number;
    };
    stackingAfterOverflow: boolean;
    background: IBackground;
}

interface IMap_for_rendering {
    map: Array<Array<CellOfMap>>;
    x: number;
    y: number;
    x_size: number;
    y_size: number;
    background: IBackground;
    id: string;
}

interface IImage extends Array<Image> {}

class KartiskyGL {
    public game: Phaser.Game;

    public spriteLoading: ISprite_loading;

    public toCreate: ISprite_create;

    public mapIndex: Array<IMap_for_rendering>;

    public sprites: Array<{
        sprite: Phaser.Sprite;
        id: string;
    }> = [];

    public maps: Array<{
        map: IGraphicMap;
        id: string;
    }> = [];

    public images: Array<{
        image: Phaser.Image;
        id: string;
    }> = [];

    constructor(
        div: string,
        rendering: string,
        spriteLoading: ISprite_loading,
        toCreate: ISprite_create,
        width = 1280,
        height = 720
    ) {
        var settingsForPhaser = {
            preload: this.preload,
            create: this.create,
            render: this.render.bind(this),
            spriteLoading: spriteLoading,
            toCreate: toCreate
        };
        switch (rendering) {
            case "auto":
                this.game = new Phaser.Game(
                    width,
                    height,
                    Phaser.AUTO,
                    div,
                    settingsForPhaser
                );
                break;
            case "webgl":
                this.game = new Phaser.Game(
                    width,
                    height,
                    Phaser.WEBGL,
                    div,
                    settingsForPhaser
                );
                break;
            case "canvas":
                this.game = new Phaser.Game(
                    width,
                    height,
                    Phaser.CANVAS,
                    div,
                    settingsForPhaser
                );
                break;
        }
    }

    private preload() {
        var phaser = this;
        this.spriteLoading.forEach(function(element) {
            phaser.game.load.image(element.name, element.URL);
        });
    }

    private create() {
        var phaser = this;
        this.toCreate.forEach(function(element) {
            if (element.x && element.y) {
                this.sprites.push({
                    sprite: phaser.game.add.sprite(
                        element.x,
                        element.y,
                        element.name
                    ),
                    id: this.toCreate.id
                });
            } else {
                this.sprites.push({
                    sprite: phaser.game.add.sprite(
                        phaser.game.world.centerX,
                        phaser.game.world.centerY,
                        element.name
                    ),
                    id: this.toCreate.id
                });
            }
            this.sprites[this.sprites.length].anchor.setTo(
                element[0],
                element[1]
            );
        });
    }

    public load(sprites: ISprite_loading, callback: any) {
        var game = this.game;
        var loader = new Phaser.Loader(game);

        function afterLoad() {
            loader.start();
            loader.onLoadComplete.add(function() {
                callback(true);
            });
        }

        sprites.forEach(function(element) {
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

        var value: Array<Phaser.Sprite> = [];

        sprites.forEach(function(element, index) {
            if (
                typeof element.x === "number" &&
                typeof element.y === "number"
            ) {
                value.push(
                    phaser.game.add.sprite(element.x, element.y, element.name)
                );
            } else {
                value.push(
                    phaser.game.add.sprite(
                        phaser.game.world.centerX,
                        phaser.game.world.centerY,
                        element.name
                    )
                );
            }

            if (typeof element.scale !== "undefined") {
                value[value.length - 1].width = element.scale.width;
                value[value.length - 1].height = element.scale.height;
            }

            value[value.length - 1].anchor.setTo(element[0], element[1]);

            phaser.sprites.push({
                sprite: value[value.length - 1],
                id: element.id
            });
        });
        return value;
    }

    public createImage(image: IImage) {
        var game = this;

        var value: Array<Phaser.Image> = [];

        image.forEach(function(element, index) {
            if (
                typeof element.x === "number" &&
                typeof element.y === "number"
            ) {
                value.push(
                    game.game.add.image(element.x, element.y, element.name)
                );
            } else {
                value.push(
                    game.game.add.image(
                        game.game.world.centerX,
                        game.game.world.centerY,
                        element.name
                    )
                );
            }
            console.log(element.scale);
            if (typeof element.scale !== "undefined") {
                value[value.length - 1].width = element.scale.width;
                value[value.length - 1].height = element.scale.height;
            }

            value[value.length - 1].anchor.setTo(element[0], element[1]);
            game.images.push({
                image: value[value.length - 1],
                id: element.id
            });
        });

        return value;
    }

    public renderMap(map: IMap_for_rendering) {
        let background = this.renderBackground(map.background, {
            width: map.map.length * map.x_size,
            height: map.map[0].length * map.y_size
        });

        var value: IGraphicMap;

        var tmpMap = [];
        map.map.forEach(function(elementx, index) {
            tmpMap[index] = [];
            elementx.forEach((elementy, indey) => {
                tmpMap[index].push({ sprite: undefined, empty: true });
            });
        });

        for (var x = 0; x < map.map.length; x++) {
            for (var y = 0; y < map.map[x].length; y++) {
                if (!map.map[x][y].empty) {
                    var configOfSprite: ISprite_create = [
                        {
                            id: map.map[x][y].card.sprite.id,
                            name: map.map[x][y].card.sprite.name,
                            anchor: map.map[x][y].card.sprite.anchor,
                            x: map.x + x * map.x_size,
                            y: map.y + y * map.y_size
                        }
                    ];

                    if (map.map[x][y].card.sprite.typeOfScale === "automatic") {
                        configOfSprite[0].scale = {
                            width: 0,
                            height: 0
                        };
                        configOfSprite[0].scale.width = map.x_size;
                        configOfSprite[0].scale.height = map.y_size;
                    } else if (
                        map.map[x][y].card.sprite.typeOfScale === "manual" &&
                        typeof map.map[x][y].card.sprite.scale !== "undefined"
                    ) {
                        configOfSprite[0].scale = {
                            width: 0,
                            height: 0
                        };
                        configOfSprite[0].scale.width =
                            map.map[x][y].card.sprite.scale.width;
                        configOfSprite[0].scale.height =
                            map.map[x][y].card.sprite.scale.height;
                    }

                    let finalSprite = this.createSprite(configOfSprite);
                    tmpMap[x][y] = { sprite: finalSprite[0], empty: false };
                }
            }
        }

        value = {
            x: map.x,
            y: map.y,
            x_size: map.x_size,
            y_size: map.y_size,
            background: background,
            map: tmpMap
        };

        this.maps.push({ map: value, id: map.id });
    }

    public removeFromMap(
        mapOrId: IGraphicMap | string,
        coordinatesArray: number[][]
    ) {
        let map: IGraphicMap;

        if (typeof mapOrId === "object") {
            map = mapOrId;
        } else {
            map = this.getMapById(mapOrId).map;
        }

        coordinatesArray.forEach(function(coordinates) {
            if (!map.map[coordinates[0]][coordinates[1]].empty) {
                map.map[coordinates[0]][coordinates[1]].sprite.destroy();
                map.map[coordinates[0]][coordinates[1]].empty = true;
            }
        });
    }

    public addToMap(
        mapOrId: IGraphicMap | string,
        sprites: { sprite: ISpriteForMap; x: number; y: number }[]
    ) {
        let map: IGraphicMap;

        let toCreate: ISprite_create = [];

        if (typeof mapOrId === "string") {
            map = this.getMapById(mapOrId).map;
        } else {
            map = mapOrId;
        }

        sprites.forEach(sprite => {
            let x: number = sprite.x * map.x_size + map.x;
            let y: number = sprite.y * map.x_size + map.y;

            let spriteConfig = {
                id: sprite.sprite.id,
                name: sprite.sprite.name,
                anchor: sprite.sprite.anchor,
                x: x,
                y: y,
                scale: {
                    width: 0,
                    height: 0
                }
            };

            if (sprite.sprite.typeOfScale === "automatic") {
                spriteConfig.scale.width = map.x_size;
                spriteConfig.scale.height = map.y_size;
            } else if (
                sprite.sprite.typeOfScale === "manual" &&
                typeof sprite.sprite.scale !== "undefined"
            ) {
                spriteConfig.scale = {
                    width: 0,
                    height: 0
                };
                spriteConfig.scale.width = sprite.sprite.scale.width;
                spriteConfig.scale.height = sprite.sprite.scale.height;
            }

            toCreate.push(spriteConfig);
        });

        this.createSprite(toCreate);
    }

    public createCardbox(config: cardBox) {
        this.renderBackground(config.background, {
            width: config.width,
            height: config.height
        });
    }

    public addToCardBox() {}
    public removeFromCardBox() {}

    private renderBackground(
        background: IBackground,
        scale?: {
            width: number;
            height: number;
        }
    ) {
        let image: Phaser.Image;
        if (typeof scale != "undefined") {
            image = this.createImage([
                {
                    x: background.x,
                    y: background.y,
                    name: background.name,
                    anchor: [1, 1],
                    id: background.id,
                    scale: {
                        width: scale.width,
                        height: scale.height
                    }
                }
            ])[0];
        } else {
            image = this.createImage([
                {
                    x: background.x,
                    y: background.y,
                    id: background.id,
                    name: background.name,
                    anchor: [1, 1]
                }
            ])[0];
        }
        return image;
    }

    public getSpriteById(id: string) {
        return this.sprites.find(obj => {
            return obj.id === id;
        });
    }

    public getMapById(id: string) {
        return this.maps.find(obj => {
            return obj.id === id;
        });
    }

    private render() {}
}

window.onload = () => {
    var player = {};
    let game = new KartiskyGL(
        "game",
        "auto",
        [
            {
                name: "car",
                URL: "obr/car.png"
            }
        ],
        [
            /*{
                value: player,
                name: "ahoj",
                anchor: [0.2, 0.2]
            }*/
        ]
    );

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
            [
                {
                    empty: false,
                    card: {
                        sprite: {
                            id: "car",
                            name: "car",
                            anchor: [0, 0],
                            typeOfScale: "automatic"
                        },
                        statistics: {}
                    }
                },
                {
                    empty: true
                },
                {
                    empty: true
                }
            ],
            [
                {
                    empty: true
                },
                {
                    empty: true
                },
                {
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
                }
            ]
        ],
        x: 0,
        y: 0,
        x_size: 100,
        y_size: 100,
        background: {
            anchor: [1, 1],
            id: "background2",
            autoScale: true,
            x: 0,
            y: 0,
            name: "redBackground"
        },
        id: "map2"
    };
    setTimeout(function() {
        game.load(
            [
                {
                    URL: "obr/background.png",
                    name: "redBackground",
                    type: "image"
                }
            ],
            function() {
                game.renderMap(exampleMap);
                setTimeout(function() {
                    game.addToMap(game.getMapById("map2").map, [
                        {
                            sprite: {
                                id: "varsd2",
                                name: "car",
                                anchor: [0.1, 0.1],
                                typeOfScale: "automatic"
                            },
                            x: 0,
                            y: 1
                        },
                        {
                            sprite: {
                                id: "varsdsad2",
                                name: "car",
                                anchor: [0.1, 0.1],
                                typeOfScale: "automatic"
                            },
                            x: 0,
                            y: 2
                        }
                    ]);

                    game.removeFromMap("map2", [[0,0], [0,1]]);
                }, 2000);
            }
        );
    }, 2000);
};
