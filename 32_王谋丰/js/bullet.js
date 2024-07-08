//子弹类
class Bullet{

    //子弹的尺寸
    bulletWidth=6;
    bulletHeight=14;

    //子弹的位移位置
    bulletX = 0;
    bulletY = 0;

    //子弹的图片
    bulletSrc="./images/v2-16f7bca2ef9ca5492cbc63badaffd94c_r.jpg"

    //子弹的页面元素
    currentBullet = null;

    //把子弹绘制到页面上
    drawBullet= function(){
        //创建一个子弹的页面元素
        this.currentBullet = $("<img>");

        //给子弹页面元素 插入子弹图片
        this.currentBullet[0].src = this.bulletSrc;

        //设置子弹位置
        this.bulletX= player.position().left + player_width/2 - this.bulletWidth/2;
        this.bulletY= player.position().top - this.bulletHeight;

        //给子弹页面元素 设置子弹的尺寸和位置
        this.currentBullet.css({
            width:this.bulletWidth,
            height:this.bulletHeight,
            position:"absolute",
            left: this.bulletX+"px",
            top: this.bulletY+"px",
        })

        //把子弹页面元素 插入到游戏场景中
        game_start.append(this.currentBullet);
    }

    //移动子弹的方法
    moveBullet = function(idx){   //idx是移动子弹的下标
        //this哪一个子弹调用了这个方法 this就志向哪一个子弹
        //用这个子弹对象的位移的y坐标 进行移动
        this.bulletY--;



        // 如果子弹超出屏幕之外，删除子弹
        if(this.bulletY < -this.bulletHeight){

            // 子弹对象没有被删除,移除子弹节点
            this.currentBullet.remove();


            // 在数组中删除当当前子弹
            bullets.splice(idx,1);

        }


        //子弹页面节点（img）更新样式
        this.currentBullet.css("top",this.bulletY-- + "px");
    }

    //检测子弹碰撞的方法
    HitEnemy(idx){
        // this指向当前子弹

        // 遍历敌机数组
        for(let i =0;i<enemys.length;i++){

            // 四个方向检测
            var isLeftCollision = this.bulletX + this.bulletWidth >= enemys[i].enemyX;
            var isRightCollision = this.bulletX <= enemys[i].enemyX + enemys[i].enemyWidth;
            var isTopCollision = this.bulletY + this.bulletHeight >= enemys[i].enemyY;
            var isBottomCollision = this.bulletY <= enemys[i].enemyY + enemys[i].enemyHeight;

            // 如果四个条件成立,击中敌机
            if(isBottomCollision&&isLeftCollision&&isRightCollision&&isTopCollision){

                // console.log("被击中");
                
                // 移除子弹节点
                this.currentBullet.remove();

                // 移除子弹对象
                bullets.splice(idx,1);

                // 敌机血量减少1
                enemys[i].enemyBlood--;

                // 敌机血量移除敌机
                if(enemys[i].enemyBlood == 0){
                    // 创建敌机·爆炸图片
                    var boonEnemy = $("<img>");

                    boonEnemy[0].src = enemys[i].enemyDieSrc;

                    boonEnemy.css({
                        width:enemys[i].enemyWidth + "px",
                        height:enemys[i].enemyHeight + "px",
                        left:enemys[i].enemyX + "px",
                        top:enemys[i].enemyY + "px",
                        position:"absolute"
                    })

                    game_start.append(boonEnemy);

                    enemys[i].currentEnemy.remove();

                    enemys.splice(i,1);


                    setTimeout(function(){
                        boonEnemy.remove();
                    },600)
                }
            }
        }


    }
}


//创建子弹对象数组。数组中的每一个就是一个子弹对象
let bullets= [];

//创建每一个子弹 的方法
function createEveryBullet(){
    //定时器 200毫秒一颗子弹
    createBulletTimer = setInterval(function(){

    //调用子弹类 创建子弹实例
    let bullet = new Bullet();

    //用实例对象 调用 绘制子弹到页面上 的方法
    bullet.drawBullet();

    //把每个实例存入对象数组中
    bullets.push(bullet);


  },200)
}



// 移动每一颗子弹的方法
function moveEveryBullet(){
    
    moveBulletTimer = setInterval(function(){
    // console.log(bullets)//子弹数组对象
    
    //遍历子弹数组中的每一个子弹对象
    for(let i=0;i< bullets.length;i++){
        //计每一个子弹对象 调用 移动子弹的原型方法（每一颗子弹都要移动）
        bullets[i].moveBullet(i);  //移动子弹 超出屏幕之外的会被移除

        // 被移除的子弹数组长度不够，子弹数组长度不够的会导致下标越界，下标越界为undefined, undefined调用HitEnemy()会报错
        if(bullets[i]){
            // 哪颗子弹移动，就用哪颗子弹碰撞检测
            bullets[i].HitEnemy(i);
        }



    }
    },4) 

}