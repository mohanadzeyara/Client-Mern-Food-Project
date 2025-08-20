import React from 'react';
import { motion } from 'framer-motion';
import { Box, Heading, Text, Button, Image, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function getImageSrc(img) {
  if (!img) return '';
  return img;  // Cloudinary gives a full URL
}

export default function RecipeCard({ recipe, canEdit, onDelete }) {
  return (
    <Box
      as={motion.div}
      whileHover={{ y: -4, boxShadow: 'lg' }}
      transition={{ type: 'spring', stiffness: 300 }}
      borderWidth="1px"
      borderRadius="2xl"
      overflow="hidden"
      p={4}
      bg="white"
      boxShadow="sm"
    >
      {recipe.image && (
        <Image
          src={getImageSrc(recipe.image)}
          alt={recipe.title}
          w="100%"
          h="200px"
          objectFit="cover"
          borderRadius="xl"
          mb={3}
        />
      )}
      <Heading size="md" mb={2}>{recipe.title}</Heading>
      <Text noOfLines={2} color="gray.600" mb={4}>{recipe.description}</Text>
      <Flex gap={2}>
        <Button as={Link} to={`/recipe/${recipe._id}`} colorScheme="teal" variant="outline">View</Button>
        {canEdit && (
          <>
            <Button as={Link} to={`/edit/${recipe._id}`} colorScheme="yellow">Edit</Button>
            <Button onClick={() => onDelete(recipe._id)} colorScheme="red" variant="outline">Delete</Button>
          </>
        )}
      </Flex>
    </Box>
  );
}
