// Canvas connection
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

let gameFrame = 0;

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

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

const starship = new Starship();

// astroid
const astroidArray = [];

class TopAstroid {
    
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = 0 - Math.random() * canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 4 + 1;
        this.distance;
    }

    update() {
        this.y += this.speed;
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

class LeftAstroid {
    
    constructor() {
        this.x = 0 - Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 4 + 1;
        this.distance;
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

class RightAstroid {
    
    constructor() {
        this.x = canvas.width + Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 4 + 1;
        this.distance;
    }

    update() {
        this.x -= this.speed;
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

class BottomAstroid {
    
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 4 + 1;
        this.distance;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
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
}

// shoot
class Shot {

}

// colision of shot with astroids
// colision af astroid and player
// score

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleAstroid();
    starship.update();
    starship.draw();
    gameFrame++;
    requestAnimationFrame(animate)
}

animate();