// Canvas connection
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// we set the canvas size
canvas.width = 600;
canvas.height = 600;

// fields used in the game
let gameFrame = 0;
let highScore = 0;
let score = 0;
let tempScore = 0;
let spaceshipAlive = false;

//Images
//The Spaceship
// https://opengameart.org/content/space-shooter-assets
const spaceshipPicture = new Image();
spaceshipPicture.src = 'images\spaceship.png';

//The astroids
// https://opengameart.org/content/space-shooter-assets
const astroidPicture = new Image();
astroidPicture.src = 'images\astroid.png';

//Sounds
//The sound of the laser being fired
// https://opengameart.org/content/laser-fire
const laser = new Audio('sounds\laser6.wav');

//The sound of an astroid being destroyd
// https://opengameart.org/content/muffled-distant-explosion
const destroyingAstroid = new Audio('...\sounds\NenadSimic - Muffled Distant Explosion.wav');

//The sound of the Spaceship being destroyed
// https://opengameart.org/content/big-explosion
const spaceshipDestroyed = new Audio('sounds/DeathFlash.flac');

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
class Spaceship {
    constructor() {
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        
        // size of spaceship
        this.radius = 20;

        // direction spaceship is looking
        this.angle = 0;

        this.destroyed = false;

        // the size of the chosen sprite
        this.spriteWidth = 237;
        this.spriteHight = 317;
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

        // gives the angle for the spaceship
        this.angle = Math.atan2(-distanceX, distanceY);
        //i had to set distanceX to minus otherwise the angle was mirrored along the y-axis        
    }

    draw() {
        if (mouse.click) {
            //ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }

        /*
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        */

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(spaceshipPicture, 0, 0, this.spriteWidth, this.spriteHight, 0-19, 0-25, this.spriteWidth/6, this.spriteHight/6);
        ctx.restore();
    }
}

// shot
const shotArray = [];

class Shot {
    constructor() {
        this.x = spaceship.x;
        this.y = spaceship.y;
        this.radius = 5;
        this.speed = 4;
        this.angle = spaceship.angle;
        this.hit = false;
    }

    update() {
        for (let i = 0; i < astroidArray.length; i++) {
            const astroidDistanceX = this.x - astroidArray[i].x;
            const astroidDistanceY = this.y - astroidArray[i].y;
            const astroidDistance = Math.sqrt(astroidDistanceX * astroidDistanceX + astroidDistanceY * astroidDistanceY);
            
            if (astroidDistance < this.radius + astroidArray[i].radius) {
                this.hit = true;
                astroidArray[i].shot = true;
            }
        }
      
        this.y -= Math.cos(-this.angle) * this.speed;
        this.x -= Math.sin(-this.angle) * this.speed;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

// astroid
const astroidArray = [];

class Astroid {
    constructor() {
        this.radius = 50;
        this.speed = Math.random() * 4 + 1;
        this.direction = Math.random() * 2 - 1;
        this.spaceshipDistance;
        this.shot = false;

        this.spriteWidth = 199;
        this.spriteHight = 205;
    }

    update() {
        const spaceshipDistanceX = this.x - spaceship.x;
        const spaceshipDistanceY = this.y - spaceship.y;
        this.spaceshipDistance = Math.sqrt(spaceshipDistanceX * spaceshipDistanceX + spaceshipDistanceY * spaceshipDistanceY);

        this.angle = Math.atan2(this.x, this.y);
    }

    draw() {
        /*
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        */

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(astroidPicture, 0, 0, this.spriteWidth, this.spriteHight, 0-52, 0-50, this.spriteWidth/2, this.spriteHight/2);
        ctx.restore();
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

function gameHandler() {
    if ((spaceshipAlive == false) && (astroidArray.length == 0) && (shotArray.length == 0)) {

        mouse.x = canvas.width/2;
        mouse.y = canvas.height/2;
        mouse.click = false;
        
        spaceship.x = canvas.width/2;
        spaceship.y = canvas.height/2;
        spaceship.angle = 0;
        
        spaceshipAlive = true;
        spaceship.destroyed = false;
        gameFrame = 0;
        score = 0;
        tempScore = 0;
    }
}

function spaceshipHandler() {
    if (spaceshipAlive == true) {
        spaceship.update();
        spaceship.draw();
        
        if (spaceship.destroyed == true) {
            tempScore = score;
            spaceshipDestroyed.play();
            spaceshipAlive = false;
            if (highScore < tempScore) {
                highScore = tempScore;
            }
        }
    } 
}

function handleShot() {
    //spawns shots every amount of time
    if (gameFrame % 20 == 0) {
        shotArray.push(new Shot());
        //larmer alt for meget
        //laser.cloneNode(true).play();
    }

    // updates and draws every shot in the array
    for (let i = 0; i < shotArray.length; i++) {
        shotArray[i].update();
        shotArray[i].draw();

        // if shot has hit it is deleted and if out of bounds
        if (shotArray[i].hit == true) {
            shotArray.splice(i, 1);
            i--;
        } else if ((shotArray[i].x < 0 - (shotArray[i].radius * 2)) || (shotArray[i].x > canvas.width + (shotArray[i].radius*2)) || 
                (shotArray[i].y < 0 - (shotArray[i].radius * 2)) || (shotArray[i].y > canvas.height + (shotArray[i].radius*2))) {
            shotArray.splice(i, 1);
            i--;
        }
    }
}

function handleAstroid() {
    if (gameFrame % 50 == 0) {
        let value = Math.floor(Math.random() * 4);
        
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
    }

    for (let i = 0; i < astroidArray.length; i++) {
        astroidArray[i].update();
        astroidArray[i].draw();

        if (astroidArray[i].spaceshipDistance < spaceship.radius + astroidArray[i].radius) {
            spaceship.destroyed = true;
        }
        // if shot then deletes or if out of bound then delete
        else if (astroidArray[i].shot == true) {
            astroidArray.splice(i, 1);
            destroyingAstroid.cloneNode(true).play();
            score += 10;
            i--;
        } 
        else if (astroidArray[i] instanceof TopAstroid) {
            if (astroidArray[i].y > 700) {
                astroidArray.splice(i, 1);
                i--;
                score++;
            }
        }
        else if (astroidArray[i] instanceof RightAstroid) {
            if (astroidArray[i].x < -100) {
                astroidArray.splice(i, 1);
                i--;
                score++;
            }
        }
        else if (astroidArray[i] instanceof LeftAstroid) {
            if (astroidArray[i].x > 700) {
                astroidArray.splice(i, 1);
                i--;
                score++;
            }
        }
        else if (astroidArray[i] instanceof BottomAstroid) {
            if (astroidArray[i].y < -100) {
                astroidArray.splice(i, 1);
                i--;
                score++;
            }
        }
    }
}

spaceshipAlive = true;
const spaceship = new Spaceship();


// Animation loop
function animate() {
    if (spaceshipAlive == true) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameFrame++;
                
        handleShot();
        handleAstroid();
                
        spaceshipHandler();
                
        ctx.fillStyle = 'white';
        ctx.fillText('High Score: ' + highScore, 10, 30);
        ctx.fillText('Score: ' + score, 10, 50);
                
        requestAnimationFrame(animate);
    }
    else {
        gameHandler();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameFrame = -1;
                
        handleShot();
        handleAstroid();
                
        spaceshipHandler();
                
        ctx.fillStyle = 'white';
        ctx.fillText('High Score: ' + highScore, 10, 30);
        ctx.fillText('Score: ' + tempScore, 10, 50);
                
        requestAnimationFrame(animate);
    }
    
}

animate();