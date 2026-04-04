import Button from '../components/Button';

export default {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export const Primary = {
  args: {
    children: 'Add to Cart',
    style: { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white' }
  },
};

export const Accent = {
  args: {
    children: 'Buy Now',
    style: { background: 'linear-gradient(135deg, #f97316, #ef4444)', color: 'white' }
  },
};

export const Outlined = {
  args: {
    children: 'Details',
    style: { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }
  },
};
