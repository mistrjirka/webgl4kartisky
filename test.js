loader = new Phaser.Loader(game) loader.image('someimage', '//url/to/image') loader.atlasJSONHash('anotherAtlas', '//url/to/texture', '//url/to/atlas') loader.onLoadComplete.addOnce(onLoaded) loader.start() onLoaded = function () {
    console.log('everything is loaded and ready to be used')
}
