import { Icon } from 'native-base';
import { CustomIconProps } from '../type';
import { G, Path } from 'react-native-svg';
import React from 'react';

export const PlusIcon = (props: CustomIconProps) => {
    return (
        <Icon size="4xl" viewBox="0 0 17 17" {...props}>
            <G fillRule="nonzero" stroke="none" strokeWidth={1}>
                <Path d="M15.292 7.66538H9.57131V1.94466C9.57131 1.4174 9.14416 0.991211 8.61786 0.991211C8.09155 0.991211 7.6644 1.4174 7.6644 1.94466V7.66538H1.94369C1.41738 7.66538 0.990234 8.09157 0.990234 8.61883C0.990234 9.14609 1.41738 9.57228 1.94369 9.57228H7.6644V15.293C7.6644 15.8203 8.09155 16.2465 8.61786 16.2465C9.14416 16.2465 9.57131 15.8203 9.57131 15.293V9.57228H15.292C15.8183 9.57228 16.2455 9.14609 16.2455 8.61883C16.2455 8.09157 15.8183 7.66538 15.292 7.66538Z" />
            </G>
        </Icon>
    );
};
