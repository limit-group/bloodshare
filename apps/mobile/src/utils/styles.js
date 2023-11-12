import { StatusBar, StyleSheet } from "react-native";

export default StyleSheet.create({
  primary: {
    color: "#d0312d",
  },
  rounded: {
    marginTop: 23,
    marginBottom: 10,
  },
  avatar: {
    height: 50,
    width: 50,
    alignSelf: "center",
    margin: 20,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {},
  logo: {
    flex: 1,
    height: 150,
    width: "100%",
    alignSelf: "center",
    objectFit: "cover",
    margin: 33,
  },
  affix: {
    fontWeight: "bold",
    color: "#000",
  },
  left: {
    textAlign: "right",
    marginRight: 30,
    fontSize: 16,
    color: "#fc7d7b",
  },
  input: {
    backgroundColor: "white",
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: "#fc7d7b",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  i_button: {
    backgroundColor: "#fc7d7b",
    marginLeft: 30,
    height: 38,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  pickButton: {
    backgroundColor: "white",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    color: "#000",
    height: 48,
    borderRadius: 5,
    borderColor: "#000",
    border: 2,
  },
  i_buttonTitle: {
    color: "white",
    fontSize: 16,
    padding: 10,
    fontWeight: "bold",
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickButtonTitle: {
    fontSize: 16,
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 16,
    marginLeft: 30,
  },
  footerLink: {
    color: "#fc7d7b",
    fontWeight: "bold",
    fontSize: 16,
  },
});
