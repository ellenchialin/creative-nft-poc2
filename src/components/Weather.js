// prettier-ignore
import { Flex, Image, Text, Heading, Stat, StatLabel, StatNumber, Box } from '@chakra-ui/react';

const Weather = ({ weatherInfo, timezone }) => {
  const { temp, feels_like, humidity, description, icon, sunrise, sunset } =
    weatherInfo;

  const convertUnixToDate = unixTimestamp => {
    const date = new Date(unixTimestamp * 1e3);
    return date.toLocaleTimeString('en-US', { timeZone: timezone });
  };

  return (
    <Flex w="full" maxW="500px" direction="column" gap="6" alignItems="center">
      <Flex direction="column" alignItems="center">
        <Image
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="weather icon"
          width={80}
          height={80}
        />
        <Text>{description}</Text>
      </Flex>
      <Flex gap="24">
        <Box maxW="sm">
          <Stat>
            <StatLabel>Temp</StatLabel>
            <StatNumber fontWeight="bold" fontSize="1.5rem">
              {temp}°C
            </StatNumber>
          </Stat>
        </Box>
        <Box maxW="sm">
          <Stat>
            <StatLabel>Feels Like</StatLabel>
            <StatNumber fontWeight="bold" fontSize="1.5rem">
              {feels_like}°C
            </StatNumber>
          </Stat>
        </Box>
        <Box maxW="sm">
          <Stat>
            <StatLabel>Humidity</StatLabel>
            <StatNumber fontWeight="bold" fontSize="1.5rem">
              {humidity}%
            </StatNumber>
          </Stat>
        </Box>
      </Flex>
      <Flex justify="space-between">
        <Stat>
          <StatLabel>Sunrise</StatLabel>
          <StatNumber fontWeight="bold" fontSize="1.2rem">
            {convertUnixToDate(sunrise)}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Sunset</StatLabel>
          <StatNumber fontWeight="bold" fontSize="1.2rem">
            {convertUnixToDate(sunset)}
          </StatNumber>
        </Stat>
      </Flex>
    </Flex>
  );
};

export default Weather;