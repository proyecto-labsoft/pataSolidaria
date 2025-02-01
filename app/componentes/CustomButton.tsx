import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

type CustomButtonProps = { label: string };
export const CustomButton: FC<CustomButtonProps> = ({ label }) => {
  return (
    <View style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: theme.colors.primary,
    height: 46,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
