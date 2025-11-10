import {
  calculateTokenAmount,
  calculateSwapAmounts,
  validateUSDInput,
} from '@/lib/utils/calculations'

describe('calculateTokenAmount', () => {
  it('calculates token amount correctly', () => {
    expect(calculateTokenAmount(100, 2)).toBe(50)
    expect(calculateTokenAmount(1000, 10)).toBe(100)
  })

  it('returns 0 for invalid inputs', () => {
    expect(calculateTokenAmount(0, 2)).toBe(0)
    expect(calculateTokenAmount(100, 0)).toBe(0)
    expect(calculateTokenAmount(-100, 2)).toBe(0)
  })
})

describe('calculateSwapAmounts', () => {
  it('calculates both amounts correctly', () => {
    const result = calculateSwapAmounts(100, 2, 4)
    expect(result.sourceAmount).toBe(50)
    expect(result.targetAmount).toBe(25)
  })
})

describe('validateUSDInput', () => {
  it('validates valid input', () => {
    expect(validateUSDInput('100')).toEqual({ isValid: true })
    expect(validateUSDInput('0.01')).toEqual({ isValid: true })
  })

  it('rejects empty input', () => {
    const result = validateUSDInput('')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Please enter an amount')
  })

  it('rejects invalid numbers', () => {
    const result = validateUSDInput('abc')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Invalid number')
  })

  it('rejects negative numbers', () => {
    const result = validateUSDInput('-100')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Amount must be positive')
  })

  it('rejects numbers that are too large', () => {
    const result = validateUSDInput('2000000000')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Amount too large')
  })
})

