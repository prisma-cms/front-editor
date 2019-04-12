import React from 'react';
import { Controller, Scene } from 'react-scrollmagic';

const App = () => (
  <div>
    <Controller>
      <Scene duration={600} pin>
        <div>Sticky Example</div>
      </Scene>
    </Controller>
  </div>
);

export default App;