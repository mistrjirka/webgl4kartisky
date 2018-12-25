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
    overlapWidth: number;
    overlapHeight: number;
    stackingAfterOverflow: boolean;
    background: IBackground;
    numOfCardsX: number;
    numOfCardsY: number;
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

    private render() {}
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
        var loader = new Phaser.Loader(this.game);

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
    static Render = class {
        game: Phaser.Game;

        constructor(game: Phaser.Game) {
            this.game = game;
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
                        phaser.game.add.sprite(
                            element.x,
                            element.y,
                            element.name
                        )
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
            });

            return value;
        }

        public renderBackground(
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
                        name: background.name,
                        anchor: [1, 1]
                    }
                ])[0];
            }
            return image;
        }
    };

    static Map = class extends KartiskyGL.Render {
        map: {
            map: { sprite: undefined | Phaser.Sprite; empty: boolean }[][];
            x: number;
            y: number;
            x_size: number;
            y_size: number;
            background: Phaser.Image;
        };

        constructor(game: Phaser.Game, map: IMap_for_rendering) {
            super(game);
            let background = this.renderBackground(map.background, {
                width: map.map.length * map.x_size,
                height: map.map[0].length * map.y_size
            });

            var value: IGraphicMap;

            var tmpMap: {
                sprite: undefined | Phaser.Sprite;
                empty: boolean;
            }[][] = [];
            map.map.forEach(function(elementx, index) {
                tmpMap[index] = [];
                elementx.forEach((elementy, indey) => {
                    tmpMap[index].push({ sprite: undefined, empty: true });
                });
            });

            this.removeFromMap.bind(this);
            this.addToMap.bind(this);

            for (var x = 0; x < map.map.length; x++) {
                for (var y = 0; y < map.map[x].length; y++) {
                    if (!map.map[x][y].empty) {
                        var configOfSprite: ISprite_create = [
                            {
                                name: map.map[x][y].card.sprite.name,
                                anchor: map.map[x][y].card.sprite.anchor,
                                x: map.x + x * map.x_size,
                                y: map.y + y * map.y_size
                            }
                        ];

                        if (
                            map.map[x][y].card.sprite.typeOfScale ===
                            "automatic"
                        ) {
                            configOfSprite[0].scale = {
                                width: 0,
                                height: 0
                            };
                            configOfSprite[0].scale.width = map.x_size;
                            configOfSprite[0].scale.height = map.y_size;
                        } else if (
                            map.map[x][y].card.sprite.typeOfScale ===
                                "manual" &&
                            typeof map.map[x][y].card.sprite.scale !==
                                "undefined"
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

            this.map = {
                x: map.x,
                y: map.y,
                x_size: map.x_size,
                y_size: map.y_size,
                background: background,
                map: tmpMap
            };
        }

        public removeFromMap(coordinates: { x: number; y: number }[]) {
            var map = this.map.map;
            coordinates.forEach(function(element) {
                if (!map[element.x][element.y].empty) {
                    map[element.x][element.y].sprite.destroy();
                    map[element.x][element.y].empty = true;
                }
            });
        }

        public addToMap(
            sprites: { sprite: ISpriteForMap; x: number; y: number }[]
        ) {
            let map: IGraphicMap;

            let toCreate: ISprite_create = [];

            map = this.map;

            sprites.forEach(sprite => {
                let x: number = sprite.x * map.x_size + map.x;
                let y: number = sprite.y * map.x_size + map.y;

                let spriteConfig = {
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
    };

    static Cardbox = class extends KartiskyGL.Render {
        width: number;
        height: number;

        x: number;
        y: number;

        x_size: number;
        y_size: number;

        overlapWidth: number;
        overlapHeight: number;

        cards: Array<Array<Phaser.Image | undefined>>;

        constructor(game: Phaser.Game, config: cardBox) {
            super(game);
            this.renderBackground(config.background, {
                width: config.width,
                height: config.height
            });

            this.cards = this.make2DArray(
                config.numOfCardsX,
                config.numOfCardsY
            );

            this.x = config.x;
            this.y = config.y;
            this.x_size = config.card_size.width;
            this.y_size = config.card_size.height;
            this.overlapHeight = config.overlapHeight;
            this.overlapWidth = config.overlapWidth;
        }

        private make2DArray(d1, d2) {
            var arr = new Array(d1),
                i,
                l;
            for (i = 0, l = d2; i < l; i++) {
                arr[i] = new Array(d1);
            }
            return arr;
        }

        public addToCardBox(card: Sprite, position?: { x: number; y: number }) {
            var place: number[];

            if (typeof position === "undefined") {
                var done: boolean = false;

                for (var x: number = 0; x < this.cards.length; x++) {
                    for (var y: number = 0; y < this.cards[x].length; y++) {
                        if (typeof this.cards[x][y] === "undefined") {
                            place = [y, x];
                            done = true;
                            break;
                        }
                    }

                    if(done) break;
                }
            } else {
                place = [position.x, position.y];
            }

            if (!done) {
                this.stacking();
            } else {
                card.x = this.x + (this.x_size - this.overlapWidth) * place[0];
                card.y = this.y + (this.y_size - this.overlapHeight) * place[1];
                this.cards[place[0]][place[1]] = this.createSprite([card])[0];
            }
        }

        public removeFromCardBox(position: { x: number; y: number }) {
            if (typeof this.cards[position.x][position.y] !== "undefined") {
                this.cards[position.x][position.y].destroy();
                this.cards[position.x][position.y] = undefined;
            }
        }

        private stacking() {}
    };
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
                var map = new KartiskyGL.Map(game.game, exampleMap);
                setTimeout(function() {
                    map.addToMap([
                        {
                            sprite: {
                                name: "car",
                                anchor: [0.1, 0.1],
                                typeOfScale: "automatic"
                            },
                            x: 0,
                            y: 1
                        },
                        {
                            sprite: {
                                name: "car",
                                anchor: [0.1, 0.1],
                                typeOfScale: "automatic"
                            },
                            x: 0,
                            y: 2
                        }
                    ]);
                    map.removeFromMap([{ x: 0, y: 0 }]);
                    var cardBox = new KartiskyGL.Cardbox(game.game, {
                        x: 300,
                        y: 400,
                        width: 200,
                        height: 400,
                        anchor: [0, 0],
                        card_size: {
                            width: 100,
                            height: 100
                        },
                        overlapHeight: 2,
                        overlapWidth: 2,
                        stackingAfterOverflow: true,
                        background: {
                            anchor: [1, 1],
                            autoScale: true,
                            x: 300,
                            y: 400,
                            name: "redBackground"
                        },
                        numOfCardsX: 3,
                        numOfCardsY: 4
                    });

                    cardBox.addToCardBox({
                        name: "car",
                        anchor: [0, 0],
                        scale: {
                            width: 100,
                            height:100
                        }
                    });
                    cardBox.addToCardBox({
                        name: "car",
                        anchor: [0, 0],
                        scale: {
                            width: 100,
                            height:100
                        }
                    });
                }, 2000);
            }
        );
    }, 2000);
};
