export default class SpringValue {
  value: number;
  velocity: number;
  target: number;

  stiffness: number;
  damping: number;

  constructor(
    initialValue: number,
    stiffness = 105,
    damping = 18,
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

  setValue(value: number) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
  }

  update(delta: number) {
    const safeDelta = Math.min(delta, 1 / 30);

    const displacement =
      this.value - this.target;

    const springForce =
      -this.stiffness * displacement;

    const dampingForce =
      -this.damping * this.velocity;

    const acceleration =
      springForce + dampingForce;

    this.velocity +=
      acceleration * safeDelta;

    this.value +=
      this.velocity * safeDelta;

    return this.value;
  }
}