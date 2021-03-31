import Controller from "../controllers/Controller";
import Square from "../metier/Square";

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Return a new uniq position for a bomb
 * @param bombs {Square[]}
 * @param click {Square}
 * @return {Square}
 */
export function getUniqBomb(bombs, click) {
  const range = click.getSquaresInRange(true);
  let bomb = new Square(
    getRandomInt(Controller.maxLine),
    getRandomInt(Controller.maxColumn)
  );

  while (bomb.isInRange(Controller.bombs) || bomb.isInRange(range)) {
    bomb = new Square(
      getRandomInt(Controller.maxLine),
      getRandomInt(Controller.maxColumn)
    );
  }
  return bomb;
}
