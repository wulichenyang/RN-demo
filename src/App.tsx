
import { useObserver } from "mobx-react-lite";
import TestView from '@app/components/TestView'
import React from 'react'

const App = () => {

  return useObserver(() => {
    return (
      <TestView></TestView>
    );
  });
};

export default App;
