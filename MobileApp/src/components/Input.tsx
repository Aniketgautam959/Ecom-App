import { Text, TextInput, View } from "react-native";
import { styles } from "../styles";

export function Input({
  label,
  error,
  ...props
}: {
  label?: string;
  error?: string;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.formGroup}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        {...props}
        style={[styles.input, props.multiline && styles.textarea, error && styles.inputError, props.style]}
        placeholderTextColor="#9CA3AF"
      />
      {error && <Text style={{ fontSize: 12, color: "#EF4444" }}>{error}</Text>}
    </View>
  );
}
