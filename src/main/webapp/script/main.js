var ZumaSnake = ZumaSnake || {};
var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
ZumaSnake.borderLeft = 20;
ZumaSnake.borderRight = 560;
ZumaSnake.borderTop = 20;
ZumaSnake.borderBottom = 360;

ZumaSnake.maxBallNum = 9;

ZumaSnake.timeOut = 20;
ZumaSnake.timeCounter = 0;
ZumaSnake.timeIncrement = 1;

if(typeof Color == "undefined"){
	var Color = [
		"red",
		"green",
		"blue",
		"purple",
		"orange",
		"black"
	];
}

var getRandom = function(min = ZumaSnake.borderLeft, max = ZumaSnake.borderRight){
	return Math.random() * (max - min) + min;
};

var getRandomColor = function(){
	return Color[Math.floor(getRandom(0, Color.length))];
};

var Snake = function(){
    this.x = 280;
    this.y = 300;
    this.step = 5;
    this.width = 10;
    this.length = 40;
    this.growth = 5;
};

Snake.prototype.getCenterX = function(){
	return this.x + this.width/2;
}

Snake.prototype.moveLeft = function(){
    if(ZumaSnake.borderLeft < this.x){
        this.x -= this.step;
    }
};

Snake.prototype.moveRight = function(){
    if(this.x + this.step < ZumaSnake.borderRight){
        this.x += this.step;
    }
};

Snake.prototype.grow = function(){
	this.y -= this.growth;
    this.length += this.growth;
};

Snake.prototype.draw = function(){
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.length);
}

var Ball = function(){
    this.radius = 5;
    this.x = getRandom();
    this.y = ZumaSnake.borderTop + this.radius;
    this.speed = 2;
    this.color = getRandomColor();
};

Ball.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    ctx.fill();
};

Ball.prototype.isCollided = function(x, y, accuracy = this.radius){
	if(Math.abs(this.x - this.radius/2 - x) < accuracy
		&& Math.abs(this.y - y) < accuracy){
		return true;
	}
	return false;
}

ZumaSnake.keyEventHandler = function(event){
    var keyCode = event.keyCode || event.which;
    if(keyCode === 37){
        snake.moveLeft();
    }
    else if(keyCode === 39){
        snake.moveRight();
    }
};

ZumaSnake.touchEventHandler = function(event){
    var x_touched = event.touches[0].clientX;
    if(x_touched < snake.x){
        snake.moveLeft();
    }
    else{
        snake.moveRight();
    }
};

ZumaSnake.collision = function(){
	balls.forEach(function(item, index, array){
        if(item.isCollided(snake.getCenterX() , snake.y)){
            array.splice(index, 1);
            snake.grow();
        }
    });
};

var snake = new Snake();
var balls = [new Ball()];

var onLoad = function(){
    document.addEventListener("keypress", ZumaSnake.keyEventHandler);
    canvas.addEventListener("touchstart", ZumaSnake.touchEventHandler);
    renderLoop();
};

var drawAll= function(){
    drawBorders();
    snake.draw();
    drawBalls();
};

var drawBalls = function(){
    balls.forEach(function(item){
        item.draw();
    });
};

var generateBall = function(){
    if(balls.length < ZumaSnake.maxBallNum){
        balls.push(new Ball());
    }
};

var setBallsPos = function(){
    balls.forEach(function(item, index, array){
        if(ZumaSnake.borderBottom <= item.y){
            array.splice(index, 1);
        }
        else{
            item.y += item.speed;
        }
    });
};

var drawBorders = function(){
    ctx.strokeRect(ZumaSnake.borderLeft, ZumaSnake.borderTop, ZumaSnake.borderRight - ZumaSnake.borderLeft, ZumaSnake.borderBottom - ZumaSnake.borderTop);
};

var renderLoop = function(){
    //ctx.clearRect(ZumaSnake.borderLeft, ZumaSnake.borderTop, ZumaSnake.borderRight, ZumaSnake.borderBottom);
    //描画削除の裏ワザ
    canvas.width = canvas.width;
    ZumaSnake.timeCounter += ZumaSnake.timeIncrement;
    if(ZumaSnake.timeOut < ZumaSnake.timeCounter){
        ZumaSnake.timeCounter = 0;
        generateBall();
    }
    setBallsPos();
    ZumaSnake.collision();
    drawAll();
    window.requestAnimationFrame(renderLoop);
};

onLoad();