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
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];
const offset = {
  x: -1060,
  y: -700,
}

collisionsMap.forEach((row, yIndex) => {
  row.forEach((currentSQM, xIndex) => {
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
  constructor({ position, velocity, image }) {
    this.position = position;
    this.image = image;
  }

  draw() {
    context.drawImage(this.image, this.position.x, this.position.y);
  }
}



const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
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

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach(boundarie => {
    boundarie.draw();
  })
  context.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height,
    playerImage.width / 4,
    playerImage.height
  );
  if (keys.w.pressed && lastKey === "w")
    background.position.y = background.position.y += 3;
  else if (keys.s.pressed && lastKey === "s")
    background.position.y = background.position.y -= 3;
  else if (keys.a.pressed && lastKey === "a")
    background.position.x = background.position.x += 3;
  else if (keys.d.pressed && lastKey === "d")
    background.position.x = background.position.x -= 3;
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
