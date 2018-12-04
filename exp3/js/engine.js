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
    KartiskyGL.prototype.loadSprite = function (sprites, callback) {
        var game = this.game;
        var loader = new Phaser.Loader(game);
        sprites.forEach(function (element) {
            loader.image(element.name, element.URL); /* loader.atlasJSONHash('anotherAtlas', '//url/to/texture', '//url/to/atlas'); */
            loader.onLoadComplete.addOnce(callback);
            loader.start();
            loader.onLoadComplete.add(function () {
                console.log('everything is loaded and ready to be used');
                callback(true);
            });
            console.log(game);
            //loader.onFileError(alert)
        });
    };
    KartiskyGL.prototype.createSprite = function (sprites) {
        var phaser = this;
        sprites.forEach(function (element) {
            if (element.x && element.y) {
                element.value = phaser.game.add.sprite(element.x, element.y, element.name);
            }
            else {
                element.value = phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name);
            }
            element.value.anchor.setTo(element[0], element[1]);
        });
    };
    KartiskyGL.prototype.createMapByArray = function (map) {
    };
    return KartiskyGL;
}());
window.onload = function () {
    var player = {};
    var game = new KartiskyGL("game", "auto", [{
            name: "ahoj",
            URL: "obr/ahoj.png"
        }], [{
            value: player,
            name: "ahoj",
            anchor: [0.5, 0.5]
        }]);
    var sprite = {};
    setTimeout(function () { return game.loadSprite([{
            URL: "obr/ahoj.png",
            name: "nien"
        }], function () {
        game.createSprite([{
                name: "nien",
                value: sprite,
                anchor: [0.5, 0.5]
            }]);
    }); }, 1000);
};
