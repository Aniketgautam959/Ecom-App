import { ActivityIndicator, Pressable, Text } from "react-native";
import { colors, styles } from "../styles";

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "text";
  loading?: boolean;
  disabled?: boolean;
}) {
  const buttonStyle =
    variant === "primary" ? styles.primaryButton : variant === "secondary" ? styles.secondaryButton : styles.textButton;
  const textStyle =
    variant === "primary"
      ? styles.primaryButtonText
      : variant === "secondary"
      ? styles.secondaryButtonText
      : styles.textButtonText;

  return (
    <Pressable style={buttonStyle} onPress={onPress} disabled={disabled || loading}>
      {loading ? <ActivityIndicator color={variant === "primary" ? "#fff" : colors.primary} /> : <Text style={textStyle}>{title}</Text>}
    </Pressable>
  );
}
