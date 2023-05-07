import { View } from 'native-base';
import { AppTabsNavigationKey } from 'navigation/navigationKey';
import React from 'react';
import { AppTabsStackScreenProps } from 'types';

export const FakeScreen = (props: AppTabsStackScreenProps<AppTabsNavigationKey.FloatButton>) => {
    return <View></View>;
};
