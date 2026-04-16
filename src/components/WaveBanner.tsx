import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View, type LayoutChangeEvent } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ArrivaColors } from '../constants/colors';

const HEIGHT = 50;
const DIAMETER = 24;
const RADIUS = DIAMETER / 2; // 12
const STEP_Y = 11;
const SPEED_MULTIPLIER = 3;

export default function WaveBanner() {
  const [width, setWidth] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 0 -> 1, poi reset: il salto è "multiplo di DIAMETER" quindi non si vede (griglia periodica).
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      })
    ).start();
  }, [progress]);

  const translateX = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SPEED_MULTIPLIER * DIAMETER],
      }),
    [progress]
  );

  const xPositions = useMemo(() => {
    if (width <= 0) return [];
    const startX = -DIAMETER * 2;
    const endX = width + DIAMETER * 2;
    const xs: number[] = [];
    for (let x = startX; x <= endX + 0.0001; x += DIAMETER) xs.push(x);
    return xs;
  }, [width]);

  const svgWidth = width > 0 ? width + DIAMETER * 4 : 300;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const waveXml = useMemo(() => {
    if (width <= 0) return '';

    const circles = xPositions
      .map((x) => {
        const cx = x + DIAMETER * 2; // shift per avere x >= 0
        const y1 = 0 + RADIUS;
        const y2 = STEP_Y + RADIUS;
        const y3 = STEP_Y * 2 + RADIUS;
        const y4 = STEP_Y * 3 + RADIUS;
        return [
          `<circle cx="${cx}" cy="${y1}" r="${RADIUS}" fill="${ArrivaColors.waveRow1}" />`,
          `<circle cx="${cx}" cy="${y2}" r="${RADIUS}" fill="${ArrivaColors.waveRow2}" />`,
          `<circle cx="${cx}" cy="${y3}" r="${RADIUS}" fill="${ArrivaColors.waveRow3}" />`,
          `<circle cx="${cx}" cy="${y4}" r="${RADIUS}" fill="#FFFFFF" />`,
        ].join('');
      })
      .join('');

    const whiteBaseY = RADIUS + STEP_Y * 3;
    const whiteBase = `<rect x="0" y="${whiteBaseY}" width="${svgWidth}" height="${HEIGHT}" fill="#FFFFFF" />`;

    return `<svg width="${svgWidth}" height="${HEIGHT}" viewBox="0 0 ${svgWidth} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">${circles}${whiteBase}</svg>`;
  }, [width, xPositions, svgWidth]);

  return (
    <View onLayout={onLayout} style={{ height: HEIGHT, width: '100%', overflow: 'hidden' }}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <SvgXml xml={waveXml} width={svgWidth} height={HEIGHT} />
      </Animated.View>
    </View>
  );
}

