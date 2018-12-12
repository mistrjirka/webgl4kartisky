"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import pixi, p2 and phaser ce
require("pixi");
require("p2");
const Phaser = __importStar(require("phaser-ce"));
/**
 * Main entry game class
 * @export
 * @class Game
 * @extends {Phaser.Game}
 */
class Game extends Phaser.Game {
    /**
     * Creates an instance of Game.
     * @memberof Game
     */
    constructor() {
        // call parent constructor
        super(800, 600, Phaser.CANVAS, "game", null);
        // add some game states
        // start with boot state
    }
}
exports.Game = Game;
