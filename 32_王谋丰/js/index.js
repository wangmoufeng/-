// 声明定时器
var createBulletTimer;
var moveBulletTimer;
var createEnemyTimer;
var moveEnemyTimer;
var moveBgTimer;


//开始按钮
var action_btn = $(".begin");

//主界面
var main = $(".main");

//游戏场景界面
var game_start =$(".game_start")

//游戏界面尺寸
game_start_width=game_start.width();
game_start_height=game_start.height();

//我方飞机
var player=$(".player");

//我方飞机尺寸
var player_width=player.width();
var player_height=player.height();

//开始游戏
action_btn.click(function(){

    audio.play();
    //隐藏主界面
    main.hide();
    //显示游戏界面
    game_start.show();
    //移动背景
    moveBackground();

    //创建子弹的方法
    createEveryBullet();

    // 移动子弹的方法
    moveEveryBullet();

    // 创建敌机的方法
    drawEveryEnemy();

    // 移动敌机的方法
    moveEveryEnemy();


})

//自定义函数--背景移动
function moveBackground(){
    //每四毫秒移动一次背景
    moveBgTimer = setInterval(function(){
        //获取当前背景位置 （parseInt保留数字部分，去掉单位）
        var bg_postion=parseInt( game_start.css("background-position-y"));
        
        //移动游戏场景的背景
        bg_postion++;

        //背景移动到一定位置，执行下一次背景移动循环
        if(bg_postion >= 740){
            bg_postion = 0;
        }

        //设置给游戏背景
        game_start.css("background-position-y",bg_postion +"px");
    },10)
}

//飞机移动逻辑
//游戏界面_鼠标移动事件
game_start.on("mousemove",function(evt){
    //鼠标在事件源的坐标
    // console.log(evt.offsetX,evt.offsetY);

    //飞机左（left）上（top）角坐标
    let x= evt.offsetX - player_width/2 ;
    let y= evt.offsetY - player_height/2 ;


    //最大left值和最大top值
    let MAX_LEFT = game_start_width - player_width;
    let MAX_TOP = game_start_height - player_height;

    //边界控制
    x = x <= 0 ? 0 : x >= MAX_LEFT ? MAX_LEFT : x;
    y = y <= 0 ? 0 : y >= MAX_TOP ? MAX_TOP : y;


    //移动我方飞机
    player.css({
        //飞机的left和top等于鼠标的坐标
        left: x + "px",
        top:  y +"px",
    })
})



// 敌机的数据
var enemy = [{
    img:"./images/enemy1.png",
    dieImg:"./images/enemy1b.gif",
    width:34,
    height:24,
    blood:1
},{
    img:"./images/enemy2.png",
    dieImg:"./images/enemy2b.gif",
    width:46,
    height:60,
    blood:5
},{
    img:"./images/enemy3.png",
    dieImg:"./images/enemy3b.gif",
    width:110,
    height:164,
    blood:10
}]

// 敌机类
class EnemPlane{
    

    // 构造函数(new对象的时候，constructuor函数会被触发)
    constructor(){

        // 敌机数据
        let emy_data;

        // 生成一个随机数
        let random = Math.random();

        // 小型敌机
        if(random < 0.5){
            emy_data = enemy[0];
        }
        // 中型敌机
        else if(random < 0.9){
            emy_data = enemy[1];
        }
        // 大型敌机
        else{
            emy_data = enemy[2];
        }



        // 用敌机的数据(emy_data)，构造敌机的属性
        // 敌机的宽高
        this.enemyWidth = emy_data.width;
        this.enemyHeight = emy_data.height;

        // 敌机的位置
        this.enemyX = 0;
        this.enemyY = 0;

        // 敌机照片
        this.enemySrc = emy_data.img;
        // 敌机爆炸的照片
        this.enemyDieSrc = emy_data.dieImg;

        // 敌机的血量
        this.enemyBlood = emy_data.blood;

        // 敌机的页面元素
        this.currentEnemy = null;

    }

    // 绘制敌机到页面上
    drawEnemy(){
        // 创建一个敌机的页面元素
        this.currentEnemy = $("<img>");
        
        // 给敌机页面元素插入照片
        this.currentEnemy[0].src = this.enemySrc;

        // 敌机的最大                                                                                边界值
        let enemyMaxLeft = game_start_width - this.enemyWidth;

        // 设置敌机的位置:
        // x坐标在屏幕内随机出现：[0,1]*enemMaxLeft + 1 = [0,enemyMaxLeft + 1) 向下取整 = [0,enemyMaxLeft]
        this.enemyX = Math.floor(Math.random()*(enemyMaxLeft+1));
        // y坐标在屏幕之外 一个敌机高度位置
        this.enemyY = -this.enemyHeight;

        this.currentEnemy.css({
            width:this.enemyWidth,
            height:this.enemyHeight,
            position:"absolute",
            left:this.enemyX + "px",
            top:this.enemyY + "px"
        })

        // 把敌机DOM节点 插入到页面
        game_start.append(this.currentEnemy)


    }

    // 移动敌机的方法 （原型方法）
    moveEnemy(){
        // 让敌机y坐标向下
        this.enemyY++;

        // 如果敌机超出屏幕
        if(this.enemyY > game_start_height){

            this.enemyY = -this.enemyHeight;
        }

        // 设置敌机坐标
        this.currentEnemy.css({
            top:this.enemyY + "px"
        })

        // 敌机的每次移动，都会获取我方飞机坐标
        var playerX = player.position().left;
        var playerY = player.position().top;


        // 四个方向的碰撞检测
        var isLeftCollisionPlayer = this.enemyX + this.enemyWidth >= playerX;
        var isRightCollisionPlayer = this.enemyX <= playerX + player_width; 
        var isTopCollisionPlayter = this.enemyY + this.enemyHeight >= playerY;
        var isBottomCollisionPlayer = this.enemyY <= playerY + player_height;

        // console.log(this.enemyX, this.enemyY,this.enemyWidth,this.enemyHeight,playerX,playerY,player_height,player_width);
        // console.log(isBottomCollisionPlayer,isTopCollisionPlayter);
        if(isBottomCollisionPlayer&&isLeftCollisionPlayer&&isRightCollisionPlayer&&isTopCollisionPlayter){
            // console.log("游戏结束");
            alert("游戏结束")
            


            clearInterval(createBulletTimer);
            clearInterval(moveBulletTimer);
            clearInterval(createEnemyTimer);
            clearInterval(moveEnemyTimer);
            clearInterval(moveBgTimer);

            createBulletTimer = null;
            moveBulletTimer = null;
            createEnemyTimer = null;
            moveEnemyTimer = null;
            moveBgTimer = null;


            player.css("background-image","url(./images/planeb.gif)");

            game_start.off();

            setTimeout(function(){
                history.go(0);
            },1500)

        }
    }
}

// 存储敌机的数组
let enemys = [];

// 绘制敌机的方法
function drawEveryEnemy(){
    createEnemyTimer = setInterval(function(){
        // 创建一个敌机实例对象
        var enemObj = new EnemPlane();

        // 调用绘制敌机的方法
        enemObj.drawEnemy();

        // 把敌机实例堆到数组中
        enemys.push(enemObj);
    },1000)

    
}

// 移动敌机方法
function moveEveryEnemy(){
    // 多次定时器
    moveEnemyTimer = setInterval(function(){
        // 用每一个敌机实例，调用移动的原型
        for(let i = 0;i < enemys.length;i++){
            enemys[i].moveEnemy();
        }
        
    },10);
}



