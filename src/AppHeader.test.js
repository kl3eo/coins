import React from 'react';
import { render } from '@testing-library/react';
import AppHeader from './components/app-header';

test('renders learn react link', () => {
  const { getByText } = render(<AppHeader />);
  const linkElement = getByText(/Binance/i);
  expect(linkElement).toBeInTheDocument();
});
