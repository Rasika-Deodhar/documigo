import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Container from './container';

describe('<Container />', () => {
  test('it should mount', () => {
    render(<Container />);

    const container = screen.getByTestId('container');

    expect(container).toBeInTheDocument();
  });
});