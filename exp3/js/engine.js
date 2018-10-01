//main game file
//references
/// <reference path = "lib/phaser.d.ts" />
var KartiskyGL = /** @class */ (function () {
    function KartiskyGL(div, rendering, toPreload, toCreate, width, height) {
        if (width === void 0) { width = 1280; }
        if (height === void 0) { height = 720; }
        this.toPreload = [];
        this.toCreate = [];
        var settingsForPhaser = {
            preload: this.preload,
            create: this.create,
            toPreload: toPreload,
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
        this.toPreload.forEach(function (element) {
            phaser.game.load.image(element.name, element.sprite);
        });
    };
    KartiskyGL.prototype.create = function () {
        var phaser = this;
        this.toCreate.forEach(function (element) {
            element.value = phaser.game.add.sprite(phaser.game.world.centerX, phaser.game.world.centerY, element.name);
            element.value.anchor.setTo(element[0], element[1]);
        });
    };
    return KartiskyGL;
}());
window.onload = function () {
    var player = {};
    var game = new KartiskyGL("game", "auto", [{
            name: "ahoj",
            sprite: "obr/ahoj.png"
        }], [{
            value: player,
            name: "ahoj",
            anchor: [0.5, 0.5]
        }]);
};
