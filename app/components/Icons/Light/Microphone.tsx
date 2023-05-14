import { Icon } from 'native-base';
import { CustomIconProps } from '../type';
import { G, Path } from 'react-native-svg';
import React from 'react';

export const MicrophoneIcon = (props: CustomIconProps) => {
    return (
        <Icon size="4xl" viewBox="0 0 384 512" {...props}>
            <G fillRule="nonzero" stroke="none" strokeWidth={1}>
                <Path d="M240 96V256c0 26.5-21.5 48-48 48s-48-21.5-48-48V96c0-26.5 21.5-48 48-48s48 21.5 48 48zM96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96S96 43 96 96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
            </G>
        </Icon>
    );
};
