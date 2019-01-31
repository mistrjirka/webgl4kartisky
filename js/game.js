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
var Kartisky;
(function (Kartisky) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(div, typeOfRender, toLoad, toCreate, resolution) {
            if (toLoad === void 0) { toLoad = []; }
            if (toCreate === void 0) { toCreate = []; }
            if (resolution === void 0) { resolution = { x: 1280, y: 720 }; }
            return _super.call(this, div, typeOfRender, toLoad, toCreate, resolution.x, resolution.y) || this;
        }
        return Game;
    }(KartiskyGL.Game));
    Kartisky.Game = Game;
    var Card = /** @class */ (function (_super) {
        __extends(Card, _super);
        function Card(game, parts, cardConfig, 
        //map: KartiskyGL.Map,
        x, y, width, height) {
            var _this = _super.call(this, game) || this;
            var heroTmp;
            var toCreate = [
                {
                    name: cardConfig.name,
                    anchor: [0.5, 0.5],
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
                            alert("ss");
                            _this.hero = element.sprite;
                            _this.hero.x = cardConfig.hero.x;
                            _this.hero.y = cardConfig.hero.y;
                            _this.hero.width = cardConfig.hero.width;
                            _this.hero.height = cardConfig.hero.height;
                        }
                        else if (element.sprite instanceof Object &&
                            !(element.sprite instanceof Array) &&
                            typeof element.sprite !== "string") {
                            heroTmp = element.sprite;
                            heroTmp.x = cardConfig.hero.x;
                            heroTmp.y = cardConfig.hero.y;
                            heroTmp.scale = { height: cardConfig.hero.height, width: cardConfig.hero.width };
                        }
                        break;
                    }
                    case "text": {
                        element.style.wordWrapWidth = cardConfig.text.width;
                        element.style.wordWrap = true;
                        if (element.sprite instanceof Phaser.Text) {
                            _this.text = element.sprite;
                            _this.text.x = cardConfig.text.x;
                            _this.text.y = cardConfig.text.y;
                        }
                        else if (typeof element.sprite === "string" ||
                            Array.isArray(element.sprite)) {
                            if (typeof element.sprite === "string") {
                                _this.text = game.add.text(cardConfig.text.x, cardConfig.text.y, element.sprite, element.style);
                            }
                            else if (Array.isArray(element.sprite)) {
                                _this.text = game.add.text(x + cardConfig.text.x, cardConfig.text.y, "", element.style);
                                _this.text.parseList(element.sprite);
                            }
                            _this.text.x = cardConfig.text.x;
                            _this.text.y = cardConfig.text.y;
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
            if (heroTmp !== undefined)
                _this.hero = _this.createSprite([heroTmp])[0];
            tmpRaw.shift();
            if (_this.text !== undefined)
                _this.card.addChild(_this.text);
            if (_this.hero !== undefined)
                _this.card.addChild(_this.hero);
            _this.other = tmpRaw;
            return _this;
        }
        Card.prototype.move = function () {
        };
        Card.prototype.attack = function () {
        };
        return Card;
    }(KartiskyGL.Render));
    Kartisky.Card = Card;
})(Kartisky || (Kartisky = {}));
window.onload = function () {
    var hra = new Kartisky.Game("game", "auto", [
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
    setTimeout(function () {
        hra.load([
            {
                name: "car",
                URL: "obr/car.png"
            },
            {
                name: "karta",
                URL: "obr/karta.png"
            }
        ], function () {
            $.getJSON("obr/card.json", function (data) {
                //let mapa = new KartiskyGL.Map(hra, {});
                karta1 = new Kartisky.Card(hra.game, [
                    {
                        type: "hero",
                        sprite: {
                            name: "car",
                            anchor: [0.5, 0.5]
                        }
                    },
                    {
                        type: "text",
                        sprite: "jméno: autíčko síla: 5",
                        style: {
                            font: "30px Arial",
                            fill: "white"
                        }
                    }
                ], data, 100, 25, data.width, data.height);
            });
        });
    }, 200);
};
