const Time = ({ location, currentTime, timezone }) => {
  return (
    <>
      <h2>{location}</h2>
      <p>
        {currentTime.toLocaleString('en-US', {
          timeZone: timezone,
        })}
      </p>
    </>
  );
};

export default Time;
