
var snake;
var food;
var keyboard;
let pointer;
let timer;
let timeInt = 0;
let sorceInt = 0;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

// 遊戲開始畫面
const gameStar = {
    key: 'gameStar',
    preload: function () {
        this.load.image('up', 'images/up.png');
        this.load.image('down', 'images/down.png');
        this.load.image('left', 'images/left.png');
        this.load.image('right', 'images/right.png');
        this.load.image('bg', 'images/bg_2.png');
        this.load.image('start', 'images/start_2.png');
        console.log("true");
    },
    create: function () {
        this.up = this.add.image(60, 500, 'up');
        this.down = this.add.image(240, 500, 'down');
        this.left = this.add.image(400, 500, 'left');
        this.right = this.add.image(580, 500, 'right');
        this.bg = this.add.image(340, 240, 'bg')
        this.start = this.add.image(340, 240, 'start')
        this.start.setInteractive();
        this.start.on('pointerdown', () => this.scene.start('gamePlay'));
        console.log("false");
    },
    update: function () {

    }
}
// 遊戲畫面
const gamePlay = {
    key: 'gamePlay',
    preload: function () {
        this.load.image('cat', 'images/cat_2.png');
        this.load.image('love', 'images/love_2.png');
        this.load.image('up', 'images/up.png');
        this.load.image('down', 'images/down.png');
        this.load.image('left', 'images/left.png');
        this.load.image('right', 'images/right.png');
        this.load.image('bg', 'images/bg_2.png');
        this.load.image('over', 'images/over_2.png');
    },
    create: function () {
        this.up = this.add.image(60, 500, 'up');
        this.down = this.add.image(240, 500, 'down');
        this.left = this.add.image(400, 500, 'left');
        this.right = this.add.image(580, 500, 'right');
        this.bg = this.add.image(340, 240, 'bg')

        var Love = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Love(scene, x, y) {
                    Phaser.GameObjects.Image.call(this, scene)

                    this.setTexture('love');
                    this.setPosition(x * 20, y * 20);
                    this.setOrigin(0);

                    this.total = 0;

                    scene.children.add(this);
                },

            eat: function () {
                sorceInt += 100;
                this.total++;

                console.log(this.total);
                console.log(sorceInt);

            }

        });

        var Cat = new Phaser.Class({

            initialize:

                function Cat(scene, x, y) {
                    this.headPosition = new Phaser.Geom.Point(x, y);

                    this.body = scene.add.group();

                    this.head = this.body.create(x * 20, y * 20, 'cat');
                    this.head.setOrigin(0);

                    this.alive = true;

                    this.speed = 100;

                    this.moveTime = 0;

                    this.tail = new Phaser.Geom.Point(x, y);

                    this.heading = RIGHT;
                    this.direction = RIGHT;
                },

            update: function (time) {
                if (time >= this.moveTime) {
                    return this.move(time);
                }
            },

            faceLeft: function () {
                if (this.direction === UP || this.direction === DOWN) {
                    this.heading = LEFT;
                }
            },

            faceRight: function () {
                if (this.direction === UP || this.direction === DOWN) {
                    this.heading = RIGHT;
                }
            },

            faceUp: function () {
                if (this.direction === LEFT || this.direction === RIGHT) {
                    this.heading = UP;
                }
            },

            faceDown: function () {
                if (this.direction === LEFT || this.direction === RIGHT) {
                    this.heading = DOWN;
                }
            },

            move: function (time) {

                switch (this.heading) {
                    case LEFT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 32);
                        break;

                    case RIGHT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 32);
                        break;

                    case UP:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 22);
                        break;

                    case DOWN:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 22);
                        break;
                }

                this.direction = this.heading;


                Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 20, this.headPosition.y * 20, 1, this.tail);



                var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

                if (hitBody) {

                    console.log('dead');

                    this.alive = false;

                    return false;
                }
                else {

                    this.moveTime = time + this.speed;

                    return true;
                }
            },

            grow: function () {
                var newPart = this.body.create(this.tail.x, this.tail.y, 'cat');

                newPart.setOrigin(0);
            },

            collideWithFood: function (food) {
                if (this.head.x === food.x && this.head.y === food.y) {
                    this.grow();

                    food.eat();


                    if (this.speed > 20 && food.total % 5 === 0) {
                        this.speed -= 5;
                    }

                    return true;
                }
                else {
                    return false;
                }
            },

            updateGrid: function (grid) {
                this.body.children.each(function (segment) {

                    var bx = segment.x / 20;
                    var by = segment.y / 20;

                    grid[by][bx] = false;

                });
                return grid;
            }

        });

        food = new Love(this, 3, 4);

        snake = new Cat(this, 8, 8);

        keyboard = this.input.keyboard.createCursorKeys();
        pointer = this.input.activePointer;
        // 計算分數
        this.sorceText = this.add.text(400, 0, `Sorce:${sorceInt}`, { color: '#fff', fontSize: '30px' });
        this.TimeText = this.add.text(60, 0, `Time:${timeInt}`, { color: '#fff', fontSize: '30px' })
        // 計時
        timer = setInterval(() => {
            timeInt++;
            this.TimeText.setText(`Time:${timeInt}`);
        }, 1000);
        
    },
    update: function (time) {
        this.sorceText.setText(`Sorce:${sorceInt}`);
        if (!snake.alive) {
            this.over = this.add.image(340, 240, 'over')
            this.over.setInteractive();
            this.over.on('pointerdown', () => this.scene.start('gamePlay'));
            clearInterval(timer);
            return;
        }
        this.up.setInteractive();
        this.up.on('pointerdown', () => snake.faceUp());
        this.down.setInteractive();
        this.down.on('pointerdown', () => snake.faceDown());
        this.left.setInteractive();
        this.left.on('pointerdown', () => snake.faceLeft());
        this.right.setInteractive();
        this.right.on('pointerdown', () => snake.faceRight());

        if (keyboard.left.isDown) {
            snake.faceLeft();
        }
        else if (keyboard.right.isDown) {
            snake.faceRight();
        }
        else if (keyboard.up.isDown) {
            snake.faceUp();
        }
        else if (keyboard.down.isDown) {
            snake.faceDown();
        }

        if (snake.update(time)) {
            if (snake.collideWithFood(food)) {
                repositionFood();
            }
        }

        function repositionFood() {
            var testGrid = [];
            for (var y = 0; y < 22; y++) {
                testGrid[y] = [];

                for (var x = 0; x < 32; x++) {
                    testGrid[y][x] = true;
                }
            }
            snake.updateGrid(testGrid);
            var validLocations = [];
            for (var y = 0; y < 22; y++) {
                for (var x = 0; x < 32; x++) {
                    if (testGrid[y][x] === true) {
                        validLocations.push({ x: x, y: y });
                    }
                }
            }
            if (validLocations.length > 0) {
                var pos = Phaser.Math.RND.pick(validLocations);
                food.setPosition(pos.x * 20, pos.y * 20);
                return true;
            }
            else {
                return false;
            }
        }
    }
}


var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 540,
    backgroundColor: '#5B5B5B',
    parent: 'phaser',
    scene: [gameStar, gamePlay]
};

var game = new Phaser.Game(config);