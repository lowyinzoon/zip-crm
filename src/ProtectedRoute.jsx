import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

export default function ProtectedRoute({ children, allowed }) {
  const { role } = useUser();

  if (!role) return <Navigate to="/" />; // force to login

  return allowed.includes(role) ? children : <Navigate to="/" />;
} 