export const randomFloat = (min, max) => {
  return Math.random() * max + min
}

const _2PI = Math.PI * 2

export function randomNormal(mean, stddev) {
  if (randomNormal.z1 !== undefined) {
    const result = randomNormal.z1 * stddev + mean
    randomNormal.z1 = undefined
    return result
  }

  const u1 = Math.random()
  const u2 = Math.random()

  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(_2PI * u2)
  randomNormal.z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(_2PI * u2)

  return z0 * stddev + mean
}
