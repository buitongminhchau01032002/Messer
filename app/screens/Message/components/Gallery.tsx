import { FontAwesome } from '@expo/vector-icons';
import { APP_PADDING } from 'app/constants/Layout';
import { AutoResizeImage } from 'components/AutoResizeImage';
import { CButton } from 'components/Button';
import { API_URL } from 'config/config.base';
import { StatusBar } from 'expo-status-bar';
import { VStack, Text, Box, Pressable, CloseIcon, Button, HStack, Input, Icon, Center, Image } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, LayoutChangeEvent, Modal } from 'react-native';
import { waitAsyncAction } from 'utils/async';
import { Media } from '../type';
import { ResizeMode, Video } from 'expo-av';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onOK?: (value?: string) => void;
    onCancel?: () => void;
    images: Media[];
    initIndex?: number;
} & React.ComponentProps<typeof Modal>;

const IMAGE_SIZE = 80;
const SPACE = 0;
const { width: sWidth, height: sHeight } = Dimensions.get('screen');
export const Gallery = (props: Props) => {
    const { isOpen, images, initIndex = 0, onClose } = props;
    const [imageHeight, setImageHeight] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const topRef = useRef<FlatList<Media> | null>(null);

    const thumbRef = useRef<FlatList<Media> | null>(null);
    const [thumbWidth, setThumbWidth] = useState(0);
    const [isThumbCenter, setIsThumbCenter] = useState(false);

    const onLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setImageHeight(height);
    };
    const onThumbLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setThumbWidth(width);
        setIsThumbCenter(width < sWidth);
    };

    const handleChangeActiveIndex = (index: number, animated: boolean = true) => {
        setActiveIndex(index);
        topRef.current?.scrollToIndex({ animated: animated, index });
        if (index * (IMAGE_SIZE + SPACE) - IMAGE_SIZE / 2 > sWidth / 2) {
            thumbRef.current?.scrollToOffset({
                animated: animated,
                offset: index * (IMAGE_SIZE + SPACE) - sWidth / 2 + IMAGE_SIZE,
            });
        } else {
            thumbRef.current?.scrollToOffset({ animated: animated, offset: 0 });
        }
    };

    useEffect(() => {
        handleChangeActiveIndex(initIndex);
    }, [isOpen]);

    return (
        <Modal
            animationType="slide"
            statusBarTranslucent
            transparent={false}
            visible={isOpen}
            onRequestClose={() => {
                onClose();
            }}
        >
            <Box flex={1} position="relative" bg="black">
                <HStack position="absolute" top={12} left={APP_PADDING} zIndex={1}>
                    <Pressable onPress={onClose} borderRadius={100} overflow="hidden">
                        <Box padding={APP_PADDING} bg="gray.100">
                            <CloseIcon />
                        </Box>
                        <HStack flex={1}></HStack>
                    </Pressable>
                </HStack>
                <FlatList
                    initialScrollIndex={initIndex}
                    pagingEnabled
                    horizontal
                    ref={topRef}
                    onMomentumScrollEnd={(e) => {
                        handleChangeActiveIndex(Math.round(e.nativeEvent.contentOffset.x / sWidth));
                    }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        transform: [{ translateY: -imageHeight / 2 }],
                    }}
                    data={images.map((img, idx) => ({ ...img, id: idx }))}
                    // data={images}
                    onScrollToIndexFailed={async (info) => {
                        await waitAsyncAction(500);
                        handleChangeActiveIndex(info.index, false);
                    }}
                    keyExtractor={(img) => img.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    onLayout={onLayout}
                    renderItem={({ item }) => (
                        <Center>
                            {item.type === 'image' ? (
                                <AutoResizeImage
                                    uri={item.url}
                                    dimentions={{
                                        width: sWidth,
                                    }}
                                />
                            ) : (
                                <Video
                                    style={{ width: sWidth }}
                                    source={{
                                        uri: item.url,
                                    }}
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                />
                            )}
                        </Center>
                    )}
                />
                <FlatList
                    horizontal
                    ref={thumbRef}
                    initialScrollIndex={initIndex}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: isThumbCenter ? '50%' : 0,
                        transform: [{ translateX: -(thumbWidth - SPACE) / 2 }],
                    }}
                    data={images.map((img, idx) => ({ ...img, id: idx }))}
                    showsHorizontalScrollIndicator={false}
                    // contentContainerStyle={{ paddingHorizontal: SPACE }}
                    onScrollToIndexFailed={async (info) => {
                        await waitAsyncAction(500);
                        handleChangeActiveIndex(info.index);
                    }}
                    onLayout={onThumbLayout}
                    keyExtractor={(img) => img.id.toString()}
                    renderItem={({ item, index }) => (
                        <Center>
                            <Pressable
                                style={{ marginRight: SPACE }}
                                borderRadius="md"
                                overflow="hidden"
                                onPress={() => handleChangeActiveIndex(index)}
                                borderWidth={2}
                                borderColor={index === activeIndex ? 'primary.900' : 'transparent'}
                            >
                                <Image
                                    alt="..."
                                    source={{ uri: item.url }}
                                    style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
                                />
                            </Pressable>
                        </Center>
                    )}
                />
            </Box>
        </Modal>
    );
};
