import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" bg="gray.50" borderTop="1px solid #eee" py={4} textAlign="center">
      <Text fontSize="sm" color="gray.600">
        &copy; {new Date().getFullYear()} Mohanad Zeyara - MERN Food App.{' '}
        <Link href="https://github.com/yourusername" color="teal.500" isExternal>
          GitHub
        </Link>
      </Text>
    </Box>
  );
}
