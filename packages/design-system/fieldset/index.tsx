import { MutableRefObject, ComponentType } from "react";
import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useId } from "@showtime-xyz/universal.input";
import { Label } from "@showtime-xyz/universal.label";
import { Select } from "@showtime-xyz/universal.select";
import type { SelectProps } from "@showtime-xyz/universal.select";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { TextInput, TextInputProps } from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

type FieldsetProps = {
  errorText?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  tw?: string;
  select?: SelectProps;
  selectOnly?: boolean;
  leftElement?: React.ReactNode;
  Component?: ComponentType;
  componentRef?: MutableRefObject<ComponentType | undefined>;
} & TextInputProps;

export function Fieldset(props: FieldsetProps) {
  const {
    errorText,
    accessibilityLabel,
    helperText,
    label,
    disabled,
    select,
    tw: twProp = "",
    leftElement,
    selectOnly,
    Component = TextInput,
    ...textInputProps
  } = props;
  let style = "bg-gray-100 dark:bg-gray-900";
  if (disabled) {
    style += " opacity-40";
  }
  const isDark = useIsDarkMode();
  const inputId = useId();
  const helperTextId = useId();
  const errorTextId = useId();

  return (
    <View tw={`rounded-4 p-4 ${style} ${twProp}`}>
      <Label htmlFor={inputId} tw="font-bold text-gray-900 dark:text-white">
        {label}
      </Label>
      <View tw="mt-4 flex-row items-center">
        {leftElement}
        {!selectOnly ? (
          <Component
            tw="flex-1 text-base text-black focus-visible:ring-1 dark:text-white"
            //@ts-ignore - web only
            style={Platform.select({
              web: { outline: "none" },
              default: undefined,
            })}
            editable={disabled}
            nativeID={inputId}
            accessibilityLabel={accessibilityLabel}
            multiline={textInputProps.multiline ?? true}
            numberOfLines={textInputProps.numberOfLines ?? 1}
            blurOnSubmit={textInputProps.blurOnSubmit ?? true}
            textAlignVertical="bottom"
            placeholderTextColor={
              isDark ? tw.color("gray-400") : tw.color("gray-600")
            }
            selectionColor={
              isDark ? tw.color("gray-300") : tw.color("gray-700")
            }
            //@ts-ignore - web only
            accessibilityDescribedBy={Platform.select({
              web: helperText ? helperTextId : undefined,
              default: undefined,
            })}
            accessibilityErrorMessage={Platform.select({
              web: errorText ? errorTextId : undefined,
              default: undefined,
            })}
            accessibilityInvalid={Platform.select({
              web: errorText ? true : false,
              default: undefined,
            })}
            {...textInputProps}
          />
        ) : null}

        {select ? (
          <Select disabled={disabled} size="small" {...select} />
        ) : null}
      </View>
      {errorText ? (
        <ErrorText nativeID={errorTextId}>{errorText}</ErrorText>
      ) : null}
      {helperText ? (
        <>
          <View tw="mt-4 h-[1px] w-full bg-gray-200 dark:bg-gray-800" />
          <View tw="h-4" />
          <Text
            nativeID={helperTextId}
            tw="text-sm text-gray-700 dark:text-gray-300"
          >
            {helperText}
          </Text>
        </>
      ) : null}
    </View>
  );
}

export const ErrorText = ({
  children,
  nativeID,
}: {
  children: string;
  nativeID?: string;
}) => {
  return (
    <>
      <View tw="h-4" />
      <Text nativeID={nativeID} tw="text-sm font-semibold text-red-500">
        {children}
      </Text>
    </>
  );
};
