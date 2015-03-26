/**
 * Created by Dayu.Yue on 3/14/2015.
 */

var self = window;

var canvas,
  context,
  particles = [],
  reOrder = [],
  maxHundredNum = 7,
  text = [[], [], []],
  nextText = [[], [], []],
  shape = {},
  FPS = 60,
  type = ['circle', 'ovals', 'drop', 'ribbon'],
  currentNum = 0,//random number [0, 9]
  currentLayout = 9, //decide the colors and the sharp
  statusStep = 0, //switch between when equals 0; and get 3 numbers when equals 1, 2, 3
  isShowPic = 0,
  word = ['码', '戏', '团'],
  colors = [
    ['#e67e22', '#2c3e50'],
    ['#c0392b', '#ff7e15'],
    ['#1d75cf', '#3a5945'],
    ['#702744', '#f98d00'],
    ['#e67e22', '#2c3e50'],
    ['#c0392b', '#ff7e15'],
    ['#1d75cf', '#3a5945'],
    ['#702744', '#f98d00'],
    ['#e67e22', '#2c3e50'],
    ['#c0392b', '#ff7e15'],
    ['#e67e22', '#2c3e50'],
    ['#c0392b', '#ff7e15'],
    ['#1d75cf', '#3a5945'],
    ['#702744', '#f98d00']
  ];

/*
 * Init the envirment
 */
function init() {
  var container = document.querySelector('.ip-slideshow');
  canvas = document.createElement('canvas');
  canvas.width = innerWidth;
  canvas.height = 700;
  container.appendChild(canvas);
  context = canvas.getContext('2d');
  randomOrder();
  createParticles();
  showPic();
}

/*
 * Create particles
 */
function createParticles() {
  for (var quantity = 0, len = 200; quantity < len; quantity++) {
    var x, y, steps = Math.PI * 2 * quantity / len;
    x = canvas.width * 0.5 + 10 * Math.cos(steps);
    y = 180 + 10 * Math.sin(steps);
    var radius = randomBetween(0, 12);
    var hasBorn = !(radius > 0 || radius < 12);
    var color = colors[10][Math.floor(Math.random() * colors[10].length)];
    particles.push({
      x: x,
      y: y,
      hasBorn: hasBorn,
      ease: 0.04 + Math.random() * 0.06,
      bornSpeed: 0.07 + Math.random() * 0.07,
      alpha: 0,
      maxAlpha: 0.7 + Math.random() * 0.4,
      radius: radius,
      maxRadius: 12,
      color: color,
      angle: 0,
      steps: steps
    });
  }
  for (var i = 0; i < 3; i++) {
    updateText(i, word[i], 200);
  }
  loop();
}

/*
 * Change word
 * @param index, word
 */
function changeWord(index, str, fontPx) {
  nextText[index] = [];
  updateText(index, str, fontPx);
}

/*
 * Create text particles
 * @param index, seed
 */
function createTextParticles(index, seed) {
  for (var quantity = 0, len = seed; quantity < len; quantity++) {
    var radius = randomBetween(0, 12);
    var hasBorn = !(radius > 0 || radius < 12);
    var color = "#FFFFFF";
    text[index].push({
      x: canvas.width * 0.5 + (index - 1) * 250,
      y: canvas.height - 100,
      hasBorn: hasBorn,
      ease: 0.04 + Math.random() * 0.06,
      bornSpeed: 0.07 + Math.random() * 0.07,
      alpha: 0,
      maxAlpha: 0.7 + Math.random() * 0.4,
      radius: radius,
      maxRadius: 12,
      color: color,
      interactive: false
    });
  }
}

/*
 * Update the current text to a new one
 * @param index, str
 * index = 0, 1, 2  str is the word want to show
 */
function updateText(index, str, fontPx) {
  clearWord(index);
  context.font = fontPx + 'px Lato, Arial, sans-serif';
  context.fillStyle = 'rgb(255, 255, 255)';
  context.textAlign = 'center';
  var strip = str.toUpperCase().split('').join(String.fromCharCode(8202));
  context.fillText(strip, canvas.width * 0.5 + (index - 1) * 250, canvas.height - 50);
  var surface = context.getImageData(canvas.width * 0.5 + (index - 1) * 250 - 125, canvas.height - 250, 250, 250);
  for (var width = 0; width < surface.width; width += 8) {
    for (var height = 0; height < surface.height; height += 4) {
      var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];
      // The pixel color is white? So draw on it...
      if (color === 255) {
        nextText[index].push({
          x: width + canvas.width * 0.5 + (index - 1) * 250 - 125,
          y: height + canvas.height - 250,
          orbit: randomBetween(1, 3),
          angle: 0
        });
      }
    }
  }
  clearWord(index);
  var seed = nextText[index].length;
  // Recreate text particles, based on this seed
  createTextParticles(index, seed);
}

