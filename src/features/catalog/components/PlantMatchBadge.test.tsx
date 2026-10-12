import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlantMatchBadge } from './PlantMatchBadge';

describe('PlantMatchBadge Component', () => {
  it('renders dynamic match percentage with emerald badge styling for match >= 70%', () => {
    const { rerender } = render(<PlantMatchBadge matchPercentage={99} />);
    const badge99 = screen.getByText('99% dopasowania');
    expect(badge99).toBeInTheDocument();
    expect(badge99).toHaveClass('bg-emerald-50');
    expect(badge99).toHaveClass('text-emerald-700');
    expect(badge99).toHaveClass('border-emerald-100');

    rerender(<PlantMatchBadge matchPercentage={85} />);
    expect(screen.getByText('85% dopasowania')).toBeInTheDocument();

    rerender(<PlantMatchBadge matchPercentage={70} />);
    expect(screen.getByText('70% dopasowania')).toBeInTheDocument();
  });

  it('renders amber warning badge "Wymaga uwagi" for match < 70%', () => {
    const { rerender } = render(<PlantMatchBadge matchPercentage={69} />);
    const attentionBadge = screen.getByText('Wymaga uwagi');
    expect(attentionBadge).toBeInTheDocument();
    expect(attentionBadge).toHaveClass('bg-amber-50');
    expect(attentionBadge).toHaveClass('text-amber-700');
    expect(attentionBadge).toHaveClass('border-amber-200');

    rerender(<PlantMatchBadge matchPercentage={45} />);
    expect(screen.getByText('Wymaga uwagi')).toBeInTheDocument();

    rerender(<PlantMatchBadge matchPercentage={20} />);
    expect(screen.getByText('Wymaga uwagi')).toBeInTheDocument();
  });
});
