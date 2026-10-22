export function modulo(model, variable, divisor, remainder) {
  if (
    !Number.isSafeInteger(divisor) ||
    divisor <= 0 ||
    !Number.isInteger(remainder) ||
    remainder < 0 ||
    remainder >= divisor
  )
    throw new RangeError('Invalid modulus or remainder');
  if (
    !model.domains.has(variable) ||
    model.domains.get(variable).some((v) => !Number.isSafeInteger(v))
  )
    throw new TypeError('Modulo requires integer domains');
  return model.constrain(
    [variable],
    (v) => ((v % divisor) + divisor) % divisor === remainder,
    'modulo',
  );
}
