import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocSummarize from './docSummarize';

describe('<DocSummarize />', () => {
  test('it should mount', () => {
    render(<DocSummarize />);

    const docSummarize = screen.getByTestId('docSummarize');

    expect(docSummarize).toBeInTheDocument();
  });
});