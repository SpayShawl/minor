import seedrandom from "seedrandom";
import Controller from "../controllers/Controller";
import Square from "../metier/Square";

/**
 * Return a random int between 0 ans max
 * It can use a seed to control the randomizer
 */
export function getRandomInt(max:number, seed?:number):number {
  if(seed){
    const parsedSeed = seed.toString(36).toUpperCase();
    seedrandom(parsedSeed, { global: true });
  }

  return Math.floor(Math.random() * Math.floor(max));
}


export function getRandomColor():string{
  const colors = ["#58DBC9", "#58DB7E", "#A1DB58", "#DBD758", "#DB9258", "#db5858", "#B158DB", "#DB58C9"];

  return colors[getRandomInt(8)];
}

/**
 * Return a new uniq position for a bomb
 * The position can't be the same as the clicked one
 */
export function getUniqBomb(click:Square, seed:number):Square {
  const range = click.getSquaresInRange(true);
  let bomb = new Square(
    getRandomInt(Controller.maxLine, seed),
    getRandomInt(Controller.maxColumn, seed + 1)
  );

  while (bomb.isInRange(Controller.bombs) || bomb.isInRange(range)) {
    bomb = new Square(
      getRandomInt(Controller.maxLine),
      getRandomInt(Controller.maxColumn)
    );
  }

  return bomb;
}

export function getRandomSeed(click: Square):string{
  let seed:string;
  const random:number = getRandomInt(2176782200);

  seed = random.toString(36).toUpperCase();
  seed += `${parseInt(click.line.toString(), 10).toString(36).toUpperCase()}`;
  seed += `${parseInt(click.column.toString(), 10).toString(36).toUpperCase()}`;

  return seed;
}

export function getClickbySeed(seed: string):Square{
  const clickSeed = seed.substr(6);
  return new Square(
    parseInt(clickSeed.charAt(0), 36),
    parseInt(clickSeed.charAt(1), 36)
  )
}

export function playSound(sound:HTMLAudioElement, volume:number = 1, cancelIfPlaying:boolean = true, onFinish?:any){
  sound.volume = volume;
  if(cancelIfPlaying){
    sound.pause();
    sound.currentTime = 0;
  }
  sound.play();
  
  if(onFinish){
    sound.addEventListener("ended", onFinish);
  }
}

export function getEncryptions(value:string):string[]{
  switch(value){
    case 'FACILIS':
      return ["FACILE"];
    case 'MODUS':
      return ["MOYEN"];
    case 'ECDURUS':
      return ["DIFFICILE"];
    case 'INCREDIBILIS':
      return ["EXTREME"];
    case 'SPECUS':
      return [`BOMBES : ${Controller.bombs.length}`];
    case 'GRATIAS':
      return ["MERCI D'AVOIR JOUÉ !"];
    case 'TE':
      return ["TU ES VICTORIEUX !"];
    case 'easy':
      return ["FACILIS"];
    case 'medium':
      return ["MODUS"];
    case 'hard':
      return ["ECDURUS"];
    case 'incredible':
      return ["INCREDIBILIS"];
    case 'BOMBES':
      return [`SPECUS : ${Controller.bombs.length}`];
    case 'MERCI':
      return ["GRATIAS LUDENS !"];
    case 'TU':
      return ["TE PRAEPOSSUM !"];
  }
}

export function playRandomMusic(){
  let isOncePlaying = false;
  
  document.querySelectorAll('audio').forEach(a => isOncePlaying = isOncePlaying ? isOncePlaying : !a.paused);

  !isOncePlaying && playSound(
    document.querySelector(`#music${getRandomInt(3)}`), 1, false,
    () => {playRandomMusic()});
}
