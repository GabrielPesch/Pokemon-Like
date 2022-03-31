const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const backgroundImage = new Image();
backgroundImage.src = "./game_assets/Map/pokemonLikeMap.png";

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
    x: -300,
    y: -1150,
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
