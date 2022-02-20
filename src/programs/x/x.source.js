// Calculate with Nodejs REPL from command line

if (!_arg) {
  _error('No argument given.')

  return
}

const _mode = {
  scientific: _has(['-s', '--scientific'], process.argv[3]),
  hex: _has(['-0x', '--hexadecimal'], process.argv[3]),
}

// Math functions

const {
  log,
  sqrt,
  abs,
  sin,
  cos,
  tan,
  ceil,
  floor,
  random: rand,
  min,
  max,
  round,
  sign,
  PI: pi,
  E: e,
} = Math

// Useful constants

const P = 10 ** 15
const T = 10 ** 12
const B = 10 ** 9
const G = 10 ** 9
const M = 10 ** 6
const k = 10 ** 3

const m = 10 ** -3
const mu = 10 ** -6
const n = 10 ** -9
const p = 10 ** -12
const f = 10 ** -15

const c = 2.998 * 10 ** 8

// Sum of array of numbers or multiple number arguments

const sum = (...xs) => {
  if (Array.isArray(xs[0])) {
    xs = [...xs[0]]
  }

  let y = 0

  for (let j = 0; j < xs.length; j++) {
    y += xs[j]
  }

  return y
}

// Product of array of numbers or multiple number arguments

const prod = (...xs) => {
  if (Array.isArray(xs[0])) {
    xs = [...xs[0]]
  }

  let y = 1

  for (let j = 0; j < xs.length; j++) {
    y *= xs[j]
  }

  return y
}

// Array of integers 0 to 10, or 0 to a, or a to b

const ints = (a = 10, b = null) => {
  let x, y

  b !== null ? ([x, y] = [a, b]) : ([x, y] = [0, a])

  return Array(y - x + 1)
    .fill(0)
    .map((_, j) => j + x)
}

const _isSingleNumber = (input) => Number.isFinite(input)

const _isNumberArray = (input) => {
  if (Array.isArray(input)) {
    for (let j = 0; j < input.length; j++) {
      if (!_isSingleNumber(input[j])) {
        return false
      }
    }
    return true
  }
  return false
}

// Format like 3.141592653589793 × 10^6

const _formatNumberScientific = (_mantissa, _exponent) =>
  _mantissa + ' × 10^' + _exponent

// Format like 3,141,592.653,589,793

const _formatNumberDecimal = (_mantissa, _exponent) => {
  const _mantissaDigits = _mantissa.replace(/\./, '')

  const _leadingZeros = max(-1 * _exponent, 0)
  let _leadingZeroDigits = ''

  for (let j = 0; j < _leadingZeros; j++) {
    _leadingZeroDigits += '0'
  }

  const _endingZeros = max(1 + max(_exponent, 0) - _mantissaDigits.length, 0)
  let _endingZeroDigits = ''

  for (let j = 0; j < _endingZeros; j++) {
    _endingZeroDigits += '0'
  }

  const _decimalBefore = max(0, _exponent) + 1

  const _digits = _leadingZeroDigits + _mantissaDigits + _endingZeroDigits
  let _out = ''

  for (let j = 0; j < _digits.length; j++) {
    if (j !== 0 && j !== _decimalBefore && (j - _decimalBefore) % 3 === 0) {
      _out += ','
    }
    if (j === _decimalBefore) {
      _out += '.'
    }
    _out += _digits[j]
  }

  return _out
}

// Format any number

const _formatNumber = (_number) => {
  const [_mantissa, _signedExponent] = _number.toExponential().split('e')

  const _exponent = _signedExponent.replace(/\+/, '')

  switch (true) {
    case _mode.hex:
      return '0x' + round(_number).toString(16)
    case _mode.scientific:
      return _formatNumberScientific(_mantissa, _exponent)
    default:
      return _formatNumberDecimal(_mantissa, _exponent)
  }
}

// Result
try {
  const ev = eval(_arg)

  let out

  switch (true) {
    case ev === Infinity:
      out = '  ∞ (Positive infinity)'
      break

    case ev === -Infinity:
      out = '  -∞ (Negative infinity)'
      break

    case _isSingleNumber(ev):
      out = '  ' + _formatNumber(ev)
      break

    case _isNumberArray(ev):
      out = ev.map((x) => _formatNumber(x))
      out = JSON.stringify(out, null, 2).replace(/\"/g, '')
      break

    default:
      out = JSON.stringify(ev, null, 2)
  }

  _log(out)
} catch (err) {
  _error(`Evaluation failed.
		
  ${err}.`)
}
