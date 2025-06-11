import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it } from 'vitest';
import Signup from '../pages/SignUp';
import Home from '../pages/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';

describe('App routing', () => {
  it('renders Signup page at "/signup"', () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <MemoryRouter initialEntries={['/signup']}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </MemoryRouter>
      </GoogleOAuthProvider>
    );

    expect(screen.getAllByText(/sign up/i).length).toBeGreaterThan(0);
  });

  it('renders Home page at "/home"', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    // Fix: update this based on real text in your Hero <h1>
    expect(screen.getByText((content) => content.includes('WELCOME TO'))).toBeInTheDocument();
  });
});
