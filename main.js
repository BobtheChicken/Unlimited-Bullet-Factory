/**
 * enchant();
 * Preparation for using enchant.js.
 * (Exporting enchant.js class to global namespace.
 *  ex. enchant.Sprite -> Sprite etc..)
 *
 * enchant.js を使う前に必要な処理。
 * (enchant.js 本体や、読み込んだプラグインの中で定義されている enchant.Foo, enchant.Plugin.Bar などのクラスを、
 *  それぞれグローバルの Foo, Bar にエクスポートする。)
 */
enchant();

var testbullet;
var game;
var scene;

var code;

window.onload = function(){

    game = new Game(1024, 1024);
    game.fps = 30;
    game.scale = 0.5;
    game.preload('images/default.png');
    // scene;

    game.onload = function()
    {
        scene = new Scene();
        scene.backgroundColor = "#C8F7C5";
        game.pushScene(scene);

        testbullet = new Bullet();

        refresh();

    };

    Bullet = Class.create(Sprite, { // declare a custom class called Bear
        initialize:function(){ // initialize the class (constructor)
            Sprite.call(this,32,32); // initialize the sprite
            this.image = game.assets['images/default.png'];
            scene.addChild(this);

            this.scaleX = 1;
            this.scaleY = 1;

            this.x = 512;
            this.y = 512;

            this.angle = 0;
            this.speed = 1;

            this.scriptname = "regular";
        },
        onenterframe:function()
        { // enterframe event listener

            var radiancalc = (Math.PI/180);

            var vectorx = Math.cos(this.angle * radiancalc) * this.speed;
            var vectory = Math.sin(this.angle * radiancalc) * this.speed;

            this.x += vectorx;
            this.y += vectory;
            // console.log(vectorx + " " + vectory);
        }
    });

    game.start();
};


function refresh()
{
    scene.removeChild(testbullet);
    testbullet = new Bullet();
    // console.log();
    start();
}

function start()
{

    var bullet = testbullet;

    var allines = editor.getSession().getDocument().getAllLines();

    delayedcall(allines,bullet,0);
}

function delayedcall(allines,bullet,index)
{
    if(index < allines.length)
    {
        var delay = executeline(allines[index],bullet);

        scene.tl.delay(delay).then(function(){
           // Processing after one second
           console.log("lel");
           delayedcall(allines,bullet,index+1)
       });
    }
}


function executeline(line,bullet)
{
    // var line = allines[i];
        var parts = line.split(" ");
        parts.clean("");

        var delay = 0;
        // console.log(parts);
        if(parts[0] == "set")
        {
            if(parts[1] == "rotation")
            {
                bullet.angle = parts[2];
            }
            if(parts[1] == "speed")
            {
                bullet.speed = parts[2];
            }
            if(parts[1] == "x")
            {
                bullet.x = parts[2];
            }
            if(parts[1] == "y")
            {
                bullet.y = parts[2];
            }
        }
        if(parts[0] == "delay")
        {
            delay = parts[1];
        }
        if(parts[0] == "add")
        {
            if(parts[1] == "rotation")
            {
                bullet.angle += parts[2];
            }
            if(parts[1] == "speed")
            {
                bullet.speed += parts[2];
            }
            if(parts[1] == "x")
            {
                bullet.x += parts[2];
            }
            if(parts[1] == "y")
            {
                bullet.y += parts[2];
            }
        }

        return delay;
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};



function save()
{
    code = editor.getSession().getDocument().getValue();
    console.log("value is " + code);
}

function load()
{
    console.log(code);
    editor.getSession().getDocument().setValue(code);
}






















