import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Image, List, ListItem, Button, Stack } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const { api, user } = useAuth();
  const [rec, setRec] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/recipes/' + id);
      setRec(data);
    })();
  }, [id]);

  if (!rec) return null;
  const canEdit = user && (user.role === 'admin' || rec.author?._id === user.id);

  return (
    <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm">
      {rec.image && <Image src={(process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/images/' + rec.image} alt={rec.title} mb={4} borderRadius="xl" />}
      <Heading mb={2}>{rec.title}</Heading>
      <Text color="gray.600" mb={4}>By {rec.author?.name || 'Unknown'}</Text>
      <Text mb={4}>{rec.description}</Text>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
        <Box flex="1">
          <Heading size="md" mb={2}>Ingredients</Heading>
          <List spacing={1}>
            {rec.ingredients.map((i, idx) => <ListItem key={idx}>• {i}</ListItem>)}
          </List>
        </Box>
        <Box flex="1">
          <Heading size="md" mb={2}>Steps</Heading>
          <List spacing={1}>
            {rec.steps.map((s, idx) => <ListItem key={idx}>{idx+1}. {s}</ListItem>)}
          </List>
        </Box>
      </Stack>
      {canEdit && (
        <Button as={RouterLink} to={`/edit/${rec._id}`} mt={4} colorScheme="yellow">Edit</Button>
      )}
    </Box>
  );
}
