// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment


const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const nbBoids = params.nbBoids || 100 ;
const initialSpeedFactor = params.isf || 0.001;

const featureFadeout = true;
const featureWrap = false;

let flock;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.globalCompositeOperation = 'screen';

ctx.lineWidth = 10;
ctx.lineCap = 'round';


flock = new Flock(ctx, nbBoids, canvas.width, canvas.height, featureWrap, initialSpeedFactor);

function draw() {
  flock.run();
  if (featureFadeout) {
    ctx.fillStyle = 'rgba(1,1,1,0.01)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'darken';

  }
//  setTimeout(()=> window.requestAnimationFrame(draw), 10000);
  window.requestAnimationFrame(draw);
}


//canvas.addEventListener('click', () => {
  window.requestAnimationFrame(draw);
//});


function random(min, max) {
  const range = max-min;
  return Math.random()*range - range/2
}
