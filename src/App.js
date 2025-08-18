import React from 'react';
import { ChakraProvider, Box, Container } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <BrowserRouter>
          <Box minH="100vh" display="flex" flexDirection="column" style={{ background: "linear-gradient(180deg, #f7fafc 0%, #ffffff 40%)" }}>
            <Navbar />
            <Container maxW="6xl" flex="1" py={6}>
              <Routes>
                <Route path="/" element={<Recipes />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/add" element={<PrivateRoute><AddRecipe /></PrivateRoute>} />
                <Route path="/edit/:id" element={<PrivateRoute><EditRecipe /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              </Routes>
            </Container>
            <Footer />
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}
