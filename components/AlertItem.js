import { TwitterAuthProvider } from 'firebase/auth';
import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import theme from '../styles/theme.style';
import tw from "tailwind-rn";
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import { db } from '../Firebase';
import DefaultAlert from './AlertTypes/DefaultAlert';
import ConnectionAlert from './AlertTypes/ConnectionAlert';
import NewEventAlert from './AlertTypes/NewEventAlert';
import { render } from 'react-dom';
import RejectedEvent from './AlertTypes/RejectedEvent';
import DeniedConnection from './AlertTypes/DeniedConnection';

const { width } = Dimensions.get("window");

const AlertItem = ({ alert, setSwiping }) => {

  const renderAlerts = () => {
    switch (alert.alertType) {
      case 'connection':
        return <ConnectionAlert alert={alert} />
      case 'newEvent':
        return <NewEventAlert alert={alert} />
      case 'rejectedEvent':
        return <RejectedEvent alert={alert} />
      case 'deniedConnection':
        return <DeniedConnection alert={alert} />
      case 'default':
        return <DefaultAlert alert={alert} />
      default:
        return <DefaultAlert alert={alert} />
    }
  }

  return (
    <>
      {renderAlerts()}
    </>
  )
}

export default AlertItem


