function initCanvas(){
    var ctx = document.getElementById('escenarioNave').getContext("2d");
    var fondoImagen = new Image();
    var naveImagen = new Image();
    var enemigoPic1 = new Image();
    var enemigoPic2 = new Image();

    fondoImagen.src = "imagenes/background-pic.jpg";
    naveImagen.src = "imagenes/spaceship-pic.png";
    enemigoPic1.src = "imagenes/enemigo1.png";
    enemigoPic2.src = "imagenes/enemigo2.png";

    var cW = ctx.canvas.width;
    var cH = ctx.canvas.height;

    var enemyTemplate = function(option){
        return {
            id: option.id || '',
            x: option.x || '',
            y: option.y || '',
            w: option.w || '',
            h: option.h || '',
            image : option.image || enemigoPic1
        }
    }


    var enemigos = [
        new enemyTemplate({id: "enemy1", x: 100, y: -20, w: 50, h: 30 }),
        new enemyTemplate({id: "enemy2", x: 225, y: -20, w: 50, h: 30 }),
        new enemyTemplate({id: "enemy3", x: 350, y: -20, w: 80, h: 30 }),
        new enemyTemplate({id: "enemy4", x:100,  y:-70,  w:80,  h: 30}),
        new enemyTemplate({id: "enemy5", x:225,  y:-70,  w:50,  h: 30}),
        new enemyTemplate({id: "enemy6", x:350,  y:-70,  w:50,  h: 30}),
        new enemyTemplate({id: "enemy7", x:475,  y:-70,  w:50,  h: 30}),
        new enemyTemplate({id: "enemy8", x:600,  y:-70,  w:80,  h: 30}),
        new enemyTemplate({id: "enemy9", x:475,  y:-20,  w:50,  h: 30}),
        new enemyTemplate({id: "enemy10",x: 600, y: -20, w: 50, h: 30}),

        // Segundo grupo de enemigos
        new enemyTemplate({ id: "enemy11", x: 100, y: -220, w: 50, h: 30, image: enemigoPic2 }),
        new enemyTemplate({ id: "enemy12", x: 225, y: -220, w: 50, h: 30, image: enemigoPic2 }),
        new enemyTemplate({ id: "enemy13", x: 350, y: -220, w: 80, h: 50, image: enemigoPic2 }),
        new enemyTemplate({ id: "enemy14", x: 100, y: -270, w: 80, h: 50, image: enemigoPic2 }),
        new enemyTemplate({ id: "enemy15", x: 225, y: -270, w: 50, h: 30, image: enemigoPic2 }),
        new enemyTemplate({ id: "enemy16", x: 350, y: -270, w: 50, h: 30, image: enemigoPic2 }),
        new enemyTemplate({ id: "enemy17", x: 475, y: -270, w: 50, h: 30, image: enemigoPic2 }),
        new enemyTemplate({ id: "enemy18", x: 600, y: -270, w: 80, h: 50, image: enemigoPic2 }),
        new enemyTemplate({ id: "enemy19", x: 475, y: -200, w: 50, h: 30, image: enemigoPic2 }),
        new enemyTemplate({ id: "enemy20", x: 600, y: -200, w: 50, h: 30, image: enemigoPic2 })

    ];

    var mostrarEnemigos = function(enemyList){
        for(var i =0; i < enemyList.length; i++){
           var enemy = enemyList[i];
           ctx.drawImage(enemy.image, enemy.x, enemy.y += .5, enemy.w, enemy.h);
           Launcher.hitDetectLowerlevel(enemy);
        }
    }

    function Launcher(){
        this.y = 500
        this.x = cW*.5 - 25,
        this.w = 100,
        this.h = 100,
        this.direccion,
        this.bg = "white",
        this.misiles = [];

        this.gameStatus = {
            over: false,
            message: "",
            fillStyle: 'red',
            font: 'italic bold 36px Arial, sans-serif'
        }

        this.render = function(){
            if(this.direccion === "left"){
                this.x -= 5;
            }
            else if(this.direccion === "right"){
                this.x += 5;
            }
            else if(this.direccion === "downArrow"){
                this.y += 5;
            }
            else if(this.direccion === "upArrow"){
                this.y -= 5;
            }
            
            ctx.fillStyle = this.bg
            ctx.drawImage(fondoImagen, 10, 10);
            ctx.drawImage(naveImagen, this.x, this.y, 100, 90);

            for(var i = 0; i < this.misiles.length; i++){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y -= 5, m.w, m.h);
                this.detectorGolpe(m, i);
                if(m.y <= 0){ 
                this.misiles.splice(i, 1);
                }
            }

            if(enemigos.length === 0){
                clearInterval(animateInterval);
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.font;
                ctx.fillText('You Win!', cW* .5 - 80, 50);
            }
        }

        this.detectorGolpe = function(m, mi){
            for(var i = 0;  i < enemigos.length; i++){
               var e = enemigos[i];
               if(m.x+m.w >= e.x && 
                m.x <= e.x+e.w && 
                m.y >= e.y && 
                m.y <= e.y+e.h){
                    this.misiles.splice(this.misiles[mi],1);
                    enemigos.splice(i, 1);
                    document.querySelector('.barra').innerHTML = "Destroyed " + e.id;
               }
            }
        }

        this.hitDetectLowerlevel = function(enemy){
            if(enemy.y > 550){
                this.gameStatus.over = true;
                this.gameStatus.message = 'you are losing'
            }
            if((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
            (enemy.x < this.x + 45 && enemy.x > this.x - 45)){
                this.gameStatus.over = true;
                this.gameStatus.message = 'You Died!'
            }

            if(this.gameStatus.over === true){
                clearInterval(animateInterval);
                ctx.fillStyle = this.gameStatus.fillStyle
                ctx.font = this.gameStatus.font;

                ctx.fillText(this.gameStatus.message,  cW*.5 - 10, 50);
            }
        }

    }

    var Launcher = new Launcher();

    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        Launcher.render();
        mostrarEnemigos(enemigos);
    }

    var animateInterval = setInterval(animate, 6);

    var left_btn = document.getElementById("left_btn");
    var right_btn = document.getElementById("right_btn");
    var fire_btn = document.getElementById("fire_btn");


    document.addEventListener("keydown", function(event){
        if(event.keyCode === 37){
            Launcher.direccion = "left";
            if(Launcher.x < cW*.2-130){
                Launcher.x += 0;
                Launcher.direccion = '';
            }
        }
    });
        document.addEventListener("keyup", function(event){
        if(event.keyCode === 37){
            Launcher.x += 0;
            Launcher.direccion = '';
        }
    });
    document.addEventListener("keydown", function(event){
        if(event.keyCode === 39){
            Launcher.direccion = "right";
            if(Launcher.x > cW-110){
                Launcher.x -= 0;
                Launcher.direccion = '';
            }
        }
    });
        document.addEventListener("keyup", function(event){
        if(event.keyCode === 39){
            Launcher.x -= 0;
            Launcher.direccion = '';
        }
    });
    document.addEventListener("keydown", function(event){
        if(event.keyCode === 38){
            Launcher.direccion = "upArrow";
            if(Launcher.y < cH*.2 - 80){
                Launcher.y += 0;
                Launcher.direccion = '';
            }
        }
    });
        document.addEventListener("keyup", function(event){
        if(event.keyCode === 38){
            Launcher.y -= 0;
            Launcher.direccion = '';
            }
        });
    document.addEventListener("keydown", function(event){
        if(event.keyCode === 40){
            Launcher.direccion = "downArrow";
            if(Launcher.y > cH - 110){
                Launcher.y -= 0;
                Launcher.direccion = '';
             }
        }
    });
        document.addEventListener("keyup", function(event){
            if(event.keyCode === 40){
                Launcher.y += 0;
                Launcher.direccion = '';
                }
            });
     document.addEventListener("keydown", function(event){
        if(event.keyCode === 80){
            this.location.reload();
        }
    });

    left_btn.addEventListener('mousedown', function(event){
        Launcher.direccion = 'left';
    });
    left_btn.addEventListener('mouseup', function(event){
        Launcher.direccion = '';
    });
    right_btn.addEventListener('mousedown', function(event){
        Launcher.direccion = 'right';
    });
    right_btn.addEventListener('mouseup', function(event){
        Launcher.direccion = '';
    });
    fire_btn.addEventListener('mousedown', function(event){
        Launcher.misiles.push({
        x: Launcher.x + Launcher.w * .5,
        y: Launcher.y,
        w: 3,
        h: 10
        });
    });

    document.addEventListener('keydown', function(event){
        if(event.keyCode === 32){
            Launcher.misiles.push({
                x: Launcher.x + Launcher.w * .5,
                y: Launcher.y,
                w: 3,
                h: 10
            });
        }
     });
}

window.addEventListener('load', function(event){
   initCanvas();
});