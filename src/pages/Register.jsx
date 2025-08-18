import React, { useState } from 'react';
import { Box, Button, Heading, Input, Stack, FormControl, FormLabel, Alert, AlertIcon } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 5) {
      setError('Password must be at least 5 characters');
      return;
    }
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Box maxW="md" mx="auto" bg="white" p={6} borderRadius="2xl" boxShadow="md">
      <Heading mb={4}>Register</Heading>
      {error && <Alert status="error" mb={3}><AlertIcon />{error}</Alert>}
      <form onSubmit={submit}>
        <Stack spacing={3}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="teal">Create account</Button>
        </Stack>
      </form>
      <Box mt={3}>Have an account? <Link to="/login" style={{ color: '#2b6cb0' }}>Login</Link></Box>
    </Box>
  );
}
