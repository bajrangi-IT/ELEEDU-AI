import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Component', () => {
  it('renders the navbar with brand name', () => {
    render(<App />);
    expect(screen.getByText(/EleEdu AI/i)).toBeDefined();
  });

  it('renders the navigation links', () => {
    render(<App />);
    expect(screen.getByText(/Dashboard/i)).toBeDefined();
    expect(screen.getByText(/Assistant/i)).toBeDefined();
  });
});
