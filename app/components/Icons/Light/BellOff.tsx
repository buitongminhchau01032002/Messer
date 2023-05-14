import { Icon } from 'native-base';
import { CustomIconProps } from '../type';
import { G, Path } from 'react-native-svg';
import React from 'react';

export const BellOffIcon = (props: CustomIconProps) => {
    return (
        <Icon size="4xl" viewBox="0 0 15 17" {...props}>
            <G fillRule="nonzero" stroke="none" strokeWidth={1}>
                <Path d="M14.2604 14.1809L13.2688 13.1893L11.7486 11.6691L4.48105 4.40077L3.36284 3.28332L2.05622 1.97671C1.75798 1.67847 1.27592 1.67847 0.977679 1.97671C0.679439 2.27495 0.679439 2.75702 0.977679 3.05526L2.68474 4.76308L4.0211 6.09868L9.59155 11.6691L9.64418 11.7218L10.6701 12.7477L11.1171 13.1947L13.1819 15.2595C13.3306 15.4082 13.5259 15.4829 13.7211 15.4829C13.9164 15.4829 14.1117 15.4082 14.2604 15.2595C14.5587 14.9612 14.5587 14.4791 14.2604 14.1809V14.1809ZM9.14457 13.4548V13.1947H6.09352V13.4548C6.09352 14.1405 6.79222 14.7202 7.61905 14.7202C8.44588 14.7202 9.14457 14.1405 9.14457 13.4548V13.4548ZM10.0385 13.1947L10.6327 13.7896C10.4504 15.1694 9.17661 16.2457 7.61905 16.2457C5.9364 16.2457 4.568 14.994 4.568 13.4548V13.1947H2.00283C1.49636 13.1947 1.04404 12.8926 0.849535 12.4243C0.655794 11.9567 0.761818 11.4235 1.11879 11.065L2.49252 9.689L2.49329 6.12156C2.49329 5.9713 2.50473 5.82256 2.51693 5.67382L4.01881 7.17494V9.689C4.01881 10.0963 3.86016 10.4792 3.57183 10.7675L2.67254 11.6691H8.51301L9.16669 12.3228L10.0385 13.1947ZM4.92497 3.76692L3.83194 2.67388C3.96313 2.52971 4.10195 2.39165 4.24993 2.26199C5.36051 1.2887 6.83798 0.84096 8.30477 1.03623C10.8364 1.37108 12.7448 3.62657 12.7448 6.28174V9.689L14.1178 11.065C14.4755 11.4228 14.5815 11.9567 14.387 12.425C14.31 12.6096 14.1857 12.7584 14.0415 12.8827L11.2917 10.1337C11.249 9.99105 11.2193 9.84308 11.2193 9.689V6.28174C11.2193 4.38857 9.88064 2.78371 8.10569 2.54802C7.05613 2.40996 6.04623 2.71507 5.25449 3.40918C5.13092 3.51749 5.031 3.64487 4.92497 3.76692V3.76692Z" />
            </G>
        </Icon>
    );
};
