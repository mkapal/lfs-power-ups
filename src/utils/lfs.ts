export function lfsAngleToRadians(angle: number) {
  return (((angle * 360) / 256 - 180) * Math.PI) / 180;
}

export function compCarAngleToRadians(angle: number) {
  //direction of forward axis: 0 = world y direction, 32768 = 180 deg anticlockwise from above
  return (angle / 32768) * Math.PI;
}
