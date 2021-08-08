// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

class Flock {

  constructor(ctx, numBoids, width, height, wrap) {
    // An array for all the boids
    this.boids = []; // Initialize the array
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    // Add an initial set of boids into the system
    for (let i = 0; i < numBoids; i++) {
      const colour = { h: 0, s: 100, l: 50, a: 1 };
      let b = new Boid(this.ctx, this.width / 5, this.height / 7, colour, width, height, wrap);
      this.boids.push(b);
    }
  }

  run() {

    for (let i=0; i<this.boids.length; i++) {
      if (this.boids[i].isCrashed) {
        this.boids.splice(i, 1);
      } else {
        this.boids[i].run(this.boids);
      }
    }
  }
}
