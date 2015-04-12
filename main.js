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
var player;
var background;
var redflash;

var allbullets = [];

var keysdown = {
    shift: false
};

var code = {};

var oktoclose = false;

var projectname = "touhou";





window.onload = function(){

    game = new Game(2048, 1256);
    game.fps = 60;
    game.scale = 0.5;
    game.preload('images/bigbullet.png');
    game.preload('images/leaf.png');
    game.preload('images/player.png');
    game.preload('images/collider.png');
    game.preload('images/forestbg.jpg');
    game.preload('images/redpixel.png');
    // scene;

    game.onload = function()
    {
        scene = new Scene();
        scene.backgroundColor = "#C8F7C5";
        game.pushScene(scene);

        startup();



        background = new Sprite(1920,1080);
        background.image = game.assets['images/forestbg.jpg'];
        background.x = 0;
        background.y = 0;
        background.scaleX = 10;
        background.scaleY = 10;
        background.onenterframe = function()
        {
            this.y --;
        }
        scene.addChild(background);

        redflash = new Sprite(1,1);
        redflash.image = game.assets['images/redpixel.png'];
        redflash.x = 1024;
        redflash.y = 628;
        redflash.scaleX = 2048;
        redflash.scaleY = 1256;
        redflash.opacity = 0;
        redflash.onenterframe = function()
        {
            if(this.opacity > 0)
            {
                this.opacity -= 1/10;
            }
            if(this.opacity < 0)
            {
                this.opacity = 0;
            }
            // background.y --;
        }
        scene.addChild(redflash);

        player = new Player();

        // testbullet = new Bullet("main");

        // refresh();

    };

    Player = Class.create(Sprite, { // declare a custom class called Bear
        initialize:function(){ // initialize the class (constructor)
            Sprite.call(this,64,64); // initialize the sprite
            this.image = game.assets['images/player.png'];
            scene.addChild(this);
            this.moveSpeed = 10;

            this.originX = 0.5;
            this.originY = 0.5;

            this.x = 1024;
            this.y = 1000;


            this.collider = new Sprite(1,1);
            scene.addChild(this.collider);
            this.collider.x = 0;
            this.collider.y = 0;

        },
        onenterframe:function()
        { // enterframe event listener

            if(keysdown.shift)
            {
                this.moveSpeed = 3;
            }
            else
            {
                this.moveSpeed = 10;
            }
            if(game.input.left && !game.input.right)
            {
                this.x -= this.moveSpeed;
            }
            else if(game.input.right && !game.input.left){
                this.x += this.moveSpeed;
            }
            if(game.input.up && !game.input.down){
                this.y -= this.moveSpeed;
            }
            else if(game.input.down && !game.input.up){
                this.y += this.moveSpeed;
            }


            this.collider.x = this.x + 32;
            this.collider.y = this.y + 32;
        }

    });

    Bullet = Class.create(Sprite, { // declare a custom class called Bear
        initialize:function(){ // initialize the class (constructor)
            Sprite.call(this,64,64); // initialize the sprite
            this.image = game.assets['images/bigbullet.png'];
            scene.addChild(this);

            this.scaleX = 1;
            this.scaleY = 1;

            this.hasscript = false;

            this.radius = 20;

            this.x = 1024;
            this.y = 628;

            this.angle = 0;
            this.speed = 1;

            this.flags = {
                "leavescreen": false
            }

            this.scriptname = "regular";
            allbullets.push(this);

            this.haslogged = true;


        },
        onenterframe:function()
        { // enterframe event listener

            var radiancalc = (Math.PI/180);

            var vectorx = Math.cos(this.angle * radiancalc) * this.speed;
            var vectory = Math.sin(this.angle * radiancalc) * this.speed;

            this.x += vectorx;
            this.y += vectory;

            if(this.within(player.collider, this.radius + 10))
            {
                allbullets.splice(allbullets.indexOf(this),1);
                scene.removeChild(this);
                redflash.opacity = 1;
            }

            if(this.flags["leavescreen"] == false && this.hasscript)
            {
                // console.log("safe");
                if(this.x < 0 || this.x > 2048 || this.y < 0 || this.y > 1256)
                {
                    allbullets.splice(allbullets.indexOf(this),1);
                    scene.removeChild(this);
                }
            }

            if(this.x < 0 || this.x > 2048 || this.y < 0 || this.y > 1256)
                {
                    if(this.haslogged)
                    {
                        // console.log(this.flags);
                        this.haslogged = false;
                    }
                }

            this.rotation = this.angle;



            if(this.scaleup)
            {
                this.scaleX = this.scaleupfactor;
                this.scaleY = this.scaleupfactor;
                if(this.scaleupfactor < 1)
                {
                    this.scaleupfactor += 1/60;
                }
            }
            // console.log(vectorx + " " + vectory);
        }
    });

    game.start();
};


