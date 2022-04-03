const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const NUMBER_OF_SQUARES_IN_A_ROW = 64;

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (
  let index = 0;
  index < collisions.length;
  index += NUMBER_OF_SQUARES_IN_A_ROW
) {
  collisionsMap.push(
    collisions.slice(index, NUMBER_OF_SQUARES_IN_A_ROW + index)
  );
}

class Boundary {
  static width = 64;
  static heigth = 64;

  constructor({ position }) {
    this.position = position;
    this.width = 64;
    this.height = 64;
  }
  draw() {
    context.fillStyle = "rgba(255, 0, 0, 0.2)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];

const offset = {
  x: -1060,
  y: -760,
};

collisionsMap.forEach((column, yIndex) => {
  column.forEach((currentSQM, xIndex) => {
    //The value of a solidBlock in collision.js (data) is equal to 1441
    if (currentSQM === 1441)
      boundaries.push(
        new Boundary({
          position: {
            x: xIndex * Boundary.width + offset.x,
            y: yIndex * Boundary.heigth + offset.y,
          },
        })
      );
  });
});

const backgroundImage = new Image();
backgroundImage.src = "./game_assets/Map/Map.png";

const playerImage = new Image();
playerImage.src = "./game_assets/Character/walkingDown.png";

class Sprite {
  constructor({ position, image, frames = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.frames = frames;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw() {
    context.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
  }
}

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 240 / 4 / 2,
    y: canvas.height / 2 - 84,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: backgroundImage,
});

const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries];

function rectangularCollision({rectangle1, rectangle2}) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach(boundary => {
    boundary.draw();
  });

  player.draw();

  let moving = true;
    
    if (keys.w.pressed && lastKey === "w") {
      for(let index = 0; index < boundaries.length; index ++) {
        const boundary = boundaries[index];
        if ( 
          rectangularCollision({ 
            rectangle1: player, 
            rectangle2: {...boundary, 
              position: {
                x: boundary.position.x,
                y: boundary.position.y + 3,
              }}, 
          })
          ) {
          moving = false;
          break;
        }
      }
      if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    } 
    else if (keys.s.pressed && lastKey === "s") {
        for(let index = 0; index < boundaries.length; index ++) {
          const boundary = boundaries[index];
          if ( 
            rectangularCollision({ 
              rectangle1: player, 
              rectangle2: {...boundary, 
                position: {
                  x: boundary.position.x,
                  y: boundary.position.y - 3,
                }}, 
            })
            ) {
            moving = false;
            break;
          }
        }
        if (moving)
        movables.forEach((movable) => {
        movable.position.y -= 3;
      });
    } else if (keys.a.pressed && lastKey === "a") {
     
        for(let index = 0; index < boundaries.length; index ++) {
          const boundary = boundaries[index];
          if ( 
            rectangularCollision({ 
              rectangle1: player, 
              rectangle2: {...boundary, 
                position: {
                  x: boundary.position.x + 3,
                  y: boundary.position.y,
                }}, 
            })
            ) {
            moving = false;
            break;
          }
        }
        if (moving)
        movables.forEach((movable) => {
        movable.position.x += 3;
      });
    } else if (keys.d.pressed && lastKey === "d") {
        for(let index = 0; index < boundaries.length; index ++) {
          const boundary = boundaries[index];
          if ( 
            rectangularCollision({ 
              rectangle1: player, 
              rectangle2: {...boundary, 
                position: {
                  x: boundary.position.x -3,
                  y: boundary.position.y,
                }}, 
            })
            ) {
            moving = false;
            break;
          }
        }
        if (moving)
        movables.forEach((movable) => {
        movable.position.x -= 3;
      });
    }
}

animate();

let lastKey = "";
window.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
