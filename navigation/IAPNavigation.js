// Example of how to integrate IAP Store into your navigation
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import IAPStore from '../components/IAPStore';

const Stack = createStackNavigator();

// Add this to your main navigation stack
const IAPStackNavigator = () => {
  return (
    <Stack.Screen 
      name="IAPStore" 
      component={IAPStore}
      options={{
        headerShown: false,
        presentation: 'modal',
      }}
    />
  );
};

export default IAPStackNavigator;
