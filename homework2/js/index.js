var sw = 20,    //一个方块的宽
    sh = 20,    //方块的高
    tr = 30,    //行数
    td = 30;    //列数

var snake = null,   //蛇的实例
    food = null,    //奖杯的实例
    game = null;    //游戏的实例

//方块构造函数
function Square(x,y,classname){
    //0,0   0,0
    //20,0  1,0
    //40,0  2,0
    this.x = x * sw;
    this.y = y * sh;
    this.class = classname;

    this.viewContent = document.createElement('div');   //方块对应的DOM元素
    this.viewContent.className = this.class; 
    this.parent = document.getElementById('snakeWrap'); //方块的父集
}

Square.prototype.create = function(){   //创建方块DOM，并添加到页面里
    this.viewContent.style.position = 'absolute';
    this.viewContent.style.width = sw + 'px';
    this.viewContent.style.height = sh + 'px';
    this.viewContent.style.left = this.x + 'px';
    this.viewContent.style.top = this.y + 'px';

    this.parent.appendChild(this.viewContent);
};

Square.prototype.remove = function(){
    this.parent.removeChild(this.viewContent);
};

//蛇
function Snake(){
    this.head = null;   //存一下蛇头的信息
    this.tail = null;   //存蛇尾信息
    this.pos = [];     //存蛇身上每个方块的位置，二维数组

    this.directionNum = { //存储蛇走的方向，用个对象来表示
        left:{
            x : -1,
            y : 0,
            rotate:180      //蛇头旋转,顺为正
        },
        right:{
            x : 1,
            y : 0,
            rotate:0
        },
        up:{
            x : 0,
            y : -1,
            rotate:-90 
        },
        down:{
            x : 0,
            y : 1,
            rotate:90
        }
    }
}
Snake.prototype.init = function(){
    //创建蛇头
    var snakeHead = new Square(2,0,'snakeHead');
    snakeHead.create();
    this.head = snakeHead;  //存储蛇头信息
    this.pos.push([2,0]);   //把蛇头的位置存起来

    //创建蛇身体1
    var snakeBody1 = new Square(1,0,'snakeBody');
    snakeBody1.create();
    this.pos.push([1,0]);   //把第一节身体位置存起来

    //创建蛇身体2
    var snakeBody2 = new Square(0,0,'snakeBody');
    snakeBody2.create();
    this.tail = snakeBody2;     //把蛇尾的信息存起来
    this.pos.push([0,0]);   //把第二节身体位置存起来

    //形成链表关系
    snakeHead.last = null;
    snakeHead.next = snakeBody1;

    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;

    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;

    //给蛇添加一条属性，用来表示蛇走的方向
    this.direction = this.directionNum.right;   //默认让蛇往右走
};

//这个方法用来获取蛇头的下一个位置对应的元素，要根据元素做不同的事情
Snake.prototype.getNextPos = function(){
    var nextPos = [ //蛇头要走的下一个点的坐标
        this.head.x/sw + this.direction.x,
        this.head.y/sh + this.direction.y
    ]

    //下个点是自己，撞到了自己，游戏结束
    var selfCollied = false;    //是否撞到自己
    this.pos.forEach(function(value){
        if(value[0] == nextPos[0] && value[1] == nextPos[1]){
            //数组中两个数据都相等，说明下一个点在蛇身体里
            selfCollied = true;
        }
    });
    if(selfCollied){
        console.log('撞到自己了！');

        this.strategies.die.call(this);

        return;
    }

    //下个点是墙，游戏结束
    if(nextPos[0]<0 || nextPos[1]<0 || nextPos[0]>td-1 || nextPos[1]>tr-1){
        console.log('撞墙了！');

        this.strategies.die.call(this);

        return;
    }

    //下个点是奖杯，吃
    if(food && food.pos[0] == nextPos[0] && food.pos[1] == nextPos[1]){
        console.log('撞到奖杯了');
        this.strategies.eat.call(this);
        return;
    }
    

    //下个点什么都不熟，走
    this.strategies.move.call(this);
};

