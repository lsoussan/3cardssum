import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Input, Button, Text, VStack, Grid, GridItem } from '@chakra-ui/react';

function App() {
  const [cards, setCards] = useState([]);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [userSum, setUserSum] = useState('');
  const [result, setResult] = useState('');
  const [nextCardIndex, setNextCardIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const generatedCards = [];
    for (let i = 0; i < 10; i++) {
      generatedCards.push(Math.floor(Math.random() * 10) + 1);
    }
    setCards(generatedCards);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < 3) {
        setDisplayedCards((prev) => [...prev, cards[index]]);
        setNextCardIndex(index + 1);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [cards]);

  const checkSum = () => {
    const lastThreeCards = displayedCards.slice(-3);
    const correctSum = lastThreeCards.reduce((a, b) => a + b, 0);
    if (parseInt(userSum, 10) === correctSum) {
      setResult('Correct!');
      setCorrectCount(correctCount + 1);
      if (nextCardIndex < cards.length) {
        setDisplayedCards((prev) => [...prev, cards[nextCardIndex]]);
        setNextCardIndex(nextCardIndex + 1);
      }
    } else {
      setResult('Incorrect. Try again.');
    }
  };

  return (
    <ChakraProvider>
      <Grid templateColumns="4fr 1fr" height="100vh">
        <GridItem display="flex" alignItems="center" justifyContent="center">
          <Box position="relative" width="100%" height="100%">
            {displayedCards.map((number, index) => (
              <Box
                key={index}
                position="absolute"
                top="50%"
                left="50%"
                transform={`translate(-50%, -50%) translateY(${index * 20}px)`}
                width="30%"
                height="60%"
                backgroundColor="gray.100"
                border="1px solid"
                borderColor="gray.300"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="48px"
                fontWeight="bold"
                borderRadius="md"
                boxShadow="md"
                zIndex={index + 1}
                opacity={index === 2 ? 1 : 0.95}
                cursor={index === 2 ? 'default' : 'pointer'}
                onMouseEnter={(e) => {
                  if (index !== 2) {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.querySelector('.card-value').style.visibility = 'visible';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== 2) {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.querySelector('.card-value').style.visibility = 'hidden';
                  }
                }}
              >
                {number}
                <span className="card-value" style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  visibility: 'hidden'
                }}>
                  {number}
                </span>
              </Box>
            ))}
          </Box>
        </GridItem>
        <GridItem display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={4}>
            <Input
              type="number"
              placeholder="Enter the sum of the last 3 cards"
              value={userSum}
              onChange={(e) => setUserSum(e.target.value)}
            />
            <Button onClick={checkSum}>Submit</Button>
            <Text color={result === 'Correct!' ? 'green.500' : 'red.500'}>{result}</Text>
            <Text>Correct sums: {correctCount}</Text>
          </VStack>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

export default App;