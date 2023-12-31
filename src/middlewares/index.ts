import express from 'express';
import {get, merge} from 'lodash';

import { getUserBySessionToken } from '../db/users'

export const isAuthenticated = async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try{
        const sessionToken = req.cookies['TEST'];

        if(!sessionToken){
            return res.status(403).send('>>>>>>NO SESSION FOUND. LOGIN FIRST')
        };

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
            return res.status(403).send('NO SUCH USER EXISTS')
        }

        merge(req, {identity : existingUser});

        return next()
    }catch(err){
        console.log(err);
        return res.status(400).send('>>>>>>error in is Autheticated')
    }
}

// THIS MIDDLEWARE WILL MAKE SURE WE DON'T DELETE ANOTHER ENTRY
export const isOwner = async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try{
        const {id} = req.params;

        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            return res.status(400).send('No such user exists');

        }
        if(currentUserId.toString() !== id){
            return res.status(403).send('YOU ARE NOT AUTHORIZED FOR THIS OPERATION')
        }

        next();
    }catch(err){
        console.log('>>>>>>>>.error in isOwner middleware', err)
    }
}
