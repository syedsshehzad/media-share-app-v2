'use strict';

import { Parent } from "./Parent.jsx";
import { Banner } from "./Banner.jsx";
var auth = require('../objects/auth');


if (location.href.indexOf("#") > 0 && !auth.isUserSignedIn()) {
    console.log('Not signed in. Access token provided.');
    auth.parseCognitoWebResponse(location.href);
    location.assign(location.pathname);
    console.log('Saved access token. Reloaded page.');
}


ReactDOM.render(<Parent />, document.getElementById('counter'));

ReactDOM.render(<Banner />, document.getElementById('banner'));

