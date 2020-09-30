import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {AppNavigator} from './navigation';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

const strictTheme = {['text-font-family']: 'Karla-Regular'}; // default font
const customMapping = {strict: strictTheme};

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <React.Fragment>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider
            {...eva}
            theme={eva.light}
            customMapping={customMapping}>
            <AppNavigator />
          </ApplicationProvider>
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
