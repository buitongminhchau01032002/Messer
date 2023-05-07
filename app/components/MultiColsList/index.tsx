import { AspectRatio, Box, Button, HStack, VStack } from 'native-base';
import React from 'react';

type Props<T> = {
    wrapperProps?: React.ComponentProps<typeof VStack>;
    data: T[];
    numOfCols?: number;
    space?: number;
    renderItem: (item?: T) => React.ReactNode;
};

export function MultiColsList<T>({ wrapperProps, data, numOfCols = 1, space = 1, renderItem }: Props<T>) {
    const listRows = [];
    for (let i = 0; i < data.length; i += numOfCols) {
        const newRow = [];
        for (let j = 0; j < numOfCols; j++) {
            if (i + j < data.length) {
                newRow.push(data[i + j]);
            } else {
                newRow.push(undefined);
            }
        }
        if (newRow.length) listRows.push(newRow);
    }

    return (
        <VStack space={space} {...wrapperProps}>
            {listRows.map((row, idx) => (
                <HStack key={idx} space={space}>
                    {row.map((col, _idx) => (
                        <HStack flex={1} key={_idx}>
                            <AspectRatio ratio={1} w="full">
                                <Box bg="white" h="full" w="full">
                                    {renderItem(col)}
                                </Box>
                            </AspectRatio>
                        </HStack>
                    ))}
                </HStack>
            ))}
        </VStack>
    );
}
