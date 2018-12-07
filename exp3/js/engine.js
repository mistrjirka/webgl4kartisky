//main game file
var KartiskyGL = /** @class */ (function () {
    function KartiskyGL(div, rendering, spriteLoading, toCreate, width, height) {
        if (width === void 0) { width = 1280; }
        if (height === void 0) { height = 720; }
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
                element.value = phaser.game.add.sprite(element.x, element.y, element.name);
            }
            else {
                element.value = phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name);
            }
            element.value.anchor.setTo(element[0], element[1]);
        });
    };
    KartiskyGL.prototype.load = function (sprites, callback) {
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
    };
    KartiskyGL.prototype.createSprite = function (sprites) {
        var phaser = this;
        sprites.forEach(function (element) {
            if (typeof element.x === "number" && typeof element.y === "number") {
                console.log("xy position");
                element.value = phaser.game.add.sprite(element.x, element.y, element.name);
            }
            else {
                console.log(element.x + " ahoj  " + element.y);
                element.value = phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name);
            }
            if (element.scale) {
                console.log("scale");
                console.log(element.scale.width + " " + element.scale.height);
                element.value.width = element.scale.width;
                element.value.height = element.scale.height;
            }
            element.value.anchor.setTo(element[0], element[1]);
        });
    };
    KartiskyGL.prototype.renderMap = function (map) {
        if (map.background.scale) {
            this.createSprite([{
                    x: map.background.x,
                    y: map.background.y,
                    value: map.background.value,
                    name: map.background.name,
                    anchor: [1, 1],
                    scale: {
                        width: map.map.length * map.x_size,
                        height: map.map[0].length * map.y_size
                    }
                }]);
        }
        else {
            this.createSprite([{
                    x: map.background.x,
                    y: map.background.y,
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
                    var configOfSprite = [{
                            value: map.map[x][y].card.sprite.value,
                            name: map.map[x][y].card.sprite.name,
                            anchor: map.map[x][y].card.sprite.anchor,
                            x: map.x + x * map.x_size,
                            y: map.y + y * map.y_size
                        }];
                    if (map.map[x][y].card.sprite.scale) {
                        if (map.map[x][y].card.sprite.scale.type === "automatic") {
                            configOfSprite[0].scale = {
                                width: 0,
                                height: 0
                            };
                            configOfSprite[0].scale.width = map.x_size;
                            configOfSprite[0].scale.height = map.y_size;
                        }
                        else if (map.map[x][y].card.sprite.scale.type === "manual") {
                            configOfSprite[0].scale = {
                                width: 0,
                                height: 0
                            };
                            configOfSprite[0].scale.width = map.map[x][y].card.sprite.scale.width;
                            configOfSprite[0].scale.height = map.map[x][y].card.sprite.scale.height;
                        }
                    }
                    this.createSprite(configOfSprite);
                }
            }
        }
    };
    KartiskyGL.prototype.setStaticBackground = function (sprite, x, y, scale, width, height) {
    };
    return KartiskyGL;
}());
window.onload = function () {
    var player = {};
    var game = new KartiskyGL("game", "auto", [{
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
    var exampleMap = {
        map: [
            [{
                    empty: false,
                    card: {
                        sprite: {
                            value: {},
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
                            value: {},
                            name: "car",
                            anchor: [0.1, 0.1],
                            scale: {
                                type: "automatic"
                            }
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
            value: {},
            scale: true,
            x: 0,
            y: 0,
            name: "redBackground"
        }
    };
    setTimeout(function () {
        game.load([{
                URL: "obr/background.png",
                name: "redBackground",
                type: "image"
            }], function () {
            game.renderMap(exampleMap);
        });
    }, 2000);
};