/*
 * Main loop for this program.
 */
function loop() {
  clear();
  update();
  render();
  setTimeout(loop, 1000 / FPS);
}

/*
 * Clear the screen
 */
function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearWord(index) {
  context.clearRect(canvas.width * 0.5 + (index - 1) * 240 - 130, canvas.height - 250, 250, 250);
}

/*
 * Update transition.
 */
function updataTransition() {
  [].forEach.call(particles, function (particle, index) {
    switch (currentLayout) {
      case 0: //number 0
        shape.x = canvas.width * 0.5 + 85 * Math.cos(particle.steps);
        shape.y = 180 + 140 * Math.sin(particle.steps);
        break;
      case 1: //number 1
        if (reOrder[index] < 100) {
          shape.x = canvas.width * 0.5 + 1;
          shape.y = 40 + 280 * (reOrder[index] / 100);
        } else {
          shape.x = canvas.width * 0.5 - 1;
          shape.y = 320 - ((reOrder[index] - 100) / 100) * 280;
        }
        break;
      case 2: //number 2
        if (reOrder[index] < 87) {
          var steps = Math.PI * 5 / 4 * reOrder[index] / 87;
          shape.x = canvas.width * 0.5 - 85 * Math.cos(steps);
          shape.y = 113 - 85 * Math.sin(steps);
        } else if (reOrder[index] < 156) {
          shape.x = canvas.width * 0.5 + 60 - 145 * (reOrder[index] - 87) / 69;
          shape.y = 173 + 147 * (reOrder[index] - 87) / 69;
        } else {
          shape.x = canvas.width * 0.5 - 85 + 170 * (reOrder[index] - 156) / 44;
          shape.y = 320;
        }
        break;
      case 3: //number 3
        if (reOrder[index] < 93) {
          var steps = Math.PI * 5 / 4 * reOrder[index] / 93 - Math.PI / 4;
          shape.x = canvas.width * 0.5 + 65 * Math.sin(steps);
          shape.y = 105 - 65 * Math.cos(steps);
        } else {
          var steps = Math.PI * 5 / 4 * (reOrder[index] - 93) / 107;
          shape.x = canvas.width * 0.5 + 75 * Math.sin(steps);
          shape.y = 245 - 75 * Math.cos(steps);
        }
        break;
      case 4: //number 4
        if (reOrder[index] < 76) {
          shape.x = 50 + canvas.width * 0.5;
          shape.y = 280 * reOrder[index] / 76 + 40;
        } else if (reOrder[index] < 127) {
          shape.y = 227;
          shape.x = canvas.width * 0.5 - 93 + 186 * (reOrder[index] - 76) / 51;
        } else {
          shape.x = canvas.width * 0.5 + 50 - 143 * (reOrder[index] - 127) / 73;
          shape.y = 40 + 187 * (reOrder[index] - 127) / 73;
        }
        break;
      case 5: //number 5
        if (reOrder[index] < 46) {
          shape.y = 40;
          shape.x = canvas.width * 0.5 - 75 + 150 * reOrder[index] / 46;
        } else if (reOrder[index] < 86) {
          shape.x = canvas.width * 0.5 - 75;
          shape.y = 40 + 100 * (reOrder[index] - 46) / 40;
        } else if (reOrder[index] < 109) {
          shape.y = 140;
          shape.x = canvas.width * 0.5 - 75 + 75 * (reOrder[index] - 86) / 23;
        } else {
          var steps = Math.PI * 19 / 14 * (reOrder[index] - 109) / 91;
          shape.x = canvas.width * 0.5 + 90 * Math.sin(steps);
          shape.y = 230 - 90 * Math.cos(steps);
        }
        break;
      case 6: //number 6
        if (reOrder[index] < 60) {
          var steps = Math.PI * reOrder[index] / 60;
          shape.x = canvas.width * 0.5 + 85 * Math.cos(steps);
          shape.y = 125 - 85 * Math.sin(steps);
        } else if (reOrder[index] < 80) {
          shape.x = canvas.width * 0.5 - 85;
          shape.y = 125 + 110 * (reOrder[index] - 60) / 20;
        } else {
          var steps = Math.PI * 2 * (reOrder[index] - 80) / 120;
          shape.x = canvas.width * 0.5 + 85 * Math.sin(steps);
          shape.y = 235 + 85 * Math.cos(steps);
        }
        break;
      case 7: //number 7
        if (reOrder[index] < 70) {
          shape.y = 40;
          shape.x = canvas.width * 0.5 - 85 + 170 * reOrder[index] / 70;
        } else {
          shape.x = canvas.width * 0.5 + 85 - 100 * (reOrder[index] - 70) / 130;
          shape.y = 40 + 280 * (reOrder[index] - 70) / 130;
        }
        break;
      case 8: //number 8
        if (reOrder[index] < 92) {
          var steps = Math.PI * 2 * reOrder[index] / 92;
          shape.x = canvas.width * 0.5 + 65 * Math.sin(steps);
          shape.y = 105 + 65 * Math.cos(steps);
        } else {
          var steps = Math.PI * 2 * (reOrder[index] - 92) / 108;
          shape.x = canvas.width * 0.5 + 75 * Math.sin(steps);
          shape.y = 245 + 75 * Math.cos(steps);
        }
        break;
      case 9: //number 9
        if (reOrder[index] < 60) {
          var steps = Math.PI * reOrder[index] / 60;
          shape.x = canvas.width * 0.5 + 85 * Math.cos(steps);
          shape.y = 235 + 85 * Math.sin(steps);
        } else if (reOrder[index] < 80) {
          shape.x = canvas.width * 0.5 + 85;
          shape.y = 235 - 110 * (reOrder[index] - 60) / 20;
        } else {
          var steps = Math.PI * 2 * (reOrder[index] - 80) / 120;
          shape.x = canvas.width * 0.5 + 85 * Math.sin(steps);
          shape.y = 125 + 85 * Math.cos(steps);
        }
        break;
      case 10: //circle
        shape.x = canvas.width * 0.5 + 140 * Math.sin(particle.steps);
        shape.y = 180 + 140 * Math.cos(particle.steps);
        break;
      case 11: //ovals
        var limit, steps;
        limit = (particles.length * 0.5) - 1;
        steps = Math.PI * 2 * reOrder[index] / limit;
        // First oval
        if (reOrder[index] < [].slice.call(particles, 0, limit).length) {
          shape.x = canvas.width * 0.5 + 80 * Math.cos(steps);
          shape.y = 180 + 140 * Math.sin(steps);
        }
        // Second oval
        else {
          limit = (particles.length * 0.5);
          shape.x = canvas.width * 0.5 + 140 * Math.cos(steps);
          shape.y = 180 + 80 * Math.sin(steps);
        }
        break;
      case 12: //drop
        shape.x = canvas.width * 0.5 + 90 * (1 - Math.sin(reOrder[index])) * Math.cos(reOrder[index]);
        shape.y = 320 + 140 * (-Math.sin(reOrder[index]) - 1);
        break;
      case 13: //ribbon
        shape.x = canvas.width * 0.5 + 90 * (Math.sin(reOrder[index])) * Math.cos(reOrder[index]);
        shape.y = 320 + 140 * (-Math.sin(reOrder[index]) - 1);
        break;
      default:
        break;
    }
    particle.x += ((shape.x + Math.cos(particle.angle) * 5) - particle.x) * 0.08;
    particle.y += ((shape.y + Math.sin(particle.angle) * 5) - particle.y) * 0.08;
    particle.angle += 0.08;
  });
  /* --- Text --- */
  for (var i = 0; i < 3; i++) {
    [].forEach.call(nextText[i], function (particle, index) {
      text[i][index].x += ((particle.x + Math.cos(particle.angle + index) * particle.orbit) - text[i][index].x) * 0.1;
      text[i][index].y += ((particle.y + Math.sin(particle.angle + index) * particle.orbit) - text[i][index].y) * 0.1;
      particle.angle += 0.08;
    });
    if (nextText[i].length < text[i].length) {
      var extra = [].slice.call(text[i], nextText[i].length, text[i].length);
      // Remove extra text particles
      for (var index = 0; index < extra.length; index++)
        text[i].splice(index, 1);
    }
  }
}

