let myPosition = API.getCurrentPosition(); // { x: number, y: number}
let enemyPosition = API.getEnemies(); // [{position: {x: number, y:number}]
const arenaSize = API.getArenaSize(); // number

let x = myPosition.x;
let y =  myPosition.y;

let lastEnemy = false;
latestPositionX = null;
latestPositionY = null;

calcPlus = (coord, positive) => {
  if (positive) {
    if (coord + 1 < arenaSize) {
      return coord + 1;
    } else if (coord === arenaSize - 1) {
      return calcPlus(coord);
    } else {
      return coord;
    }
  } else {
    if (coord - 1 >= 0) {
      return coord - 1;
    } else if (coord == 0) {
      return calcPlus(0, true);
    }
  }
}

calcAvailableDistance = (myPosition) => {
  return {
    minX: calcPlus(myPosition.x),
    minY: calcPlus(myPosition.y),
    maxX: calcPlus(myPosition.x,  true),
    maxY: calcPlus(myPosition.y, true)
  }
}

isLastEnemy = () => enemyPosition.length === 1;

findDeersInSector = (number, hunt) => {
  let deersInSector = enemyPosition
      .map(enemy => {
        if (Math.abs(myPosition.x - enemy.position.x) <= number && Math.abs(myPosition.y - enemy.position.y) <= number) {
          return enemy.position;
        }
        return false;
      })
      .filter(enemy => !!enemy);
  if (!deersInSector.length) {
    return false;
  }
  return deersInSector
}

rand = () => Math.round(Math.random());

makeRand = (val) => {
  let num = val;
  if (rand() && num + 1 < arenaSize) {
    num = num + 1;
  } else if (num - 1 > 0) {
    num = num - 1;
  } else {
    num = num + 1;
  }
  return num;
}

searchPlace = (hunters, x, y) => {
  return hunters.map((enemy) => {
    let arr = [];
    if (x < enemy.x) {
      arr.push(x -  1 > 0 ? x - 1 : x);
    } else {
      arr.push(x + 1 < arenaSize ? x + 1  : x);
    }
    if (y < enemy.y) {
      arr.push(y - 1 > 0 ? y - 1 : y);
    } else {
      arr.push(y + 1 < arenaSize ? y + 1 : y);
    }
    return arr;
  });
}


createHunterMatrix = (x, y) => {
  let temp = [
    [x - 2, y - 2],
    [x - 1, y - 2],
    [x, y - 2],
    [x + 1, y - 2],
    [x + 2, y - 2],

    [x - 2, y - 1],
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x + 2, y - 1],

    [x - 2, y],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x + 2, y],

    [x - 2, y + 1],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1]
    [x + 2, y + 1],

    [x - 2, y + 2],
    [x - 2, y + 2],
    [x, y + 2],
    [x + 1, y + 2],
    [x + 1, y + 2]
  ]
      .map((coord) => ((coord[0] > 0 && coord[1] > 0 && coord[0] < arenaSize && coord[1] < arenaSize) ? coord : false))
      .filter((coord) => !!coord)
}
//  Матрица возможных движений
createMatrix = (x, y) => {
  let temp = [
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],

      [x - 1, y],
      [x, y],
      [x + 1, y],

      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1]
  ]
      .map((coord) => ((coord[0] > 0 && coord[1] > 0 && coord[0] < arenaSize && coord[1] < arenaSize) ? coord : false))
      .filter((coord) => !!coord)
}

filterMatrix = (matrix, hunters) => {
  let hunterMatrix = hunters.map((hunter) => createHunterMatrix(hunter[0], hunter[1]));
  matrix
      .filter((coord) => {
        let result = true;
        hunterMatrix.forEach((hunter) => {
          hunter.forEach((hunterCoords) => {
            if (hunterCoords[0] == coord[0] && hunterCoords[1] == coord[1]) {
              result = false;
            }
          })
        });
        return result;
      });
  return matrix;
}

// searchPlace = (hunters, x, y) => {
//   // return [
//   //     hunters.map((enemy) => (enemy.x + 2 === x || enemy.x - 2 === x ? x )),
//   //     hunters.map((enemy) => enemy.y)]
//   // ];
// }
makeHunt = () => {
  myPosition = API.getCurrentPosition(); // { x: number, y: number}
  enemyPosition = API.getEnemies(); // [{position: {x: number, y:number}]
  lastEnemy = isLastEnemy();

  x = myPosition.x;
  y =  myPosition.y;

  let sector = calcAvailableDistance(myPosition);
  let deers = findDeersInSector(API.getActionPointsCount() > 2 ? 2 : 1);
  let hunters = findDeersInSector(2);

  if (deers) {
    if (deers.length) {
      x = deers[0].x;
      y = deers[0].y;
    }
  } else if (hunters) {
    if (!lastEnemy) {
      // еще есть
      let lastX  =  x;
      let lastY =  y;
      let matrix = createMatrix(lastX, lastY);
      matrix = filterMatrix(filterMatrix, hunters);
      let randomMatrix = matrix[Math.floor(Math.random()*matrix.length)];
      if (matrix.length > 0) {
        x = randomMatrix[0];
        y = randomMatrix[1];
      } else {
        x  = matrix[0];
        y = matrix[1];
      }
    } else {
      let lastX  =  x;
      let lastY =  y;
      let matrix = createMatrix(lastX, lastY);
      matrix = filterMatrix(filterMatrix, hunters);
      let randomMatrix = matrix[Math.floor(Math.random()*matrix.length)];
      if (matrix.length > 0) {
        // ищем ближайший
        matrix = matrix.sort((a, b) => {
          if (Math.abs(a[0] - lastX) < Math.abs(b[0] - lastX) && Math.abs(a[1] - lastY) < Math.abs(b[1] - lastY)) {
            return -1
          } else {}
            return 1;
        })
        x  = matrix[0];
        y = matrix[1];
      } else {
        x  = matrix[0];
        y = matrix[1];
      }
    }
  } else {
      let lastX  =  x;
      let lastY =  y;
      x = makeRand(x);
      y = makeRand(y);
      while (x === lastX && y === lastY) {
        x = makeRand(x);
        y  = makeRand(y);
      }
  }
  API.move(x, y);
}
makeHunt();
