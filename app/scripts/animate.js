/**
 * Created by Dayu.Yue on 3/14/2015.
 */

var self = window;

//(function (self) {
  var canvas,
    context,
    particles = [],
    maxHundredNum = 7,
    text = [],
    nextText = [],
    shape = {},
    FPS = 20,
    type = ['circle', 'ovals', 'drop', 'ribbon'],
    currentNum = 0,//random number [0, 9]
    currentLayout = 0, //decide the colors and the sharp
    step = 0, //switch between when equals 0; and get 3 numbers when equals 1, 2, 3
    word = '马戏团',
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
    canvas.height = 600;
    container.appendChild(canvas);
    context = canvas.getContext('2d');
    createParticles();
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
        x : x,
        y : y,
        hasBorn : hasBorn,
        ease : 0.04 + Math.random() * 0.06,
        bornSpeed : 0.07 + Math.random() * 0.07,
        alpha: 0,
        maxAlpha : 0.7 + Math.random() * 0.4,
        radius : radius,
        maxRadius : 12,
        color : color,
        angle : 0,
        steps : steps
      });
    }
    loop();
  }

  /*
   * Main loop for this program.
   */
  function loop() {
    clear();
    update();
    render();
    requestAnimFrame(loop);
  }

  /*
   * Clear the screen
   */
  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
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
          if (index < 100) {
            shape.x = canvas.width * 0.5 + 1;
            shape.y = 40 + 280 * (index / 100);
          } else {
            shape.x = canvas.width * 0.5 - 1;
            shape.y = 320 - ((index - 100) / 100) * 280;
          }
          break;
        case 2: //number 2
          if (index < 87) {
            var steps = Math.PI * 5 / 4 * index / 87;
            shape.x = canvas.width * 0.5 - 85 * Math.cos(steps);
            shape.y = 113 - 85 * Math.sin(steps);
          } else if (index < 156) {
            shape.x = canvas.width * 0.5 + 60 - 145 * (index - 87) / 69;
            shape.y = 173 + 147 * (index - 87) / 69;
          } else {
            shape.x = canvas.width * 0.5 - 85 + 170 * (index - 156) / 44;
            shape.y = 320;
          }
          break;
        case 3: //number 3
          if (index < 93) {
            var steps = Math.PI * 5 / 4 * index / 93 - Math.PI / 4;
            shape.x = canvas.width * 0.5 + 65 * Math.sin(steps);
            shape.y = 105 - 65 * Math.cos(steps);
          } else {
            var steps = Math.PI * 5 / 4 * (index - 93) / 107;
            shape.x = canvas.width * 0.5 + 75 * Math.sin(steps);
            shape.y = 245 - 75 * Math.cos(steps);
          }
          break;
        case 4: //number 4
          if (index < 76) {
            shape.x = 50 + canvas.width * 0.5;
            shape.y = 280 * index / 76 + 40;
          } else if (index < 127) {
            shape.y = 227 ;
            shape.x = canvas.width * 0.5 - 93 + 186 * (index - 76) / 51;
          } else {
            shape.x = canvas.width * 0.5 + 50 - 143 * (index - 127) / 73;
            shape.y = 40 + 187 * (index - 127) / 73;
          }
          break;
        case 5: //number 5
          if (index < 46) {
            shape.y = 40;
            shape.x = canvas.width * 0.5 - 75 + 150 * index / 46;
          } else if (index < 86) {
            shape.x = canvas.width * 0.5 - 75;
            shape.y = 40 + 100 * (index - 46) / 40;
          } else if (index < 109) {
            shape.y = 140;
            shape.x = canvas.width * 0.5 - 75 + 75 * (index - 86) / 23;
          } else {
            var steps = Math.PI * 19 / 14 * (index - 109) / 91;
            shape.x = canvas.width * 0.5 + 90 * Math.sin(steps);
            shape.y = 230 - 90 * Math.cos(steps);
          }
          break;
        case 6: //number 6
          if (index < 60) {
            var steps = Math.PI * index / 60;
            shape.x = canvas.width * 0.5 + 85 * Math.cos(steps);
            shape.y = 125 - 85 * Math.sin(steps);
          } else if (index < 80) {
            shape.x = canvas.width * 0.5 - 85;
            shape.y = 125 + 110 * (index - 60) / 20;
          } else {
            var steps = Math.PI * 2 * (index - 80) / 120;
            shape.x = canvas.width * 0.5 + 85 * Math.sin(steps);
            shape.y = 235 + 85 * Math.cos(steps);
          }
          break;
        case 7: //number 7
          if (index < 70) {
            shape.y = 40;
            shape.x = canvas.width * 0.5 - 85 + 170 * index / 70;
          } else {
            shape.x = canvas.width * 0.5 + 85 - 100 * (index - 70) / 130;
            shape.y = 40 + 280 * (index - 70) / 130;
          }
          break;
        case 8: //number 8
          if (index < 92) {
            var steps = Math.PI * 2 * index / 92;
            shape.x = canvas.width * 0.5 + 65 * Math.sin(steps);
            shape.y = 105 + 65 * Math.cos(steps);
          } else {
            var steps = Math.PI * 2 * (index - 92) / 108;
            shape.x = canvas.width * 0.5 + 75 * Math.sin(steps);
            shape.y = 245 + 75 * Math.cos(steps);
          }
          break;
        case 9: //number 9
          if (index < 60) {
            var steps = Math.PI * index / 60;
            shape.x = canvas.width * 0.5 + 85 * Math.cos(steps);
            shape.y = 235 + 85 * Math.sin(steps);
          } else if (index < 80) {
            shape.x = canvas.width * 0.5 + 85;
            shape.y = 235 - 110 * (index - 60) / 20;
          } else {
            var steps = Math.PI * 2 * (index - 80) / 120;
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
          steps = Math.PI * 2 * index / limit;
          // First oval
          if (index < [].slice.call(particles, 0, limit).length) {
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
          shape.x = canvas.width * 0.5 + 90 * (1 - Math.sin(index)) * Math.cos(index);
          shape.y = 320 + 140 * (-Math.sin(index) - 1);
          break;
        case 13: //ribbon
          shape.x = canvas.width * 0.5 + 90 * (Math.sin(index)) * Math.cos(index);
          shape.y = 320 + 140 * (-Math.sin(index) - 1);
          break;
        default:
          break;
      }
      particle.x += ((shape.x + Math.cos(particle.angle) * 5) - particle.x) * 0.08;
      particle.y += ((shape.y + Math.sin(particle.angle) * 5) - particle.y) * 0.08;
      particle.angle += 0.08;
    });
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
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });
  }

  /*
   * Random a number between [min, max]
   */
  function randomBetween(min, max) {
    return Math.floor((Math.random() * (max - min + 1) + min));
  }

  /*
   * Request new frame.
   */
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / FPS);
      };
  })();
  window.onload = init;
//})(self);

function onClickBtn() {
  currentLayout ++;
  currentLayout %= 14;
}

