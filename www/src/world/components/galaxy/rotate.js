export const rotateY = ({ point, angle }) => {
  const { x, y, z } = point
  return {
    x: x * Math.cos(angle) - z * Math.sin(angle),
    y,
    z: z * Math.cos(angle) + x * Math.sin(angle),
  }
}
