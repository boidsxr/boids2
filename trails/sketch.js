// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment

// Click mouse to add boids into the system

let flock;

let text;

let cosmoDragonColorPalette;

// From https://www.color-hex.com/color-palette/111191

function setup() {
  cosmoDragonColorPalette = [
    color(21,38,124),
    color(67,146,206),
    color(255,148,14),
    color(223,0,146),
    color(122,9,55)
  ];
  createCanvas(1200, 720);
  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 60; i++) {
    const paletteIndex = Math.floor(random(cosmoDragonColorPalette.length));
    const color = cosmoDragonColorPalette[paletteIndex];
    let b = new Boid(width / 2, height / 2, color);
    flock.addBoid(b);
  }
}

function draw() {
  background(51);
  flock.run();
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}
