import React, { useEffect, useState } from 'react';
import { SimpleGrid, Heading, Text } from '@chakra-ui/react';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Recipes() {
  const { api, user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();

  async function load() {
    try {
      const params = new URLSearchParams(location.search);
      const q = params.get('q') || '';
      const { data } = await api.get('/recipes' + (q ? `?q=${encodeURIComponent(q)}` : ''));
      setItems(data);
    } catch (e) {
      setError('Failed to load recipes');
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [location.search]);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    await api.delete('/recipes/' + id);
    setItems(items.filter(it => it._id !== id));
  };

  return (
    <>
      <Heading mb={4}>Recipes</Heading>
      {error && <Text color="red.500">{error}</Text>}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5}>
        {items.map(r => (
          <RecipeCard key={r._id} recipe={r} canEdit={user && (user.role === 'admin' || r.author?._id === user.id)} onDelete={onDelete} />
        ))}
      </SimpleGrid>
    </>
  );
}
