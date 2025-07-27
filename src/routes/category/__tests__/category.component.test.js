import { screen } from '@testing-library/react';

import Category from '../category.component.tsx';
import { renderWithProviders } from '../../../utils/test/test.utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    category: 'mens',
  }),
}));

describe('Category component tests', () => {
  test('It should render a Spinner if isLoading is truew', () => {
    renderWithProviders(<Category />, {
      preloadedState: {
        categories: {
          isLoading: true,
          categories: [],
        },
      },
    });
    const spinnerElement = screen.getByTestId('spinner');
    expect(spinnerElement).toBeInTheDocument();
  });

  test('It should render products if isLoading is false and there are items present', () => {
    renderWithProviders(<Category />, {
      preloadedState: {
        categories: {
          isLoading: false,
          categories: [
            {
              title: 'mens',
              items: [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' },
              ],
            },
          ],
        },
      },
    });

    expect(screen.queryByTestId('spinner')).toBeNull();
    const productElement =  screen.getByText(/product/1);
    expect(productElement).toBeInTheDocument();
  });
});