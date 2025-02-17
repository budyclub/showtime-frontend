import { useEffect, useMemo } from "react";
import { Platform, StyleSheet } from "react-native";

import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  withRepeat,
  useAnimatedStyle,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

type SpinnerProps = {
  size?: "large" | "medium" | "small";
  color?: string;
  secondaryColor?: string;
};

const duration = 750;
const defaultSize = 32;

export const Spinner = (props: SpinnerProps) => {
  const isDark = useIsDarkMode();

  const {
    size = "medium",
    color = "#8B5CF6",
    secondaryColor = isDark ? "#3F3F46" : "#F4F4F5",
  } = props;
  const transition = useSharedValue(0);
  let actualSize = defaultSize;

  switch (size) {
    case "large": {
      actualSize = 48;
      break;
    }
    case "medium": {
      actualSize = 32;
      break;
    }
    case "small": {
      actualSize = 24;
      break;
    }
  }

  useEffect(() => {
    transition.value = withRepeat(
      withTiming(360, { duration, easing: Easing.linear }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: transition.value + "deg" }],
    };
  }, []);

  const animationStyle = useMemo(() => {
    return Platform.OS === "web"
      ? StyleSheet.create({
          animation: {
            //@ts-ignore
            animationDuration: duration + "ms",
            animationKeyframes: [
              {
                "0%": { transform: [{ rotate: "0deg" }] },
                "100%": { transform: [{ rotate: "360deg" }] },
              },
            ],
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          },
        }).animation
      : animatedStyle;
  }, [animatedStyle]);

  return (
    <Animated.View
      style={[{ height: actualSize, width: actualSize }, animationStyle]}
      accessibilityRole="progressbar"
    >
      <Svg width={actualSize} height={actualSize} viewBox="0 0 32 32">
        <Circle
          cx={16}
          cy={16}
          fill="none"
          r={14}
          strokeWidth={4}
          stroke={secondaryColor}
        />
        <Circle
          cx={16}
          cy={16}
          fill="none"
          r={14}
          strokeWidth={4}
          stroke={color}
          strokeDasharray={80}
          strokeDashoffset={56}
        />
      </Svg>
    </Animated.View>
  );
};