/*
 * Update the particles
 */
function update() {
  updataTransition();
  [].forEach.call(particles, function (particle, index) {
    particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;
    if (particle.hasBorn) {
      particle.radius += (0 - particle.radius) * particle.bornSpeed;
      if (Math.round(particle.radius) === 0) {
        particle.color = colors[currentLayout][Math.floor(Math.random() * colors[currentLayout].length)];
        particle.hasBorn = false;
      }
    } else {
      particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;
      if (Math.round(particle.radius) === particle.maxRadius)
        particle.hasBorn = true;
    }
  });
  for (var i = 0; i < 3; i++) {
    [].forEach.call(text[i], function (particle, index) {
      particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;
      if (particle.hasBorn) {
        particle.radius += (0 - particle.radius) * particle.bornSpeed;
        if (Math.round(particle.radius) === 0)
          particle.hasBorn = false;
      }
      if (!particle.hasBorn) {
        particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;
        if (Math.round(particle.radius) === particle.maxRadius)
          particle.hasBorn = true;
      }
    });
  }
}

/*
 * Render the particles.
 */
function render() {
  [].forEach.call(particles, function (particle, index) {
    context.save();
    context.globalAlpha = particle.alpha;
    context.fillStyle = particle.color;
    context.beginPath();
    context.arc(particle.x, particle.y + 50, particle.radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
  for (var i = 0; i < 3; i++) {
    [].forEach.call(text[i], function (particle, index) {
      context.save();
      context.globalAlpha = particle.alpha;
      context.fillStyle = 'rgb(255, 255, 255)';
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });
  }
}

/*
 * Random a number between [min, max]
 */
function randomBetween(min, max) {
  return Math.floor((Math.random() * (max - min + 1) + min));
}

/*
 * Random to get reOrder array
 */
function randomOrder() {
  var index = 0;
  for (var i = 0; i < 200; i++) {
    reOrder[i] = i;
  }
  for (var i = 200; i > 0; i--) {
    index = randomBetween(0, i);
    var temp = reOrder[index];
    reOrder[index] = reOrder[i - 1];
    reOrder[i - 1] = temp;
  }
}

/*
 * There's 4 situations in the process.
 * 0 Main window shows the pic whose index is 10, 11, 12, 13. The word is "码戏团".Can go to situation 1.
 * 1 Main window shows random numbers for few seconds. In the end, 1st word became the number. Can go to situation 2.
 * 2 See above. Can go to situation 3.
 * 3 See above. Back to situation 0.
 * Use statusStep to control.
 */

function showPic() {
  if (statusStep == 0 || isShowPic == 1) {
    //randomOrder();
    currentLayout++;
    if (currentLayout < 10) {
      currentLayout = 10;
    }
    if (currentLayout >= 14) {
      currentLayout = 10;
    }
    setTimeout(showPic, 2000);
  }
}

function showNum(index, times) {
  if (statusStep != 0 && isShowPic == 0) {
    currentNum = (statusStep == 1) ? (randomBetween(0, maxHundredNum)) : (randomBetween(0, 9));
    randomOrder();
    currentLayout = currentNum;
    console.log(index.toString() + " " + times.toString());
    if (times >= 1) {
      setTimeout(function() {
        showNum(index, times - 1);
      }, max(1000 - times * 100, 100));
    } else {
      setTimeout(function() {
        changeWord(index, currentNum.toString(), 225);
        isShowPic = 1;
        showPic();
      }, 1300);
    }
  }
}

function max(num1, num2) {
  return (num1 > num2) ? num1 : num2;
}

function randomNum(index) {
  isShowPic = 0;
  showNum(index, 5);
}

function onClickBtn() {
  statusStep = 1;
  randomNum(0);
}

function onClickNumBtn() {
  changeWord(0, currentNum.toString(), 225);
  //changeWord(1, currentNum.toString(), 225);
  //changeWord(2, currentNum.toString(), 225);
  currentNum++;
  currentNum %= 10;
}

window.onload = init;
