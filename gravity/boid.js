// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

cssString = colour => `hsla(${colour.h}, ${colour.s}%, ${colour.l}%, ${colour.a})`;


const cohesionNeighborDist = 50; //00;
const alignNeighborDist = 50; //00;
const desiredSeparation = 10; // 25;
const borderTolerance = 1;
const maxspeed = 10;


class Boid {
  constructor(ctx, x, y, colour, width, height, wrap) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.colour = colour;

    this.acceleration = new Vector2d(0, 0);
    this.centre = new Vector2d(this.width/2, this.height/2);

    this.position = new Vector2d(Math.random()*width, Math.random()*height)

    this.velocity = new Vector2d(
      this.centre.y - this.position.y,
      this.centre.x - this.position.x
    );//.setMag(10+10*Math.random());

    this.previousPosition = this.position.copy();
//    this.colour = '#f09a0f';

    this.maxforce = 0.05; // Maximum steering force
    this.wrap = wrap;
  }

  run(boids) {
    this.flock(boids);
    this.applyForce(this.gravity());
    this.update();
    this.render();
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  flock(boids) {
    let sep = this.separate(boids); // Separation
    let ali = this.align(boids); // Alignment
    let coh = this.cohesion(boids); // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);

  // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(maxspeed);
    this.previousPosition = this.position;
    this.position = this.position.copy().add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);

    if (this.position.dist(this.centre) <50) {
      this.isCrashed = true;
    }
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    let desired = target.copy().sub(this.position); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(maxspeed);
    // Steering = Desired minus Velocity
    let steer = desired.copy().sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }

  render() {

    // todo: trace to previous position
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = cssString(this.colour);
    this.colour.h = (this.colour.h + 1) % 360;

    this.ctx.beginPath();
    this.ctx.moveTo(this.previousPosition.x, this.previousPosition.y);
    this.ctx.lineTo(this.position.x, this.position.y);
    this.ctx.stroke();
  }


  // Separation
  // Method checks for nearby boids and steers away
  separate(boids) {
    let steer = new Vector2d(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {
      let d = this.position.dist(boids[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredSeparation)) {
        // Calculate vector pointing away from neighbor
        let diff = this.position.copy().sub(boids[i].position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }


  gravity() {
    const r2 =
          (this.position.x - this.centre.x)*(this.position.x - this.centre.x) +
          (this.position.y - this.centre.y)*(this.position.y - this.centre.y);
    const G = 10;
    const m1m2 = 0.000000001;
    const direction = new Vector2d(
      this.width/2 - this.position.x,
      this.height/2 - this.position.y
    );
    return direction.mult(r2*G*m1m2);

  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align(boids) {
    let sum = new Vector2d(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = this.position.dist(boids[i].position);
      if ((d > 0) && (d < alignNeighborDist)) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(maxspeed);
      let steer = sum.copy().sub(this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return new Vector2d(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohesion(boids) {
    let sum = new Vector2d(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = this.position.dist(boids[i].position);
      if ((d > 0) && (d < cohesionNeighborDist)) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards the location
    } else {
      return new Vector2d(0, 0);
    }
  }
}
