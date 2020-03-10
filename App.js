import React  from 'react';
import {ui} from './gcc';

import logo from './content/logo.svg';
import Fencing from './Fencing';

const App = (props) => {

  // This could also be injected by redux at this level
  const state = {
    selectedStore: {
      name: 'Cumberland',
    }
  }

  // This can be controlled by router switch
  const component = <Fencing state={state} />

  // DO NOT CHANGE BELOW
  
  return (
    <ui.ProfileLayout 
      header={<img src={logo} className="App-logo" alt="logo" />}
      main={component}
      aside={<div id="sidePanel" />}
    />
  );
}

export default App;

