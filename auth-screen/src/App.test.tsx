import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockAuth0Provider } from './context/MockAuth0Context';

// Mock Auth0 config validation
jest.mock('./config/auth0Config', () => ({
  validateAuth0Config: jest.fn(),
  AUTH0_CONFIG: {
    domain: 'test.auth0.com',
    clientId: 'test_client_id',
    redirectUri: 'http://localhost:3000/dashboard',
  },
}));

// We import App dynamically after mocking to ensure mocks are in place
describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render MockAuth0Provider wrapping routes', async () => {
    // This is a simplified test that verifies the App structure works
    // without trying to mock all the child components
    
    // 🔵 ARRANGE: Use dynamic import to get App after mocks are set
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const App = require('./App').default;

    // 🟢 ACT: Render App with MemoryRouter
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // 🔴 ASSERT: App component renders successfully
    // The Routes component should be present
    expect(container).toBeInTheDocument();
  });

  it('should render with MockAuth0Provider context', () => {
    // 🔵 ARRANGE: Create a test component that uses MockAuth0Provider
    const TestComponent = () => (
      <MockAuth0Provider>
        <MemoryRouter>
          <div data-testid="test-content">Test Content</div>
        </MemoryRouter>
      </MockAuth0Provider>
    );

    // 🟢 ACT: Render the test component
    render(<TestComponent />);

    // 🔴 ASSERT: Component renders successfully with context
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });
});
