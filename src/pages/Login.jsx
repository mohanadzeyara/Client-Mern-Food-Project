import React, { useState } from 'react';
import { Box, Button, Heading, Input, Stack, FormControl, FormLabel, Alert, AlertIcon } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box maxW="md" mx="auto" bg="white" p={6} borderRadius="2xl" boxShadow="md">
      <Heading mb={4}>Log in</Heading>
      {error && <Alert status="error" mb={3}><AlertIcon />{error}</Alert>}
      <form onSubmit={submit}>
        <Stack spacing={3}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="teal">Login</Button>
        </Stack>
      </form>
      <Box mt={3}>No account? <Link to="/register" style={{ color: '#2b6cb0' }}>Register</Link></Box>
    </Box>
  );
}
