import React, { useState } from 'react';
import { Box, Button, Heading, Input, Stack, FormControl, FormLabel, Textarea, Alert, AlertIcon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AddRecipe() {
  const { api } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title || !description || !ingredients || !steps) {
      setError('Please fill in all fields');
      return;
    }
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('ingredients', ingredients);
    fd.append('steps', steps);
    if (image) fd.append('image', image);
    try {
      const { data } = await api.post('/recipes', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/recipe/' + data._id);
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to create recipe');
    }
  };

  return (
    <Box maxW="lg" mx="auto" bg="white" p={6} borderRadius="2xl" boxShadow="md">
      <Heading mb={4}>Add Recipe</Heading>
      {error && <Alert status="error" mb={3}><AlertIcon />{error}</Alert>}
      <form onSubmit={submit}>
        <Stack spacing={3}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Ingredients (one per line)</FormLabel>
            <Textarea value={ingredients} onChange={e => setIngredients(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Steps (one per line)</FormLabel>
            <Textarea value={steps} onChange={e => setSteps(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Image</FormLabel>
            <Input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
          </FormControl>
          <Button type="submit" colorScheme="teal">Create</Button>
        </Stack>
      </form>
    </Box>
  );
}
