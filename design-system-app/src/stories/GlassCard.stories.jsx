import React from 'react';
import GlassCard from '../components/GlassCard';

export default {
  title: 'Design System/GlassCard',
  component: GlassCard,
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    children: (
      <div style={{ padding: '20px', color: 'white' }}>
        <h2>Premium Glass Card</h2>
        <p>This is a reusable component for consistent aesthetics.</p>
      </div>
    ),
    style: { width: '400px', height: '200px' }
  },
};

export const DarkGradient = {
  args: {
    children: (
        <div style={{ padding: '20px', color: 'white' }}>
          <h2>Dark Aesthetic</h2>
          <p>Perfect for dark themes and contrast.</p>
        </div>
      ),
    style: { width: '400px', height: '200px', background: 'rgba(0,0,0,0.5)' }
  },
};
