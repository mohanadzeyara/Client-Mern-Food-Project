import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" bg="gray.50" borderTop="1px solid #eee" py={4} textAlign="center">
      <Text fontSize="sm" color="gray.600">Mohanad Zeyara - Mern Food - App</Text>
    </Box>
  );
}
