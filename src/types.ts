export type Point2D = {
  x: number;
  y: number;
};

export type Point3D = {
  x: number;
  y: number;
  z: number;
};

/** PLID (0-255) */
export type PlayerId = number;

export type WithRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};
