import { Icon } from 'native-base';
import { CustomIconProps } from '../type';
import { G, Path } from 'react-native-svg';
import React from 'react';

export const PhoneOffIcon = (props: CustomIconProps) => {
    return (
        <Icon size="4xl" viewBox="0 0 27 27" {...props}>
            <G fillRule="nonzero" stroke="none" strokeWidth={1}>
                <Path d="M16.0986 16.3631C16.4075 16.0656 16.8448 15.9487 17.2631 16.0415L24.8449 17.7818C25.2721 17.8797 25.6178 18.1899 25.7602 18.6043C25.8645 18.9031 25.9446 19.2146 25.9954 19.5324C26.0488 19.8476 26.0768 20.1718 26.0768 20.5011C26.0768 23.725 23.4541 26.3477 20.2302 26.3477C15.6956 26.3477 11.5296 24.7853 8.2078 22.1893L10.0219 20.3752C12.8708 22.5186 16.3986 23.8051 20.2302 23.8051C22.0519 23.8051 23.5342 22.3228 23.5342 20.5011C23.5342 20.3587 23.5266 20.2201 23.5075 20.0841L17.6343 18.7353C17.5173 18.959 17.3902 19.2018 17.272 19.4281C16.6935 20.5341 16.2778 21.3376 15.2036 20.9066C13.865 20.4375 12.6191 19.751 11.4737 18.9222L13.2916 17.1042C13.8599 17.4907 14.4586 17.834 15.0866 18.12C15.913 16.5398 15.9168 16.5373 16.0986 16.3631ZM21.6056 3.79659C22.048 3.35418 22.7624 3.35418 23.2036 3.79659C23.646 4.23772 23.646 4.95217 23.2036 5.39457L5.12355 23.4746C4.68242 23.9157 3.9667 23.9157 3.52556 23.4746C3.30563 23.2547 3.19503 22.9648 3.19503 22.6762C3.19503 22.3864 3.30563 22.0978 3.52556 21.8766L21.6056 3.79659ZM6.49892 0.922485C6.83072 0.922485 7.15616 0.951725 7.47271 1.00639C7.78163 1.05597 8.09436 1.13352 8.39692 1.23903C8.81009 1.38141 9.12027 1.72847 9.21816 2.15562L10.9585 9.73747C11.0539 10.1544 10.9344 10.593 10.6369 10.902C10.464 11.0825 10.4589 11.0863 8.88255 11.9126C9.17113 12.5406 9.51437 13.1381 9.89829 13.7051L8.08165 15.5218C7.24515 14.3674 6.55231 13.1063 6.07431 11.7461C5.66496 10.7252 6.46459 10.307 7.57187 9.72857C7.79815 9.60907 8.04097 9.48322 8.26471 9.36626L6.91589 3.49299C6.77605 3.47392 6.63876 3.46503 6.49892 3.46503C4.67719 3.46503 3.19488 4.94733 3.19488 6.77033C3.19488 10.6007 4.48141 14.1297 6.62477 16.9786L4.81067 18.7927C2.21473 15.4696 0.652344 11.3037 0.652344 6.77033C0.652344 3.54639 3.27497 0.922485 6.49892 0.922485Z" />
            </G>
        </Icon>
    );
};
