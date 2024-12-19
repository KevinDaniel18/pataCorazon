import React, { useState, useEffect } from "react";
import {
  Canvas,
  Image as SkiaImage,
  Blur,
  useImage,
} from "@shopify/react-native-skia";

interface BlurredBackgroundProps {
  imageUri: string;
  width: number;
  height: number;
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({
  imageUri,
  width,
  height,
}) => {
  const image = useImage(imageUri);
  const [blur, setBlur] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlur((prevBlur) => Math.sin(Date.now() / 1000) * 5 + 10);
    }, 16); // 60 FPS

    return () => clearInterval(interval);
  }, []);

  if (!image) {
    return null;
  }

  return (
    <Canvas style={{ width, height }}>
      <SkiaImage
        image={image}
        fit="cover"
        x={0}
        y={0}
        width={width}
        height={height}
      >
        <Blur blur={blur} />
      </SkiaImage>
    </Canvas>
  );
};
