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

const battleZonesMap = [];
for (
  let index = 0;
  index < battleZonesData.length;
  index += NUMBER_OF_SQUARES_IN_A_ROW
) {
  battleZonesMap.push(
    battleZonesData.slice(index, NUMBER_OF_SQUARES_IN_A_ROW + index)
  );
}

const boundaries = [];

const battleZones = [];

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

battleZonesMap.forEach((column, yIndex) => {
  column.forEach((currentSQM, xIndex) => {
    if (currentSQM === 1442)
      battleZones.push(
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

const playerUpImage = new Image();
playerUpImage.src = "./game_assets/Character/walkingUp.png";

const playerDownImage = new Image();
playerDownImage.src = "./game_assets/Character/walkingDown.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./game_assets/Character/walkingLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./game_assets/Character/walkingRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 240 / 4 / 2,
    y: canvas.height / 2 - 84,
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },

  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
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

const movables = [background, ...boundaries, ...battleZones];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const battle = {
  initiade: false,
};

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  console.log(animationId);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();

  let moving = true;
  player.moving = false;

  if (battle.initiade) return;

  if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {
    for (let index = 0; index < battleZones.length; index++) {
      const battleZone = battleZones[index];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        console.log("batalha comecou");
        //deactive CURRENT animation loop;
        window.cancelAnimationFrame(animationId);
        battle.initiade = true;
        gsap.to(".overlapping-div", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to(".overlapping-div", {
              opacity: 1,
              duration: 0.4,
            });
            // activate a new animation loop
            animateBattle();
          },
        });
        break;
      }
    }
  }

  function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    console.log("animate battle");
  }

  if (keys.w.pressed && lastKey === "w") {
    player.moving = true;
    player.image = player.sprites.up;

    for (let index = 0; index < boundaries.length; index++) {
      const boundary = boundaries[index];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
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
  } else if (keys.s.pressed && lastKey === "s") {
    player.moving = true;
    player.image = player.sprites.down;

    for (let index = 0; index < boundaries.length; index++) {
      const boundary = boundaries[index];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
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
    player.moving = true;
    player.image = player.sprites.left;

    for (let index = 0; index < boundaries.length; index++) {
      const boundary = boundaries[index];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
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
    player.moving = true;
    player.image = player.sprites.right;

    for (let index = 0; index < boundaries.length; index++) {
      const boundary = boundaries[index];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
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
