import React, { useEffect, useState } from "react";
import { Image, ImageSourcePropType } from "react-native";
type Props = {
  uri?: string;
  localImage?: ImageSourcePropType;
  dimentions: {
    width?: number;
    height?: number;
  };
} & React.ComponentProps<typeof Image>;
export const AutoResizeImage = (props: Props) => {
  const { uri, localImage, dimentions, ...iProps } = props;

  const [imgWidth, setImgWidth] = useState<number | undefined>(
    dimentions.width
  );
  const [imgHeight, setImgHeight] = useState<number | undefined>(
    dimentions.height
  );

  useEffect(() => {
    if (localImage) {
      const size = Image.resolveAssetSource(localImage);
      if (imgWidth && !imgHeight) {
        setImgHeight(size.height * (imgWidth / size.width));
      } else if (!imgWidth && imgHeight) {
        setImgWidth(size.width * (imgHeight / size.height));
      } else {
        setImgWidth(size.width);
        setImgHeight(size.height);
      }
    } else {
      Image.getSize(uri!, (width, height) => {
        if (imgWidth && !imgHeight) {
          setImgHeight(height * (imgWidth / width));
        } else if (!imgWidth && imgHeight) {
          setImgWidth(width * (imgHeight / height));
        } else {
          setImgWidth(width);
          setImgHeight(height);
        }
      });
    }
  }, []);
  return (
    <Image
      style={{ width: imgWidth, height: imgHeight }}
      source={localImage ? localImage : { uri: uri }}
      {...iProps}
    ></Image>
  );
};
