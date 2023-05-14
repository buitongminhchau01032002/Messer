import { extendTheme, useColorModeValue } from 'native-base';
import { useColorScheme as _useColorScheme } from 'react-native';

export const useBackgroundColor = () => {
    const tabBar = useColorModeValue('warmGray.50', 'coolGray.800');
    const screen = useColorModeValue('warmGray.100', 'coolGray.700');
    return {
        tabBarBackground: tabBar,
        screenBackground: screen,
    };
};

// use for custom and apply native-base theme
export const useCustomNativeBaseColor = () => {
    return extendTheme({
        colors: {
            // Add new color
            primary: {
                50: '#feebef',
                100: '#fed7e0',
                200: '#fdc4d0',
                300: '#Fdb0c0',
                400: '#fc9cb1',
                500: '#fb88A1',
                600: '#fb7492',
                700: '#fa6182',
                800: '#f9446b',
                900: '#f93963',
            },
            blue: {
                50: '#9acefe',
                100: '#86c4fe',
                200: '#72bafe',
                300: '#5db0fd',
                400: '#49a6fd',
                500: '#359cfd',
                600: '#2192fd',
                700: '#0d89fd',
                800: '#027ef2',
                900: '#0273DD',
            },
            green: {
                50: '#cdf4e9  ',
                100: '#bcf1e2',
                200: '#abedda',
                300: '#9aead3',
                400: '#89e6cc',
                500: '#78e2c4',
                600: '#68dfbd',
                700: '#57dbb6',
                800: '#46d8ae',
                900: '#2BCEA0',
            },
            yellow: {
                50: '#fff0d6  ',
                100: '#ffe9c2',
                200: '#ffe1ad',
                300: '#ffda99',
                400: '#ffd285',
                500: '#ffcb70',
                600: '#ffc35c',
                700: '#ffbc47',
                800: '#ffb433',
                900: '#ffab1c',
            },
        },
        fonts: {
            heading: 'Poppins',
            body: 'Poppins',
            mono: 'Poppins',
        },
        config: {
            // Changing initialColorMode to 'dark'
            // initialColorMode: 'dark',
        },
    });
};
