//main game file
//ahoj
//references
/// <reference path = "lib/phaser.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var KartiskyGL = /** @class */ (function () {
    function KartiskyGL(div, rendering, spriteLoading, toCreate, width, height) {
        if (width === void 0) { width = 1280; }
        if (height === void 0) { height = 720; }
        this.sprites = [];
        this.maps = [];
        this.images = [];
        var settingsForPhaser = {
            preload: this.preload,
            create: this.create,
            render: this.render.bind(this),
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
    KartiskyGL.prototype.render = function () { };
    KartiskyGL.prototype.preload = function () {
        var phaser = this;
        this.spriteLoading.forEach(function (element) {
            phaser.game.load.image(element.name, element.URL);
        });
    };
    KartiskyGL.prototype.create = function () {
        var phaser = this;
        this.toCreate.forEach(function (element) {
            if (element.x && element.y) {
                this.sprites.push({
                    sprite: phaser.game.add.sprite(element.x, element.y, element.name),
                    id: this.toCreate.id
                });
            }
            else {
                this.sprites.push({
                    sprite: phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name),
                    id: this.toCreate.id
                });
            }
            this.sprites[this.sprites.length].anchor.setTo(element[0], element[1]);
        });
    };
    KartiskyGL.prototype.load = function (sprites, callback) {
        var loader = new Phaser.Loader(this.game);
        function afterLoad() {
            loader.start();
            loader.onLoadComplete.add(function () {
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
    };
    KartiskyGL.Render = /** @class */ (function () {
        function class_1(game) {
            this.game = game;
        }
        class_1.prototype.createSprite = function (sprites) {
            var phaser = this;
            var value = [];
            sprites.forEach(function (element, index) {
                if (typeof element.x === "number" &&
                    typeof element.y === "number") {
                    value.push(phaser.game.add.sprite(element.x, element.y, element.name));
                }
                else {
                    value.push(phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name));
                }
                if (typeof element.scale !== "undefined") {
                    value[value.length - 1].width = element.scale.width;
                    value[value.length - 1].height = element.scale.height;
                }
                value[value.length - 1].anchor.setTo(element[0], element[1]);
            });
            return value;
        };
        class_1.prototype.createImage = function (image) {
            var game = this;
            var value = [];
            image.forEach(function (element, index) {
                if (typeof element.x === "number" &&
                    typeof element.y === "number") {
                    value.push(game.game.add.image(element.x, element.y, element.name));
                }
                else {
                    value.push(game.game.add.image(game.game.world.centerX, game.game.world.centerY, element.name));
                }
                console.log(element.scale);
                if (typeof element.scale !== "undefined") {
                    value[value.length - 1].width = element.scale.width;
                    value[value.length - 1].height = element.scale.height;
                }
                value[value.length - 1].anchor.setTo(element[0], element[1]);
            });
            return value;
        };
        class_1.prototype.renderBackground = function (background, scale) {
            var image;
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
            }
            else {
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
        };
        return class_1;
    }());
    KartiskyGL.Map = /** @class */ (function (_super) {
        __extends(class_2, _super);
        function class_2(game, map) {
            var _this = _super.call(this, game) || this;
            var background = _this.renderBackground(map.background, {
                width: map.map.length * map.x_size,
                height: map.map[0].length * map.y_size
            });
            var value;
            var tmpMap = [];
            map.map.forEach(function (elementx, index) {
                tmpMap[index] = [];
                elementx.forEach(function (elementy, indey) {
                    tmpMap[index].push({ sprite: undefined, empty: true });
                });
            });
            _this.removeFromMap.bind(_this);
            _this.addToMap.bind(_this);
            for (var x = 0; x < map.map.length; x++) {
                for (var y = 0; y < map.map[x].length; y++) {
                    if (!map.map[x][y].empty) {
                        var configOfSprite = [
                            {
                                id: map.map[x][y].card.sprite.id,
                                name: map.map[x][y].card.sprite.name,
                                anchor: map.map[x][y].card.sprite.anchor,
                                x: map.x + x * map.x_size,
                                y: map.y + y * map.y_size
                            }
                        ];
                        if (map.map[x][y].card.sprite.typeOfScale ===
                            "automatic") {
                            configOfSprite[0].scale = {
                                width: 0,
                                height: 0
                            };
                            configOfSprite[0].scale.width = map.x_size;
                            configOfSprite[0].scale.height = map.y_size;
                        }
                        else if (map.map[x][y].card.sprite.typeOfScale ===
                            "manual" &&
                            typeof map.map[x][y].card.sprite.scale !==
                                "undefined") {
                            configOfSprite[0].scale = {
                                width: 0,
                                height: 0
                            };
                            configOfSprite[0].scale.width =
                                map.map[x][y].card.sprite.scale.width;
                            configOfSprite[0].scale.height =
                                map.map[x][y].card.sprite.scale.height;
                        }
                        var finalSprite = _this.createSprite(configOfSprite);
                        tmpMap[x][y] = { sprite: finalSprite[0], empty: false };
                    }
                }
            }
            _this.map = {
                x: map.x,
                y: map.y,
                x_size: map.x_size,
                y_size: map.y_size,
                background: background,
                map: tmpMap
            };
            return _this;
        }
<<<<<<< HEAD:exp3/js/engine.js
        class_2.prototype.removeFromMap = function (coordinates) {
            var map = this.map.map;
            coordinates.forEach(function (element) {
                if (!map[element.x][element.y].empty) {
                    map[element.x][element.y].sprite.destroy();
                    map[element.x][element.y].empty = true;
=======
        value = {
            x: map.x,
            y: map.y,
            x_size: map.x_size,
            y_size: map.y_size,
            background: background,
            map: tmpMap
        };
        this.maps.push({ map: value, id: map.id });
    };
    KartiskyGL.prototype.removeFromMap = function (mapOrId, coordinatesArray) {
        var map;
        if (typeof mapOrId === "object") {
            map = mapOrId;
        }
        else {
            map = this.getMapById(mapOrId).map;
        }
        coordinatesArray.forEach(function (coordinates) {
            if (!map.map[coordinates[0]][coordinates[1]].empty) {
                map.map[coordinates[0]][coordinates[1]].sprite.destroy();
                map.map[coordinates[0]][coordinates[1]].empty = true;
            }
        });
    };
    KartiskyGL.prototype.addToMap = function (mapOrId, sprites) {
        var map;
        var toCreate = [];
        if (typeof mapOrId === "string") {
            map = this.getMapById(mapOrId).map;
        }
        else {
            map = mapOrId;
        }
        sprites.forEach(function (sprite) {
            var x = sprite.x * map.x_size + map.x;
            var y = sprite.y * map.x_size + map.y;
            var spriteConfig = {
                id: sprite.sprite.id,
                name: sprite.sprite.name,
                anchor: sprite.sprite.anchor,
                x: x,
                y: y,
                scale: {
                    width: 0,
                    height: 0
>>>>>>> 949ee0b04164bbf6add131ac2ce229a631c0dd10:js/engine.js
                }
            });
        };
        class_2.prototype.addToMap = function (sprites) {
            var map;
            var toCreate = [];
            map = this.map;
            sprites.forEach(function (sprite) {
                var x = sprite.x * map.x_size + map.x;
                var y = sprite.y * map.x_size + map.y;
                var spriteConfig = {
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
                }
                else if (sprite.sprite.typeOfScale === "manual" &&
                    typeof sprite.sprite.scale !== "undefined") {
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
        };
        return class_2;
    }(KartiskyGL.Render));
    KartiskyGL.Cardbox = /** @class */ (function (_super) {
        __extends(class_3, _super);
        function class_3(game, config) {
            var _this = _super.call(this, game) || this;
            _this.renderBackground(config.background, {
                width: config.width,
                height: config.height
            });
            return _this;
        }
        class_3.prototype.addToCardBox = function () { };
        class_3.prototype.removeFromCardBox = function () { };
        return class_3;
    }(KartiskyGL.Render));
    return KartiskyGL;
}());
window.onload = function () {
    var player = {};
    var game = new KartiskyGL("game", "auto", [
        {
            name: "car",
            URL: "obr/car.png"
        }
    ], [
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
    var exampleMap = {
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
    setTimeout(function () {
        game.load([
            {
                URL: "obr/background.png",
                name: "redBackground",
                type: "image"
            }
        ], function () {
            var map = new KartiskyGL.Map(game.game, exampleMap);
            setTimeout(function () {
                map.addToMap([
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
<<<<<<< HEAD:exp3/js/engine.js
                map.removeFromMap([{ x: 0, y: 0 }]);
=======
                game.removeFromMap("map2", [[0, 0], [0, 1]]);
>>>>>>> 949ee0b04164bbf6add131ac2ce229a631c0dd10:js/engine.js
            }, 2000);
        });
    }, 2000);
};