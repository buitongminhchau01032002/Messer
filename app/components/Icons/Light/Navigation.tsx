import { Icon } from 'native-base';
import { CustomIconProps } from '../type';
import { G, Path } from 'react-native-svg';
import React from 'react';

export const NavigationIcon = (props: CustomIconProps) => {
    return (
        <Icon size="4xl" viewBox="0 0 16 17" {...props}>
            <G fillRule="nonzero" stroke="none" strokeWidth={1}>
                <Path d="M6.55747 8.38123C6.55747 8.54395 6.51001 8.70752 6.41678 8.84906L3.67846 12.9849L12.885 8.38123L3.67846 3.77754L6.41678 7.9134C6.51001 8.05494 6.55747 8.21851 6.55747 8.38123ZM0.372315 15.1613C0.372315 14.9986 0.418928 14.8359 0.513002 14.6935L4.69379 8.38123L0.513002 2.06895C0.301971 1.74859 0.330787 1.32653 0.585041 1.03922C0.840142 0.751914 1.25542 0.671401 1.59867 0.842598L15.1589 7.62271C15.7335 7.91001 15.7335 8.85245 15.1589 9.13976L1.59867 15.9199C1.25542 16.0911 0.840142 16.0105 0.585041 15.7232C0.444354 15.5639 0.372315 15.363 0.372315 15.1613Z" />
            </G>
        </Icon>
    );
};