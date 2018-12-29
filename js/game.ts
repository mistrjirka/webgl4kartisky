//references
/// <reference path = "engine.ts" />

interface ICardConfig {
    width: number;
    height: number;
    hero: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    text: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    name: string;
}

interface IText extends Sprite{

}

interface ICardAssemblerPartsKnown {
    type: "hero" | "text";
    sprite: Phaser.Sprite | Sprite | Phaser.Text;
}

interface ICardAssemblerPartsUnknown {
    type: "other";
    sprite: {
        name: string;
        anchor: number[];
        x: number;
        y: number;
        scale?: {
            width: number;
            height: number;
        };
    };
}

class Game extends KartiskyGL {
    constructor(
        div: string,
        toLoad: ISprite_loading = [],
        ToCreate: ISprite_create = [],
        resolution: { x: number; y: number } = { x: 1280, y: 720 }
    ) {
        super(div, "auto", toLoad, ToCreate, resolution.x, resolution.y);
    }

    static cardAssembler = class extends KartiskyGL.Render{
        public hero: Phaser.Sprite;
        public text: Phaser.Text;
        public other: (Phaser.Sprite | Phaser.Text | Phaser.Image)[];

        constructor(game: Phaser.Game, parts: (ICardAssemblerPartsKnown | ICardAssemblerPartsUnknown) [], cardConfig: ICardConfig, x: number, y: number, width: number, height: number) {
            super(game);


        }
    };
}
