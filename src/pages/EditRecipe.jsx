import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Input, Stack, FormControl, FormLabel, Textarea, Alert, AlertIcon } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api'; // centralized axios instance

export default function EditRecipe() {
  const { id } = useParams();
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTitle(data.title);
        setDescription(data.description);
        setIngredients(data.ingredients.join('\n'));
        setSteps(data.steps.join('\n'));
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to fetch recipe');
      }
    })();
  }, [id, token]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('ingredients', ingredients);
    fd.append('steps', steps);
    if (image) fd.append('image', image);

    try {
      const { data } = await api.put(`/recipes/${id}`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      navigate('/recipe/' + data._id);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update recipe');
    }
  };

  return (
    <Box maxW="lg" mx="auto" bg="white" p={6} borderRadius="2xl" boxShadow="md">
      <Heading mb={4}>Edit Recipe</Heading>
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
            <FormLabel>Replace Image</FormLabel>
            <Input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
          </FormControl>
          <Button type="submit" colorScheme="yellow">Save</Button>
        </Stack>
      </form>
    </Box>
  );
}
