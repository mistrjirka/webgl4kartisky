//references
/// <reference path = "engine.ts" />

window.onload = () => {
    var player = {};
    let game = new KartiskyGL(
        "game",
        "auto",
        [
            {
                name: "car",
                URL: "obr/car.png"
            }
        ],
        [
            /*{
                value: player,
                name: "ahoj",
                anchor: [0.2, 0.2]
            }*/
        ]
    );

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
    let exampleMap: IMap_for_rendering = {
        map: [
            [
                {
                    empty: false,
                    card: {
                        sprite: {
                            name: "car",
                            anchor: [0, 0],
                            typeOfScale: "automatic"
                        },
                        statistics: {}
                    }
                },
                {
                    empty: true
                },
                {
                    empty: true
                }
            ],
            [
                {
                    empty: true
                },
                {
                    empty: true
                },
                {
                    empty: false,
                    card: {
                        sprite: {
                            name: "car",
                            anchor: [0.1, 0.1],
                            typeOfScale: "automatic"
                        },
                        statistics: {}
                    }
                }
            ]
        ],
        x: 0,
        y: 0,
        x_size: 100,
        y_size: 100,
        background: {
            anchor: [1, 1],
            autoScale: true,
            x: 0,
            y: 0,
            name: "redBackground"
        },
        id: "map2"
    };
    setTimeout(function() {
        game.load(
            [
                {
                    URL: "obr/background.png",
                    name: "redBackground",
                    type: "image"
                }
            ],
            function() {
                var map = new KartiskyGL.Map(game.game, exampleMap);
                setTimeout(function() {
                    map.addToMap([
                        {
                            sprite: {
                                name: "car",
                                anchor: [0.1, 0.1],
                                typeOfScale: "automatic"
                            },
                            x: 0,
                            y: 1
                        },
                        {
                            sprite: {
                                name: "car",
                                anchor: [0.1, 0.1],
                                typeOfScale: "automatic"
                            },
                            x: 0,
                            y: 2
                        }
                    ]);
                    map.removeFromMap([{ x: 0, y: 0 }]);
                    var cardBox = new KartiskyGL.Cardbox(game.game, {
                        x: 300,
                        y: 400,
                        width: 200,
                        height: 400,
                        anchor: [0, 0],
                        card_size: {
                            width: 100,
                            height: 100
                        },
                        overlapHeight: 2,
                        overlapWidth: 2,
                        background: {
                            anchor: [1, 1],
                            autoScale: true,
                            x: 300,
                            y: 400,
                            name: "redBackground"
                        },
                        numOfCardsX: 2,
                        numOfCardsY: 3
                    });

                    cardBox.addToCardBox({
                        name: "car",
                        anchor: [0, 0],
                        scale: {
                            width: 100,
                            height:100
                        }
                    });
                    cardBox.addToCardBox({
                        name: "car",
                        anchor: [0, 0],
                        scale: {
                            width: 100,
                            height:100
                        }
                    });
                    cardBox.addToCardBox({
                        name: "car",
                        anchor: [0, 0],
                        scale: {
                            width: 100,
                            height:100
                        }
                    });
                    cardBox.addToCardBox({
                        name: "car",
                        anchor: [0, 0],
                        scale: {
                            width: 100,
                            height:100
                        }
                    });
                    cardBox.addToCardBox({
                        name: "car",
                        anchor: [0, 0],
                        scale: {
                            width: 100,
                            height:100
                        }
                    });
                    cardBox.addToCardBox({
                        name: "car",
                        anchor: [0, 0],
                        scale: {
                            width: 100,
                            height:100
                        }
                    });
                }, 2000);
            }
        );
    }, 2000);
};
