import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, HStack, Badge, Avatar } from '@chakra-ui/react';
import { AtSignIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { api, user, setUser } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/auth/me');
      setUser(data);
      setCount(data.recipeCount || 0);
    })();
  }, []);

  return (
    <Box maxW="lg" mx="auto" bg="white" p={6} borderRadius="2xl" boxShadow="md">
      <HStack spacing={4} align="center">
        <Avatar name={user?.name} />
        <Box>
          <Heading size="md">{user?.name}</Heading>
          <Text color="gray.600">{user?.email}</Text>
        </Box>
        <Badge ml="auto" fontSize="0.9em" colorScheme="teal" borderRadius="full" display="flex" alignItems="center" gap="1">
          <AtSignIcon mr="1" /> {count} recipes
        </Badge>
      </HStack>
    </Box>
  );
}
