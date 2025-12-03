import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocUpload from './docUpload';

describe('<DocUpload />', () => {
  test('it should mount', () => {
    render(<DocUpload />);

    const docUpload = screen.getByTestId('docUpload');

    expect(docUpload).toBeInTheDocument();
  });
});