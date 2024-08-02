const compareNumbers = (a, b) => a - b

export const insertSorted = (arr, element, cmp = compareNumbers) => {
  let low = 0
  let high = arr.length

  // Binary search to find the correct insertion point
  while (low < high) {
    let mid = Math.floor((low + high) / 2)
    if (cmp(arr[mid], element) < 0) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  // Insert the element at the correct position
  arr.splice(low, 0, element)
  return arr
}

const removeTrailingZeros = (value) => {
  if (value.includes('.') ) {
    if (value.includes('e')) {
      return value.replace(/0*e/, 'e').replace(/.e/, 'e')
    } else {
      const noZero = value.replace(/0*$/, '')
      return noZero.endsWith('.') ? noZero.slice(0, -1) : noZero
    }
  }
  return value
}

// Detect and cutoff js floting point errors
// eg. 0.10000000000000001 -> 0.1
export const cutoffFloatError = (value, zeroCount = 3) => {
  const split = value.split('.')
  if (split.length !== 2) return value

  let [integer, decimal] = split
  if (decimal.length < zeroCount + 1) return value
  if (decimal.endsWith('0')) return value
  decimal = decimal.slice(0, -1)
  let count = 0
  while (decimal.endsWith('0')) {
    decimal = decimal.slice(0, -1)
    count++
  }
  if (count < zeroCount) return value
  else if (decimal === '') return integer
  else return `${integer}.${decimal}`
}

/**
 * Format a number to a string with a maximum length. First the number is
 * checked for floating point errors (which are cutoff), then it is converted
 * to exponential notation if it is too long. If the number is still too long,
 * it is truncated. If removeTrailing is true, trailing zeros are removed.
 *
 * @param {number} value - The number to format.
 * @param {number} [maxLength=6] - The maximum length of the formatted number.
 * @param {number} [fractionDigits=4] - Max digits after decimal point.
 * @param {boolean} [removeTrailing=false] - Whether to remove trailing zeros.
 * @returns {string} The formatted number.
 */
export const formatNumber = (
  value,
  maxLength = 6,
  fractionDigits = 4,
  removeTrailing = false,
) => {
  const valueStr = cutoffFloatError(value.toString())

  if (valueStr.length > maxLength) {
    if (removeTrailing) {
      const unique = value.toExponential()
      if (unique.length > maxLength) {
        return removeTrailingZeros(value.toExponential(fractionDigits))
      } else {
        return unique
      }
    } else {
      return value.toExponential(fractionDigits)
    }
  } else {
    return valueStr
  }
}

export const capitalize = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}
