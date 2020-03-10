import React from 'react';
import {Suspense} from 'react';
import {Spinner} from 'react-bootstrap';

export default props => {

    const {module, ...other} = props
    const spinner = <Spinner animation="grow" variant="secondary"/>

    return (
        <Suspense fallback={spinner}>
          {
            React.createElement(
              React.lazy(() => import('./' + props.module)), 
              other
            )
          }
        </Suspense>
    )
}
