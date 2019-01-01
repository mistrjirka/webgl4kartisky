//references
/// <reference path = "engine.ts" />
/// <reference path = "node_modules/@types/jquery/index.d.ts" />
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
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game(div, typeOfRender, toLoad, toCreate, resolution) {
        if (toLoad === void 0) { toLoad = []; }
        if (toCreate === void 0) { toCreate = []; }
        if (resolution === void 0) { resolution = { x: 1280, y: 720 }; }
        return _super.call(this, div, typeOfRender, toLoad, toCreate, resolution.x, resolution.y) || this;
    }
    Game.Card = /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(game, parts, cardConfig, x, y, width, height) {
            var _this = _super.call(this, game) || this;
            var heroTmp;
            var toCreate = [
                {
                    name: cardConfig.name,
                    anchor: [1, 1],
                    x: x,
                    y: y,
                    scale: {
                        width: width,
                        height: height
                    }
                }
            ];
            parts.forEach(function (element) {
                switch (element.type) {
                    case "hero": {
                        if (element.sprite instanceof Phaser.Sprite) {
                            _this.hero = element.sprite;
                        }
                        else if (element.sprite instanceof Object &&
                            !(element.sprite instanceof Array) &&
                            typeof element.sprite !== "string") {
                            heroTmp = element.sprite;
                        }
                        break;
                    }
                    case "text": {
                        if (element.sprite instanceof Phaser.Text) {
                            _this.text = element.sprite;
                            _this.text.x = x + cardConfig.text.x;
                            _this.text.y = y + cardConfig.text.y;
                        }
                        else if (typeof element.sprite === "string" ||
                            Array.isArray(element.sprite)) {
                            if (typeof element.sprite === "string") {
                                _this.text = game.add.text(x + cardConfig.text.x + x, cardConfig.text.y + y, element.sprite, element.style);
                            }
                            else if (Array.isArray(element.sprite)) {
                                _this.text = game.add.text(x + cardConfig.text.x + x, cardConfig.text.y + y, "", element.style);
                                _this.text.parseList(element.sprite);
                            }
                            _this.text.x = x + cardConfig.text.x;
                            _this.text.y = y + cardConfig.text.y;
                        }
                        break;
                    }
                    case "otherSprite": {
                        toCreate.push(element.sprite);
                        break;
                    }
                }
            });
            var tmpRaw = _this.createSprite(toCreate);
            _this.card = tmpRaw[0];
            tmpRaw.shift();
            _this.other = tmpRaw;
            _this.hero = _this.createSprite([heroTmp])[0];
            _this.card.addChild(_this.text);
            _this.card.addChild(_this.hero);
            return _this;
        }
        return class_1;
    }(KartiskyGL.Render));
    return Game;
}(KartiskyGL));
window.onload = function () {
    var hra = new Game("game", "auto", [
        {
            name: "car",
            URL: "obr/car.png"
        },
        {
            name: "karta",
            URL: "obr/karta.png"
        }
    ]);
    var karta1;
    $.getJSON("obr/card.json", function (data) {
        karta1 = new Game.Card(hra.game, [
            {
                type: "hero",
                sprite: {
                    name: "car",
                    anchor: [1, 1]
                }
            }
        ], data, 100, 100, data.width, data.height);
    });
};
