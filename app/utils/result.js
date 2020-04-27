const LOW = 0.39
const HIGH = 0.81

const getResultStatus = (_value) => {
  if (_value === -1 || !_value) return 'bad'
  if (_value < LOW) return 'low'
  if (_value >= LOW && _value <= HIGH) return 'medium'
  if (_value > HIGH) return 'high'
}

export { getResultStatus }
