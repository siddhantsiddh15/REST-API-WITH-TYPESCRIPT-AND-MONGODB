import express from 'express';

import authentication from './authentication';
import users from './user';


const router = express.Router();

export default ():express.Router => {
    authentication(router);
    users(router)
    return router
}

// () : express.Router means the default function return type is a express.Router. That is why the function is returning a router