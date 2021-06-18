// Canvas connection
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

let gameFrame = 0;
let highScore = 0;
let score = 0;

//Images
//The Spaceship
// https://opengameart.org/content/space-shooter-assets
const starshipPicture = new Image();
starshipPicture.src = 'images\spaceship.png';

//Sounds
//The sound of the laser being fired
// https://opengameart.org/content/laser-fire
const laser = document.createElement('audio');
laser.src = 'sounds\laser6.wav';

//The sound of an astroid being destroyd
// https://opengameart.org/content/muffled-distant-explosion
const destroyingAstroid = document.createElement('audio');
destroyingAstroid.src = 'sounds\NenadSimic - Muffled Distant Explosion.wav';

//The sound of the Spaceship being destroyed
// https://opengameart.org/content/big-explosion
const starshipDestroyed = document.createElement('audio');
starshipDestroyed.src = 'sounds\DeathFlash.flac';



// move to mouse
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}

canvas.addEventListener('mousedown', function(event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
})

canvas.addEventListener('mouseup', function() {
    mouse.click = false;
})

// player
class Starship {
    constructor() {
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        
        // size of starship
        this.radius = 20;

        // direction starship is looking
        this.angle = 0;
        // currently the sarship is a circle but i hope to change it in future

        this.frameX = 0;
        this.frameY = 0;

        this.frame = 0;

        this.spriteWidth = 237;
        this.spriteHight = 317;

        this.colision = false;
        this.starshipDestroyed = 'starshipDestroyed';
    }

    update() {
        const distanceX = this.x - mouse.x;
        const distanceY = this.y - mouse.y;

        if (mouse.x != this.x) {
            this.x -= distanceX/20;
        }

        if (mouse.y != this.y) {
            this.y -= distanceY/20;
        }
    }

    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        
        starshipPicture.onload = function() {
            ctx.drawImage(starshipPicture, 0, 0, this.spriteWidth, this.spriteHight, this.x, this.y, this.spriteWidth, this.spriteHight);
        }
        
    }
}

const starship = new Starship();

// astroid

const astroidArray = [];

class Astroid {
    constructor() {
        this.radius = 50;
        this.speed = Math.random() * 4 + 1;
        this.direction = Math.random() * 2 - 1;
        this.destroyingAstroid = 'destroyingAstroid';
        this.starshipDistance;
        this.shot = false;
        this.color = 'red';
        
    }

    update() {
        const starshipDistanceX = this.x - starship.x;
        const starshipDistanceY = this.y - starship.y;
        this.starshipDistance = Math.sqrt(starshipDistanceX * starshipDistanceY + starshipDistanceY * starshipDistanceY);

        
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

class TopAstroid extends Astroid{
    
    constructor() {
        super();
        this.x = Math.random() * canvas.width;
        this.y = 0 - 100;
    }

    update() {
        super.update();
        this.y += this.speed;
        this.x += this.direction;
    }
}

class LeftAstroid extends Astroid{
    
    constructor() {
        super();
        this.x = 0 - 100;
        this.y = Math.random() * canvas.height;
    }

    update() {
        super.update();
        this.x += this.speed;
        this.y += this.direction;
    }
}

class RightAstroid extends Astroid{
    
    constructor() {
        super();
        this.x = canvas.width + 100;
        this.y = Math.random() * canvas.height;
    }

    update() {
        super.update();
        this.x -= this.speed;
        this.y -= this.direction;
    }
}

class BottomAstroid extends Astroid{
    
    constructor() {
        super();
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
    }

    update() {
        super.update();
        this.y -= this.speed;
        this.x -= this.direction;
    }
}


function handleAstroid() {
    if (gameFrame % 50 == 0) {
        let value = Math.floor(Math.random() * 4);
        
        console.log(value);
        
        if (value == 0) {
            astroidArray.push(new TopAstroid());
        } 
        if (value == 1) {
            astroidArray.push(new RightAstroid());
        }
        if (value == 2) {
            astroidArray.push(new LeftAstroid());
        }
        if (value == 3) {
            astroidArray.push(new BottomAstroid());
        }
    
        console.log(astroidArray.length);
    }

    for (let i = 0; i < astroidArray.length; i++) {
        astroidArray[i].update();
        astroidArray[i].draw();

        
    }

    // i use a second loop so the astroids don't blink when one is deleted
    for (let i = 0; i < astroidArray.length; i++) {

        /*
        // we remove the shot astroid
        if (astroidArray[i].shot == true) {
            astroidArray.splice(i, 1);
        }
        */

        if (astroidArray[i] instanceof TopAstroid) {
            if (astroidArray[i].y > 700) {
                astroidArray.splice(i, 1);
                score++;
            }
        }
        else if (astroidArray[i] instanceof RightAstroid) {
            if (astroidArray[i].x < -100) {
                astroidArray.splice(i, 1);
                score++;
            }
        }
        else if (astroidArray[i] instanceof LeftAstroid) {
            if (astroidArray[i].x > 700) {
                astroidArray.splice(i, 1);
                score++;
            }
        }
        
        else if (astroidArray[i] instanceof BottomAstroid) {
            if (astroidArray[i].y < -100) {
                astroidArray.splice(i, 1);
                score++;
            }
        }

        if (astroidArray[i].starshipDistance < astroidArray[i].radius + starship.radius) {
            astroidArray[i].shot = 'true';
            console.log('collision');
            Starship.colision = true;
        }
    }
}

function handleShot() {

}

// shoot
class Shot {

}

// colision of shot with astroids
// colision af astroid and player

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleAstroid();
    starship.update();
    starship.draw();
    ctx.fillStyle = 'white';
    ctx.fillText('High Score: ' + highScore, 10, 30);
    ctx.fillText('Score: ' + score, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate)
}

animate();