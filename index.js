const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const backgroundImage = new Image();
backgroundImage.src = './game_assets/Map/pokemonLikeMap.png';

const playerImage = new Image();
playerImage.src = './game_assets/Character/walkingDown.png'

//Context recebe 3 argumentos - A imagem que ele irá desenhar e as posicoes X e Y respectivamente.
backgroundImage.onload = () => { 
  context.drawImage(backgroundImage, -300, -1150)
  context.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height,
    playerImage.width / 4,
    playerImage.height,
    )
};






