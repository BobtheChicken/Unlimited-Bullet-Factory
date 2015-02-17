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

var boss;
var game;
var scene;

var allbullets = [];

var code = {};

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

        startup();

        // testbullet = new Bullet("main");

        // refresh();

    };

    Player = Class.create(Sprite, { // declare a custom class called Bear
        initialize:function(){ // initialize the class (constructor)
            Sprite.call(this,32,32); // initialize the sprite
            this.image = game.assets['images/default.png'];
            scene.addChild(this);
        },
        onenterframe:function()
        { // enterframe event listener
        }
    });

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
            allbullets.push(this);


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
    for(var i = 0; i < allbullets.length; i++)
    {
        scene.removeChild(allbullets[i]);
    }
    scene.removeChild(boss);
    boss = makeBullet("main");
    // console.log();
    // start();
}


function loopcreation(allines)
{
    for(var i = 0; i < allines.length; i++)
    {
        var parts = allines[i].split(" ");
        if(parts[0] == "loop")
        {
            var looped = [];
            var endreached = false;
            var counter = i;
            allines.splice(i,1);
            while(endreached == false && counter < 10)
            {
                if(allines[counter] == "endloop")
                {
                    endreached = true;
                    allines.splice(counter,1);
                }
                else
                {
                    looped.push(allines[counter]);
                    allines.splice(counter,1);
                    counter -= 1;
                }

                counter++;
            }
            // console.log(looped);
            for(var k = 0; k < parts[1]; k++)
            {
                var adjusted = [];
                for(var j = 0; j < looped.length; j++)
                {
                    var theline = looped[j];
                    var adparts = theline.split(" ");

                    var newline = "";


                    for(var m = 0; m < adparts.length; m++)
                    {
                        if(adparts[m].indexOf("+") != -1)
                        {
                            var plussplits = adparts[m].split("+");
                            adparts[m] = parseFloat(plussplits[0]) + parseFloat(plussplits[1]*k);
                        }
                        newline += adparts[m] + " ";
                    }



                    adjusted.push(newline);
                }
                allines.splice.apply(allines,[i, 0].concat(adjusted));
            }
            // console.log(allines);
        }
    }
    return allines;
}



function makeBullet(scriptname)
{
    var bullet = new Bullet();
    var codebase = code[String(scriptname)];
    // console.log(codebase);
    var allines = codebase.split("\n");
    // console.log(allines);

    allines = loopcreation(allines);

    delayedcall(allines,bullet,0);



    return bullet;
}

function delayedcall(allines,bullet,index)
{
    if(index < allines.length)
    {
        var delay = executeline(allines[index],bullet);

        bullet.tl.delay(delay).then(function(){
           // Processing after one second
           // console.log("lel");
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
        if(parts[0] == "make")
        {
            var newbullet = makeBullet(parts[1]);
            newbullet.x = bullet.x;
            newbullet.y = bullet.y;
            newbullet.speed = parts[2];
            newbullet.angle = parts[3];
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


function startup()
{
    code = JSON.parse(readCookie("code"));
    for(var key in code)
    {
        $("#loading").append("<input type='button' id=" + key + " value=" + key+ " onclick=load('" + key + "') />");
    }

    load("main");
}



function save()
{
    var filename = $("#filename").val();
    // conso
    code[filename] = editor.getSession().getDocument().getValue();

    var json = JSON.stringify(code);

    $("#loading").html("");

    for(var key in code)
    {
        $("#loading").append("<input type='button' id=" + key + " value=" + key+ " onclick=load('" + key + "') />");
    }
    createCookie("code",json,7);
}

function load(filename)
{
    editor.getSession().getDocument().setValue(code[filename]);
    $("#filename").val(filename);
    // refresh();
}

function createCookie(name,value,days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();

    document.cookie = name+"="+value+expires+"; path=/";
    // console.log(readCookie(name));
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}




















