import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';

const calculateDuration = (eventTime) => {
  moment.duration(Math.max(eventTime - (Math.floor(new Date().getTime())), 0), 'seconds')
}

const formatTimeLeft = (leftTime) => {
  const timeLeft = moment.duration(leftTime, 'milliseconds');
  const hours = timeLeft.hours();
  let minutes = Math.abs(timeLeft.minutes())
  let seconds = Math.abs(timeLeft.seconds())
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  return hours + ":" + minutes + ":" + seconds;
}

const Countdown = ({ eventTime, interval }) => {
  const [remainingTime, setRemainingTime] = useState(0);
  // console.log("eventTime", eventTime);

  useEffect(() => {
    const intervalId = setInterval(() => { updateRemainingTime(eventTime) }, 1000);
    return () => clearInterval(intervalId);
  }, [eventTime])

  const updateRemainingTime = (endTime) => {
    const timeNow = moment().format('x')
    const leftTime = endTime - timeNow;
    // if (leftTime < 1) sendAlerts();
    setRemainingTime(formatTimeLeft(leftTime));

  }

  // updateRemainingTime(eventTime);

  return (
    <View>
      <Text style={{ color: 'white' }}>
        {remainingTime}
      </Text>

    </View>
  )
}

export default Countdown