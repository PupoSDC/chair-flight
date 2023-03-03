import { render, screen } from '@testing-library/react';

import Index from './index.page';

describe('Index', () => {
  it('should render successfully', () => {
    render(<Index />);
    expect(screen.getByText("CHAIR FLIGHT")).toBeTruthy();
  });
});
