import { Icon } from 'native-base';
import { CustomIconProps } from '../type';
import { G, Path } from 'react-native-svg';
import React from 'react';

export const VideoIcon = (props: CustomIconProps) => {
    return (
        <Icon size="4xl" viewBox="0 0 24 24" {...props}>
            <G fillRule="nonzero" stroke="none" strokeWidth={1}>
                <Path d="M17.72 13.6016L15.5774 11.6184L17.72 9.63597V13.6016ZM13.9061 14.6694C13.9061 15.0905 13.5644 15.4322 13.1434 15.4322H6.27852C5.85748 15.4322 5.51576 15.0905 5.51576 14.6694V8.56734C5.51576 8.14706 5.85748 7.80458 6.27852 7.80458H13.1434C13.5644 7.80458 13.9061 8.14706 13.9061 8.56734V14.6694ZM18.4919 7.91594C18.0144 7.70771 17.4606 7.79847 17.08 8.14935L15.4317 9.67487V8.56734C15.4317 7.30573 14.405 6.27905 13.1434 6.27905H6.27852C5.01691 6.27905 3.99023 7.30573 3.99023 8.56734V14.6694C3.99023 15.9318 5.01691 16.9577 6.27852 16.9577H13.1434C14.405 16.9577 15.4317 15.9318 15.4317 14.6694V13.5627L17.08 15.0874C17.3241 15.314 17.6406 15.4322 17.9633 15.4322C18.1418 15.4322 18.321 15.3963 18.4919 15.3216C18.9564 15.1187 19.2455 14.6847 19.2455 14.1897V9.04788C19.2455 8.55285 18.9564 8.11883 18.4919 7.91594Z" />
            </G>
        </Icon>
    );
};
