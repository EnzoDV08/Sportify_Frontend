import { render, screen } from '@testing-library/react';
import Demo from '../Components/Demo';

test('renders demo text', () => {
  render(<Demo />);
  expect(screen.getByText(/hello coverage/i)).toBeInTheDocument();
});