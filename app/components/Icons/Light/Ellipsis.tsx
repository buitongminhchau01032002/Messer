import { Icon } from 'native-base';
import { CustomIconProps } from '../type';
import { G, Path } from 'react-native-svg';
import React from 'react';

export const EllipsisIcon = (props: CustomIconProps) => {
    return (
        <Icon size="4xl" viewBox="0 0 17 4" {...props}>
            <G fillRule="nonzero" stroke="none" strokeWidth={1}>
                <Path d="M8.61786 0.304932C9.55351 0.304932 10.3129 1.0643 10.3129 1.99996C10.3129 2.93561 9.55351 3.69499 8.61786 3.69499C7.6822 3.69499 6.92283 2.93561 6.92283 1.99996C6.92283 1.0643 7.6822 0.304932 8.61786 0.304932ZM14.5505 0.304932C15.4861 0.304932 16.2455 1.0643 16.2455 1.99996C16.2455 2.93561 15.4861 3.69499 14.5505 3.69499C13.6148 3.69499 12.8554 2.93561 12.8554 1.99996C12.8554 1.0643 13.6148 0.304932 14.5505 0.304932ZM2.68526 0.304932C3.62092 0.304932 4.38029 1.0643 4.38029 1.99996C4.38029 2.93561 3.62092 3.69499 2.68526 3.69499C1.74961 3.69499 0.990234 2.93561 0.990234 1.99996C0.990234 1.0643 1.74961 0.304932 2.68526 0.304932Z" />
            </G>
        </Icon>
    );
};