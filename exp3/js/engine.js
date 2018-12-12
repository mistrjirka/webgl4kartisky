//main game file
//ahoj
//references
/// <reference path = "lib/phaser.d.ts" />
;
var done = true;
var KartiskyGL = /** @class */ (function () {
    function KartiskyGL(div, rendering, spriteLoading, toCreate, width, height) {
        if (width === void 0) { width = 1280; }
        if (height === void 0) { height = 720; }
        this.sprites = [];
        this.maps = [];
        this.images = [];
        this.done = false;
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
        var game = this.game;
        var loader = new Phaser.Loader(game);
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
    KartiskyGL.prototype.createSprite = function (sprites) {
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
            if (element.scale) {
                value[value.length - 1].width = element.scale.width;
                value[value.length - 1].height = element.scale.height;
            }
            value[value.length - 1].anchor.setTo(element[0], element[1]);
            phaser.sprites.push({ sprite: value[value.length - 1], id: element.id });
        });
        return value;
    };
    KartiskyGL.prototype.createImage = function (image) {
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
            if (element.scale) {
                value[value.length - 1].width = element.scale.width;
                value[value.length - 1].height = element.scale.height;
            }
            value[value.length - 1].anchor.setTo(element[0], element[1]);
            game.images.push({ image: value[value.length - 1], id: element.id });
        });
        return value;
    };
    KartiskyGL.prototype.renderMap = function (map) {
        console.log(map.map.length * map.x_size + " " + map.map[0].length * map.y_size);
        this.renderBackground(map.background, {
            width: map.map.length * map.x_size,
            height: map.map[0].length * map.y_size
        });
        done = true;
        alert(this.done);
        for (var x = 0; x < map.map.length; x++) {
            console.log("x" + x);
            for (var y = 0; y < map.map[x].length; y++) {
                console.log("y" + y);
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
                    if (map.map[x][y].card.sprite.typeOfScale === "automatic") {
                        console.log("automatic");
                        configOfSprite[0].scale = {
                            width: 0,
                            height: 0
                        };
                        configOfSprite[0].scale.width = map.x_size;
                        configOfSprite[0].scale.height = map.y_size;
                    }
                    else if (map.map[x][y].card.sprite.typeOfScale === "manual" &&
                        typeof map.map[x][y].card.sprite.scale !== "undefined") {
                        configOfSprite[0].scale = {
                            width: 0,
                            height: 0
                        };
                        configOfSprite[0].scale.width =
                            map.map[x][y].card.sprite.scale.width;
                        configOfSprite[0].scale.height =
                            map.map[x][y].card.sprite.scale.height;
                    }
                    this.createSprite(configOfSprite);
                }
            }
        }
    };
    KartiskyGL.prototype.removeFromMap = function (map, coordinates) {
        if (typeof map === "object") {
            if (!map.map[coordinates[0]][coordinates[1]].empty) {
                map.map[coordinates[0]][coordinates[1]].sprite.destroy();
                map.map[coordinates[0]][coordinates[1]].empty = false;
            }
        }
        else {
            var realMap = this.getMapById(map);
            if (!realMap.map[coordinates[0]][coordinates[1]].empty) {
                realMap.map[coordinates[0]][coordinates[1]].sprite.destroy;
                realMap.map[coordinates[0]][coordinates[1]].empty = false;
            }
        }
    };
    KartiskyGL.prototype.createCardbox = function (config) {
        this.renderBackground(config.background, {
            width: config.width,
            height: config.height
        });
    };
    KartiskyGL.prototype.addToCardBox = function () { };
    KartiskyGL.prototype.removeFromCardBox = function () { };
    KartiskyGL.prototype.renderBackground = function (background, scale) {
        if (background.scale && typeof scale != "undefined") {
            this.createImage([
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
            ]);
        }
        else {
            this.createImage([
                {
                    x: background.x,
                    y: background.y,
                    id: background.id,
                    name: background.name,
                    anchor: [1, 1]
                }
            ]);
        }
    };
    KartiskyGL.prototype.getSpriteById = function (id) {
        return this.sprites.find(function (obj) {
            return obj.id === id;
        });
    };
    KartiskyGL.prototype.getMapById = function (id) {
        return this.maps.find(function (obj) {
            return obj.id === id;
        });
    };
    KartiskyGL.prototype.render = function () {
        if (done) {
            console.log(this.images[0]);
            this.game.debug.spriteBounds(this.images[0]);
        }
    };
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
                    empty: true,
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
        }
    };
    setTimeout(function () {
        game.load([
            {
                URL: "obr/background.png",
                name: "redBackground",
                type: "image"
            }
        ], function () {
            game.renderMap(exampleMap);
        });
    }, 2000);
};
