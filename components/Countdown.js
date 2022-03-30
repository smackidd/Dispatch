import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';

const calculateDuration = (eventTime) => {
  moment.duration(Math.max(eventTime - (Math.floor(new Date().getTime())), 0), 'seconds')
}

const Countdown = ({ eventTime, interval }) => {
  const [remainingTime, setRemainingTime] = useState(0);
  // console.log("eventTime", eventTime);

  useEffect(() => {
    const intervalId = setInterval(() => { updateRemainingTime(eventTime) }, 1000);
    // updateRemainingTime(eventTime)
    // console.log(eventTime);
    // console.log("useEffect")
    return () => clearInterval(intervalId);
  }, [eventTime])

  const updateRemainingTime = (endTime) => {
    const timeNow = moment().format('x')
    const leftTime = endTime - timeNow;
    const timeLeft = moment.duration(leftTime, 'milliseconds');
    setRemainingTime(timeLeft.hours() + ":" + Math.abs(timeLeft.minutes()) + ":" + Math.abs(timeLeft.seconds()))

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