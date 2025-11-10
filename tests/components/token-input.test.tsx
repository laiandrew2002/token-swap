import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TokenInput } from '@/components/token-input'

describe('TokenInput', () => {
  it('renders with label and placeholder', () => {
    render(<TokenInput value="" onChange={() => {}} />)
    expect(screen.getByText('USD Amount')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument()
  })

  it('calls onChange with cleaned numeric input', async () => {
    const handleChange = jest.fn()
    render(<TokenInput value="" onChange={handleChange} />)
    
    const input = screen.getByPlaceholderText('0.00')
    await userEvent.type(input, '123.45')
    
    expect(handleChange).toHaveBeenCalledWith('1')
    expect(handleChange).toHaveBeenCalledWith('12')
    expect(handleChange).toHaveBeenCalledWith('123')
    expect(handleChange).toHaveBeenCalledWith('123.')
    expect(handleChange).toHaveBeenCalledWith('123.4')
    expect(handleChange).toHaveBeenCalledWith('123.45')
  })

  it('filters out non-numeric characters', async () => {
    const handleChange = jest.fn()
    render(<TokenInput value="" onChange={handleChange} />)
    
    const input = screen.getByPlaceholderText('0.00')
    await userEvent.type(input, 'abc123def')
    
    // Should only call with numeric parts
    expect(handleChange).toHaveBeenCalledWith('123')
  })

  it('shows clear button when value is present', () => {
    render(<TokenInput value="100" onChange={() => {}} />)
    expect(screen.getByLabelText('Clear input')).toBeInTheDocument()
  })

  it('clears input when clear button is clicked', async () => {
    const handleChange = jest.fn()
    render(<TokenInput value="100" onChange={handleChange} />)
    
    const clearButton = screen.getByLabelText('Clear input')
    await userEvent.click(clearButton)
    
    expect(handleChange).toHaveBeenCalledWith('')
  })

  it('displays error message when error prop is provided', () => {
    render(<TokenInput value="" onChange={() => {}} error="Invalid amount" />)
    expect(screen.getByText('Invalid amount')).toBeInTheDocument()
  })
})

