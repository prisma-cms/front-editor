

import proxy from "../../setupProxy";

describe('@prisma-cms/tests proxy', () => { 

  it('Proxy test', () => {

    let fakeServer = {
      use: rule => {

      },
    }

    proxy(fakeServer);
 
  });

})
