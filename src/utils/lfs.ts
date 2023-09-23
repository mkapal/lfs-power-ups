export function lfsAngleToRadians(angle: number) {
  return (((angle * 360) / 256 - 180) * Math.PI) / 180;
}
