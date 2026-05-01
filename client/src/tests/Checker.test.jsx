import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Checker from '../pages/Checker';
import React from 'react';

test('Checker renders correctly', () => {
  render(<Checker />);
  expect(screen.getByText(/Voter Eligibility Checker/i)).toBeDefined();
});

test('Age input works', () => {
  render(<Checker />);
  const input = screen.getByPlaceholderText(/Enter your age/i);
  fireEvent.change(input, { target: { value: '25' } });
  expect(input.value).toBe('25');
});
