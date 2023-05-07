import { Box, Divider, Icon, ScrollView, Spacer, Text, View } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";


type Props = {
    value: Number,
} & React.ComponentProps<typeof Box>;

export const ProgessBar = (props: Props) => {
    const { value } = props;

    return (
        <Box height={2} width={'100%'} backgroundColor={'gray.400'} borderRadius={20} marginTop={2} flexDirection={'row'}>
            <Box height={2} width={value.toString() + '%'} backgroundColor={'green.500'} borderRadius={20} ></Box>
            <Divider width={1} height={'100%'} color={'red.900'}></Divider>
            <View alignItems={'center'}
                position={'absolute'}
                left={value.toString() + '%'}>
                <View width={0}
                    height={0}
                    backgroundColor={'#00000000'}
                    borderStyle={'solid'}
                    borderLeftWidth={5}
                    borderRightWidth={5}
                    borderBottomWidth={10}
                    borderLeftColor={'#00000000'}
                    borderRightColor={'#00000000'}
                    borderBottomColor={'gray.400'}
                    top={'2'}
                    position={'absolute'}
                ></View>
                <View width={'20'}
                    height={6}
                    backgroundColor={'gray.400'}
                    position={'absolute'}
                    top='4'

                >
                    <Text alignSelf={'center'}>Today</Text>
                </View>
            </View>
        </Box>


    );
}