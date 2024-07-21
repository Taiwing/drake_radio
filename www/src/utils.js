export const formatNumber = (value, maxLength, fractionDigits = 2) => {
  const valueStr = value.toString();
  const effectiveLength = valueStr.replace('.', '').length;

  if (effectiveLength > maxLength) {
    return value.toExponential(fractionDigits);
  } else {
    return valueStr;
  }
}
