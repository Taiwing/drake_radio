import { MathUtils } from './vendor/three.js'

/*
** A "visual unit" is 1 in the ThreeJS space coordinates system.
*/
export const VISUAL_UNIT = 10_000               // light years
export const VISUAL_LIGHT_YEAR = 1/VISUAL_UNIT  // ThreeJS distance

// Galactic Rotation
export const ROTATION_PER_SEC = MathUtils.degToRad(10)

// Civilization color
export const CIV_COLOR = 0x66acdc
