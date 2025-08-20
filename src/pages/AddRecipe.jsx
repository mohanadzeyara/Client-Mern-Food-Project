import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Heading, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AddRecipe() {
  const navigate = useNavigate();
  const { api } = useAuth();

  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(''); // newline-separated
  const [steps, setSteps]             = useState(''); // newline-separated
  const [image, setImage]             = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('ingredients', JSON.stringify(ingredients.split('\n').map(s => s.trim()).filter(Boolean)));
    fd.append('steps', JSON.stringify(steps.split('\n').map(s => s.trim()).filter(Boolean)));
    if (image) fd.append('image', image);
    await api.post('/recipes', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    navigate('/');
  }

  return (
    <Box maxW="700px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="xl">
      <Heading mb={4}>Create Recipe</Heading>
      <form onSubmit={onSubmit}>
        <VStack spacing={4} align="stretch">
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
        </VStack>
      </form>
    </Box>
  );
}
