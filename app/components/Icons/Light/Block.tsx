import { Icon } from 'native-base';
import { CustomIconProps } from '../type';
import { G, Path } from 'react-native-svg';
import React from 'react';

export const BlockIcon = (props: CustomIconProps) => {
    return (
        <Icon size="4xl" viewBox="0 0 17 17" {...props}>
            <G fillRule="nonzero" stroke="none" strokeWidth={1}>
                <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.51674 8.61883C2.51674 7.21077 3.00109 5.91713 3.80428 4.88359L12.3541 13.4334C11.3205 14.2373 10.0269 14.7209 8.61883 14.7209C5.25429 14.7209 2.51674 11.9834 2.51674 8.61883ZM14.7209 8.61883C14.7209 10.0269 14.2366 11.3205 13.4334 12.3541L4.88359 3.80428C5.91713 3.00033 7.21077 2.51674 8.61883 2.51674C11.9834 2.51674 14.7209 5.25429 14.7209 8.61883ZM8.61883 0.991211C4.41296 0.991211 0.991211 4.41296 0.991211 8.61883C0.991211 12.8247 4.41296 16.2465 8.61883 16.2465C12.8247 16.2465 16.2465 12.8247 16.2465 8.61883C16.2465 4.41296 12.8247 0.991211 8.61883 0.991211Z"
                />
            </G>
        </Icon>
    );
};