function refresh()
{
    background.y = 0;
    for(var i = 0; i < allbullets.length; i++)
    {
        scene.removeChild(allbullets[i]);
    }

    allbullets = [];

    scene.removeChild(boss);
    boss = makeBullet("main");
    // console.log();
    // start();
    $("#enchant-stage").css("display","block");
    $("#enchant-stage").css("position","absolute");
    oktoclose = false;

    // var timer = new Sprite(32,32);
    scene.tl.delay(3).then(function(){
            oktoclose = true;
            // alert("hi");
        });
}


function loopcreation(allines)
{

    allines.splice(0,0,"");

    for(var i = 0; i < allines.length; i++)
    {
        var parts = allines[i].split(" ");
        // console.log(allines[i]);
        if(parts[0] == "loop")
        {
            // alert("loop done");
            var looped = [];
            var endreached = false;
            var counter = i;
            allines.splice(i,1);
            // i--;
            while(endreached == false)
            {
                // console.log(allines[counter]);
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

            // console.log("after splicing" + allines);
            // console.log(looped);
            for(var k = 0; k < parseFloat(parts[1])+1; k++)
            {
                var adjusted = [];
                for(var j = 0; j < looped.length; j++)
                {
                    var theline = looped[j];
                    var adparts = theline.split(" ");

                    var newline = "";


                    for(var m = 0; m < adparts.length; m++)
                    {
                        if(adparts[m][0] != "c")
                        {
                            if(adparts[m].indexOf("+") != -1)
                            {
                                var plussplits = adparts[m].split("+");
                                adparts[m] = parseFloat(plussplits[0]) + parseFloat(plussplits[1]*k);
                            }

                            newline += adparts[m] + " ";

                        }
                        else
                        {
                            if(adparts[m].indexOf("+") != -1)
                            {
                                var plussplits = adparts[m].split("+");
                                adparts[m] = parseFloat(plussplits[0].substring(1,plussplits[0].length)) + parseFloat(plussplits[1]*k);
                                adparts[m] = "c"+adparts[m];
                            }
                            newline += adparts[m] + " ";
                        }
                    }

                    // console.log("newline is" + adparts);



                    // console.log("before " + adparts);
                    var count = 0;
                    for(var m = 0; m < adparts.length; m++)
                    {
                        if(adparts[m] === "")
                        {
                            // m--;
                            adparts.splice(m,1);
                            m--;
                            count++
                        }
                    }
                    // adparts.clean("");
                    // console.log("after " + adparts + " count " + count);

                    // console.log(adparts);

                    if(adparts[0] == "every")
                    {
                        if(k % parseFloat(adparts[1]) == 0)
                        {
                            var noeveryline = "";
                            for(var m = 2; m < adparts.length; m++)
                            {
                                noeveryline += adparts[m] + " ";
                            }
                            adjusted.push(noeveryline);
                            // console.log(noeveryline + " adparts " + adparts);
                        }
                    }
                    else
                    {
                        adjusted.push(newline);
                    }
                }
                // console.log("i is " + i);
                allines.splice.apply(allines,[i, 0].concat(adjusted));
            }
            console.log(allines);

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
                bullet.angle = parseFloat(parts[2]);
            }
            if(parts[1] == "speed")
            {
                bullet.speed = parseFloat(parts[2]);
            }
            if(parts[1] == "x")
            {
                bullet.x = parseFloat(parts[2]);
            }
            if(parts[1] == "y")
            {
                bullet.y = parseFloat(parts[2]);
            }
            if(parts[1] == "scale")
            {
                bullet.scaleY = parseFloat(parts[2]);
                bullet.scaleX = parseFloat(parts[2]);
            }
            if(parts[1] == "radius")
            {
                bullet.radius = parseFloat(parts[2]);
            }
        }
        if(parts[0] == "delay")
        {
            delay = parseFloat(parts[1])+1;
            // console.log(delay);
        }
        if(parts[0] == "add")
        {
            if(parts[1] == "rotation")
            {
                bullet.angle = parseFloat(parts[2]) + parseFloat(bullet.angle);
            }
            if(parts[1] == "speed")
            {
                bullet.speed = parseFloat(parts[2]) + parseFloat(bullet.speed);
                // alert(bullet.speed);
            }
            if(parts[1] == "x")
            {
                bullet.x = parseFloat(parts[2]) + parseFloat(bullet.x);
            }
            if(parts[1] == "y")
            {
                bullet.y = parseFloat(parts[2]) + parseFloat(bullet.y);
            }
        }
        if(parts[0] == "make")
        {
            var newbullet = makeBullet(parts[1]);
            newbullet.x = bullet.x;
            newbullet.y = bullet.y;
            newbullet.speed = parts[2];


            if(parts.length < 4)
            {
                console.log(parts);
            }
            // parts[3].clean("");
            if(parts[3][0] == "c")
            {

                parts[3] = parseFloat(parts[3].substring(1,parts[3].length))+parseFloat(bullet.angle);
                console.log(parts[3] + " " + bullet.angle);

            }
            newbullet.angle = parts[3];
        }
        if(parts[0] == "destroy")
        {
            $.each(allbullets, function(i){
                if(allbullets[i] == bullet) {
                    allbullets.splice(i,1);
                    return false;
                }
            });
            scene.removeChild(bullet);
        }
        if(parts[0] == "clear")
        {
            console.log("*******" + allbullets.length);
            // alert("lel");
            for(var i = 1; i < allbullets.length; i++)
            {
                console.log("*******");
                scene.removeChild(allbullets[i]);
            }

        }
        if(parts[0] == "effect")
        {
            if(parts[1] == "scaleup")
            {
                bullet.scaleup = true;
                bullet.scaleupfactor = 0;
                bullet.scaleX = 0;
                bullet.scaleY = 0;
            }
        }
        if(parts[0] == "sprite")
        {
            bullet.image = game.assets["images/"+parts[1]+".png"];
        }
        if(parts[0] == "flag")
        {
            bullet.flags[parts[1]] = parts[2].bool();
            console.log(bullet.flags);
        }

        bullet.hasscript = true;

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

String.prototype.bool = function() {
    return (/^true$/i).test(this);
};


function startup()
{
    code = JSON.parse(readCookie("code"));
    if(code == null)
    {
        code = {};
    }
    // alert(filename);
    // alert()

    console.log(projectname);
    var data = JSON.parse(readCookie("tree"));
    console.log(readCookie("tree"));

    // if(true)
    // {
        // data = [
        // {
        //     label: 'node1',
        //     children: [
        //         { label: 'chilasdsad1' },
        //         { label: 'child2' }
        //     ]
        // },
        // {
        //     label: 'node2',
        //     children: [
        //         { label: 'child3' }
        //     ]
        // }
        // ];
    // }
    if(data == null)
    {
        data = [{label: 'main'}];
    }

    $(function() {
        $('#tree').tree({
            data: data,
            dragAndDrop: true,
            autoOpen: 0
        });
    });

    // $('#tree').tree('reload');

    $('#tree').tree('loadData', data);

    // var json = $('#tree').tree('toJson');
    // createCookie("tree",json,9999);

    $('#tree').bind(
    'tree.click',
    function(event) {
        // The clicked node is 'event.node'
        var node = event.node;
        load(node.name);
        }
    );

load("main");
    // var newbullet = makeBullet("main");
    // newbullet.x = 1024;
    // newbullet.y = 628;
    // newbullet.speed = 0;
    // newbullet.angle = 0;
}



function save()
{
    var filename = $("#filename").val();
    // conso
    code[filename] = editor.getSession().getDocument().getValue();

    var json = JSON.stringify(code);

    // $("#loading").html("");
    if($("#tree").tree('getNodeById',filename) == null)
    {
        $("#tree").tree(
        'appendNode',
            {
                label: filename,
                id: filename
            }
        );
    }
    createCookie("code",json,9999);

    var json = $('#tree').tree('toJson');
    createCookie("tree",json,9999);
}

function deletething()
{
    var filename = "main";
    // conso
    // code[filename] = editor.getSession().getDocument().getValue();
    console.log(code);
    var deleted = $("#filename").val();
    delete code[deleted];
    console.log(code);

    var json = JSON.stringify(code);

    // $("#loading").html("");

    createCookie("code",json,9999);

    var node = $('#tree').tree('getNodeById', deleted);

    $('#tree').tree('removeNode', node);

    var json = $('#tree').tree('toJson');


    createCookie("tree",json,9999);
}

function newthing()
{
    var filename = $("#filename").val();
    // conso
    code[filename] = "";

    editor.getSession().getDocument().setValue("");

    var json = JSON.stringify(code);

    // $("#loading").html("");
    if($("#tree").tree('getNodeById',filename) == null)
    {
        $("#tree").tree(
        'appendNode',
            {
                label: filename,
                id: filename
            }
        );
    }
    createCookie("code",json,9999);

    var json = $('#tree').tree('toJson');
    createCookie("tree",json,9999);
}

function loadproject()
{
    var filename = $("#projectname").val();
    projectname = filename;

    startup();
}

function load(filename)
{
    editor.$blockScrolling = Infinity
    editor.getSession().getDocument().setValue(code[filename]);
    $("#filename").val(filename);

    $("#title").html("edit/ " + projectname + "/ " + filename);

     // $("#loading").html("");

    // refresh();
}

function createCookie(name,value,days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();

    document.cookie = projectname+name+"="+value+expires+"; path=/";
    // console.log(readCookie(name));
}

function readCookie(name) {
    var nameEQ = projectname+name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(projectname+name,"",-1);
}




$(document).click(function(event) {
    if(!$(event.target).closest('#gameholder').length) {
        if(oktoclose) {
            $("#enchant-stage").css("display","none");
        }
    }
})

window.top.document.onkeydown = function(evt) {
    evt = evt || window.event;
    var keyCode = evt.keyCode;
    if (keyCode >= 37 && keyCode <= 40) {
        return false;
    }
};




$(document).keydown(function (evt) {
    if (evt.which == 16) {
        keysdown.shift = true;
    }
});

$(document).keyup(function (evt) {
    if (evt.which == 16) {
        keysdown.shift = false;
    }
});









