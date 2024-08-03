import { config } from './config.js'

// Galactic specification (shape and size). Distance values are expressed in
// light years (roughly based on the milky way).
export const galaxySpec = {
  // Hardcoded values
  ARM_COUNT: 4,             // Spiraling arms count
  HEIGHT: 5_000,            // Height of the stellar disk
  DIAMETER: 100_000,        // Disk diameter
  CENTER_DIAMETER: 14_000,  // Diameter of the central sphere

  // Computed values
  get RADIUS() { return this.DIAMETER / 2 },                // Disk radius
  get CENTER_RADIUS() { return this.CENTER_DIAMETER / 2 },  // Center radius
  get TOTAL_DIAMETER() {
    // Diameter including star cloud if it is set
    return config['star-cloud'] ? this.DIAMETER * 2 : this.DIAMETER
  },
  get TOTAL_RADIUS() { return this.TOTAL_DIAMETER / 2 },  // Includes star cloud
}
