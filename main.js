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

window.onload = function(){

    var game = new Game(1024, 1024);
    game.scale = 0.5;
    game.preload('images/default.png');
    var scene;

    game.onload = function()
    {
        scene = new Scene();
        scene.backgroundColor = "#C8F7C5";
        game.pushScene(scene);

        var bullet = new Bullet();

    };

    Bullet = Class.create(Sprite, { // declare a custom class called Bear
        initialize:function(){ // initialize the class (constructor)
            Sprite.call(this,32,32); // initialize the sprite
            this.image = game.assets['images/default.png'];
            scene.addChild(this);

            this.scaleX = 1;
            this.scaleY = 1;

            this.angle = 0;
            this.speed = 0;

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
    // console.log();
    start();
}

function start()
{
    var allines = editor.getSession().getDocument().getAllLines();
    for(var i = 0; i < allines.length; i++)
    {
        var line = allines[i];
        var parts = line.split(" ");
        parts.clean("");
        console.log(parts);
    }
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


























