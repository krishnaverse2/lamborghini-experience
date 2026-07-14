export class SpringValue {
  value: number;
  velocity: number;
  target: number;

  private readonly stiffness: number;
  private readonly damping: number;

  constructor(
    initialValue: number,
    stiffness = 105,
    damping = 19,
  ) {
    this.value = initialValue;
    this.velocity = 0;
    this.target = initialValue;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  setTarget(target: number) {
    this.target = target;
  }

  update(delta: number) {
    const safeDelta = Math.min(delta, 1 / 30);

    const displacement = this.value - this.target;
    const springForce = -this.stiffness * displacement;
    const dampingForce = -this.damping * this.velocity;

    this.velocity +=
      (springForce + dampingForce) * safeDelta;

    this.value += this.velocity * safeDelta;

    return this.value;
  }
}