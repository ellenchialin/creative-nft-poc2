import { Text } from '@chakra-ui/react';

const Time = ({ currentTime, timezone }) => {
  return (
    <Text>
      {currentTime.toLocaleString('en-US', {
        timeZone: timezone,
      })}
    </Text>
  );
};

export default Time;
