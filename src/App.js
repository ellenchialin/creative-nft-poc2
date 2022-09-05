import { useState, useEffect } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';

import CreativeNFTPOC from './utils/CreativeNFTPOC.json';
import { locations } from './utils/locationList';
import Time from './components/Time';
import Weather from './components/Weather';

const CONTRACT_ADDRESS = '0x4E974c3BC95F9e5637EF77BE165BE09c46C2e12f';

function App() {
  const [idQuery, setIdQuery] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezone, setTimezone] = useState('');
  const [cityName, setCityName] = useState('');
  const [weatherInfo, setWeatherInfo] = useState({
    temp: null,
    feels_like: null,
    humidity: null,
    description: '',
    icon: '',
    sunrise: null,
    sunset: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const getSeed = async tokenId => {
    try {
      const infuraProvider = new ethers.providers.JsonRpcProvider(
        'https://rinkeby.infura.io/v3/7d943fe8904d4be9b833a086c1f4a566'
      );
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CreativeNFTPOC.abi,
        infuraProvider
      );

      console.log('connectedContract: ', connectedContract);

      const seed = await connectedContract.getSeed(tokenId);
      return seed;
    } catch (error) {
      console.log('Error: reading seed from contract', error);
    }
  };

  const getLocalTime = async location => {
    try {
      const res = await fetch(
        `https://timezone.abstractapi.com/v1/current_time/?api_key=fe70b53cf8d54ed4ac6b92eff7547006&location=${location}`
      );
      const data = await res.json();

      setTimezone(data.timezone_location);

      console.log('Location Data: ', data);
    } catch (error) {
      console.log('Error: fetching data from abstractapi', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalWeather = async location => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=87cea03ad5578c4043837e98947a4fc9`
      );
      const data = await res.json();

      console.log('Weather data: ', data);
      const { main, sys, weather } = data;

      setWeatherInfo({
        temp: main.temp,
        feels_like: main.feels_like,
        humidity: main.humidity,
        description: weather[0].main,
        icon: weather[0].icon,
        sunrise: sys.sunrise,
        sunset: sys.sunset,
      });

      setCityName(data.name);
    } catch (error) {
      console.log('Error: fetching data from OpenWeather API', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocation = async tokenId => {
    try {
      setIsLoading(true);
      const seed = await getSeed(tokenId);

      if (seed) {
        console.log('seed: ', seed);
        if (Number(seed) === 0) {
          alert('Token id does not exist. Please try another token id.');
          return;
        }

        const parsed = parseInt(Number(seed), 10);
        console.log('parsed number from seed: ', parsed);

        const matchedLocation = locations.find(
          location => location.id === parsed
        ).location;

        console.log(matchedLocation);

        getLocalTime(matchedLocation);
        getLocalWeather(matchedLocation);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check tokenId query and call getSeed(id)
  // Parse seed and match location
  // Send location request and show time
  useEffect(() => {
    const tokenIdQuery = new URLSearchParams(window.location.search).get(
      'tokenid'
    );

    if (tokenIdQuery) {
      console.log('tokenId Query: ', tokenIdQuery);
      setIdQuery(tokenIdQuery);
      getLocation(tokenIdQuery);
    }
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <Flex
      w="full"
      h="100vh"
      direction="column"
      justify="center"
      alignItems="center"
      gap="2"
      backgroundColor="rgba(51, 65, 91, 0.96)"
      color="white"
    >
      {!idQuery && <p>Search Token ID on URL to get city info</p>}
      {weatherInfo.temp && timezone !== '' && (
        <Flex
          direction="column"
          alignItems="center"
          gap="20"
          backgroundColor="white"
          color="rgba(51, 65, 91, 0.96)"
          borderRadius="10px"
          p="24"
        >
          <Flex direction="column" alignItems="center">
            <Text fontSize="2rem">{cityName}</Text>
            <Time currentTime={currentTime} timezone={timezone} />
          </Flex>
          <Weather weatherInfo={weatherInfo} timezone={timezone} />
        </Flex>
      )}
    </Flex>
  );
}

export default App;
