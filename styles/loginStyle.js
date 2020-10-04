/* style for login and sign up page */
import {StyleSheet} from 'react-native';

const loginStyle = StyleSheet.create({
  layout: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
  },
  header: {
    marginTop: 5,
    marginBottom: 35,
    fontFamily: 'Karla-Bold',
  },
  login: {
    marginTop: 20,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    marginTop: 10,
    textAlign: 'right',
  },
  divider: {
    marginTop: 20,
    borderColor: 'black',
    borderWidth: 0.2,
    opacity: 0.2,
  },
  signupLink: {
    marginTop: 10,
    textAlign: 'center',
  },
  touchableLink: {
    width: '80%',
    alignSelf: 'center',
  },
});

export default loginStyle;
