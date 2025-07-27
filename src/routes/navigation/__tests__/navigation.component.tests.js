import { screen } from '@testing-library/react';

import Navigation from '../navigation.component';
import { renderWithProviders } from '../../../utils/test/test.utils';
import { getCurrentUser } from '../../../utils/firebase/firebase.utils';

describe('Navigation tests', () => {
    test('It should render as Sign in link and not a Sign Out if there is no currentUser', () => {
        renderWithProviders(<Navigation/>, {
            preloadedState: {
                user: {
                    getCurrentUser: null,
                }
            }
        });

        const signInLinkElement = screen.getByText(/sign in/i);
        expect(signInLinkElement).toBeInTheDocument();

        const signOutLinkElement = screen.queryByText(/sign out/i);
        expect(signOutLinkElement).toBeNull();
    })

    test('It should render Sign Out link and not Sign In link if there is a currentUser', () => {
        renderWithProviders(<Navigation/>, {
            preloadedState: {
                user: {
                    currentUser: {

                    }
                }
            }
        })

        const signInLinkElement = screen.queryByText(/sign in/i);
        expect(signInLinkElement).toBeNull();

        const signOutLinkElement = screen.getByText(/sign out/i);
        expect(signOutLinkElement).toBeInTheDocument();
    });

    test('it should render a cart dropdwon if idCartOpen is false', () => {
        renderWithProviders(<Navigation />, {
            preloadedState: {
                cart: {
                    isCartOpen: false,
                    cartItems: []
               }
            }
        });

        const dropdownTextElement = screen.queryByText(/Your cart is empty/i);
        expect(dropdownTextElement).toBeNull();
    });

    test('it should render a cart dropdown if isCartOpen is true', () => {
        renderWithProviders(<Navigation />, {
            preloadedState: {
                cart: {
                    isCartOpen: true,
                    cartItems: []
               },
            },
        });

        const dropdownTextElement = screen.getByText(/Your cart is empty/i);
        expect(dropdownTextElement).toBeInTheDocument();
    });

    
})