//处理碰撞后要做的事
Snake.prototype.strategies = {
    move:function(format){  //这个参数决定是否删除最后一个方块,当传了这个参数后，表示做的事情是吃
        //创建一个新的身体（在旧蛇头的位置）
        var newBody = new Square(this.head.x/sw,this.head.y/sh,'snakeBody');
        //更新链表的关系
        newBody.next = this.head.next;
        newBody.next.last = newBody;
        newBody.next = null;

        this.head.remove();     //把旧的蛇头从原来的位置删除
        newBody.create();

        //创建一个新蛇头(下一个点)
        var newHead = new Square(this.head.x/sw + this.direction.x,this.head.y/sh + this.direction.y,'snakeHead');
        //更新链表关系
        newHead.next = newBody;
        newHead.last = null;
        newBody.last = newHead;
        newHead.viewContent.style.transform = 'rotate('+this.direction.rotate+'deg)';
        newHead.create();

        //蛇身上每个坐标也要更新(用splice()在最前面插入一个)
        this.pos.splice(0,0,[this.head.x/sw + this.direction.x,this.head.y/sh + this.direction.y]);
        this.head = newHead;    //更新this.head


        if(!format){    //format的值为false,表示需要删除(除了吃之外) 
            this.tail.remove();
            this.tail = this.tail.last;

            this.pos.pop();     //删除最后一个数据用pop
        }

    },
    eat:function(){
        this.strategies.move.call(this,true);
        createfood();
        game.score++;
    },
    die:function(){
        //console.log('die');
        game.over();
    }
}
snake = new Snake();



//创建奖杯
function createfood(){
    //奖杯的随机坐标
    var x = null;
    var y = null;

    var include = true;     //循环跳出的条件，true表示生成的坐标在蛇身上，继续循环，false不在蛇身上，不循环
    while(include){
        x = Math.round(Math.random()*(td-1));
        y = Math.round(Math.random()*(tr-1));

        snake.pos.forEach(function(value){
            if(x != value[0] && y != value[1]){
                //条件成立说明随机点不在蛇身上
                include = false;
            }
        });
    }

    //生成奖杯
    food = new Square(x,y,'food');
    food.pos = [x,y];   //存储奖杯坐标，用于与蛇头下一个点对比
    var foodDom = document.querySelector('.food');
    if(foodDom){
        foodDom.style.left = x*sw +'px';
        foodDom.style.top = y*sh +'px';
    }else{
        food.create();
    }
}



//创建游戏逻辑
function Game(){
    this.timer = null;  
    this.score = 0;
}
Game.prototype.init = function(){
    snake.init();
    //snake.getNextPos();
    createfood();

    document.onkeydown = function(ev){
        if(ev.which == 37 && snake.direction != snake.directionNum.right){      //37为左键
            snake.direction = snake.directionNum.left;
        }else if(ev.which == 38 && snake.direction != snake.directionNum.down){ //38上键
            snake.direction = snake.directionNum.up;
        }else if(ev.which == 39 && snake.direction != snake.directionNum.left){ //39右键
            snake.direction = snake.directionNum.right;     
        }else if(ev.which == 40 && snake.direction != snake.directionNum.up){ //40下键
            snake.direction = snake.directionNum.down;
        }
    }

    this.start();
}
Game.prototype.start = function(){      //开始游戏
    this.timer = setInterval(function(){
        snake.getNextPos();
    },200);
}
Game.prototype.pause = function(){
    clearInterval(this.timer);
}
Game.prototype.over = function(){
    clearInterval(this.timer);
    alert('你的得分：'+ this.score);

    //游戏回到初始
    var snakeWrap = document.getElementById('snakeWrap');
    snakeWrap.innerHTML = '';

    snake = new Snake();
    game = new Game();

    var startBtnWrap = document.querySelector('.startBtn');
    startBtnWrap.style.display = 'block';


}

//开始游戏
game = new Game();
var startBtn = document.querySelector('.startBtn button');
startBtn.onclick = function(){
    startBtn.parentNode.style.display = 'none';
    game.init();
};

//暂停
var snakeWrap = document.getElementById('snakeWrap');
var pauseBtn = document.querySelector('.pauseBtn button');
snakeWrap.onclick = function(){
    game.pause();

    pauseBtn.parentNode.style.display = 'block';
}

pauseBtn.onclick = function(){
    game.start();
    pauseBtn.parentNode.style.display = 'none';
}



