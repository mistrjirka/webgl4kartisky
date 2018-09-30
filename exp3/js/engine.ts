//main game file

//references
/// <reference path = "lib/phaser.d.ts"
module KartiskyGL {
    class KartiskyGL extends Phaser.Game {
        constructor(width?: number, height?: number) {
            super(width, height, Phaser.WEBGL, "game", { preload: this.preload, create: this.create });
        }
        
        preload(){
            
        }
        
        create(){
        
        }
    }
}

