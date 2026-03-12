import { AuthProvider } from './contexts/AuthContext.jsx';
import { AppRoutes } from './router/routes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
