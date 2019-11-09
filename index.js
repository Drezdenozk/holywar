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

findDeersInSector = (number) => {
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
  let deers = findDeersInSector(1);
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
      x = makeRand(x);
      y = makeRand(y);
      while (x === lastX && y === lastY) {
        x = makeRand(x);
        y  = makeRand(y);
      }
    } else {
      let temp  = searchPlace(hunters, x, y)
      x = temp[0];
      y = temp[1];
      // Последний враг
      // попытка найти безопасное место
      // if(latestPositionY === null) {
      //   latestPositionY = enemyPosition[0].position.y;
      //   latestPositionX = enemyPosition[0].position.x;
      //   x = myPosition.x;
      //   y = myPosition.y;
      // } else {
      //   let t1 = makeRand(x);
      //   let t2 = makeRand(y);
      //   x = Math.abs(t1 - myPosition.x) == 1 ? : t1;
      //   y = Math.abs(t2 - myPosition.y) == 1 ? : t2;
      // }
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
