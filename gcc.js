import React from 'react';

import Mpg from './components/mpg/Mpg'
import api from './api/Api';
import hooks from './api/Api';
import Lazy from './components/Lazy';

export const ui = Mpg;

export default {
    api,
    hooks,
    Lazy,
    ui,
};