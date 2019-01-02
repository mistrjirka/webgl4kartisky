//references
/// <reference path = "engine.ts" />
/// <reference path = "node_modules/@types/jquery/index.d.ts" />

type positioning = {
    x: number;
    y: number;
    width: number;
    height: number;
};

interface ICardConfig {
    width: number;
    height: number;
    hero: positioning;
    text: positioning;
    name: string;
}

interface ICardAssemblerPartsKnown {
    type: "hero" | "text";
    sprite: Phaser.Sprite | SpriteToCreate | Phaser.Text | string | string[];
    style?: {
        font?: string;
        fill?: string;
        align?: string;
        wordWrapWidth?: number;
        maxLines?: number;
        stroke?: string;
        wordWrap?: boolean;
    };
}

interface ICardAssemblerPartsUnknown {
    type: "otherSprite";
    sprite: SpriteToCreate;
}

class Game extends KartiskyGL {
    constructor(
        div: string,
        typeOfRender: "auto" | "webgl" | "canvas",
        toLoad: ISprite_loading = [],
        toCreate: ISprite_create = [],
        resolution: { x: number; y: number } = { x: 1280, y: 720 }
    ) {
        super(div, typeOfRender, toLoad, toCreate, resolution.x, resolution.y);
    }

    static Card = class extends KartiskyGL.Render {
        public card: Phaser.Sprite;
        public hero: Phaser.Sprite;
        public text: Phaser.Text;
        public other: (Phaser.Sprite | Phaser.Text | Phaser.Image)[];

        constructor(
            game: Phaser.Game,
            parts: (ICardAssemblerPartsKnown | ICardAssemblerPartsUnknown)[],
            cardConfig: ICardConfig,
            x: number,
            y: number,
            width: number,
            height: number
        ) {
            super(game);
            let heroTmp: SpriteToCreate;

            let toCreate: SpriteToCreate[] = [
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

            parts.forEach(element => {
                switch (element.type) {
                    case "hero": {
                        if (element.sprite instanceof Phaser.Sprite) {
                            this.hero = element.sprite;
                            this.hero.x = cardConfig.hero.x;
                            this.hero.y = cardConfig.hero.y;
                            this.hero.width = cardConfig.hero.width;
                            this.hero.height = cardConfig.hero.height;
                        } else if (
                            element.sprite instanceof Object &&
                            !(element.sprite instanceof Array) &&
                            typeof element.sprite !== "string"
                        ) {
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
                            this.text = element.sprite;
                            this.text.x = cardConfig.text.x;
                            this.text.y = cardConfig.text.y;
                        } else if (
                            typeof element.sprite === "string" ||
                            Array.isArray(element.sprite)
                        ) {
                            if (typeof element.sprite === "string") {
                                this.text = game.add.text(
                                    cardConfig.text.x,
                                    cardConfig.text.y,
                                    element.sprite,
                                    element.style
                                );
                            } else if (Array.isArray(element.sprite)) {
                                this.text = game.add.text(
                                    x + cardConfig.text.x,
                                    cardConfig.text.y,
                                    "",
                                    element.style
                                );
                                this.text.parseList(element.sprite);
                            }
                            this.text.x = cardConfig.text.x;
                            this.text.y = cardConfig.text.y;
                        }
                        break;
                    }
                    case "otherSprite": {
                        toCreate.push(element.sprite);
                        break;
                    }
                }
            });

            let tmpRaw: Phaser.Sprite[] = this.createSprite(toCreate);
            this.card = tmpRaw[0];
            tmpRaw.shift();
            this.other = tmpRaw;
            this.hero = this.createSprite([heroTmp])[0];
            if (this.text !== undefined)
                this.card.addChild(this.text);
            this.card.addChild(this.hero);

        }
    };
}

window.onload = () => {
    let hra = new Game(
        "game",
        "auto",
        [
            {
                name: "car",
                URL: "obr/car.png"
            },


            {
                name: "karta",
                URL: "obr/karta.png"
            }
        ]
    );
    let karta1;
    setTimeout(() => {
        hra.load(
            [
                {
                    name: "car",
                    URL: "obr/car.png"
                },


                {
                    name: "karta",
                    URL: "obr/karta.png"
                }
            ], function () {
                $.getJSON("obr/card.json", data => {
                    karta1 = new Game.Card(
                        hra.game,
                        [
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

                        ],
                        data,
                        100,
                        25,
                        data.width,
                        data.height
                    );
                });
            });
    }, 200);


};
