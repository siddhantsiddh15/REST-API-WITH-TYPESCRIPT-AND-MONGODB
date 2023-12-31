import express from 'express';

import { createUser, getUserByEmail } from '../db/users'
import { authentication, random } from '../helpers/index';


//login controller
export const login = async (req: express.Request, res : express.Response) : Promise<any>=> {
    try{
        const {email , password} = req.body;

        if(!(email || password)){
            return res.status(400).send('>>>Invalid user and password');
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password'); // +authentication.salt +authentication.password is very important else you won't be able to access the user.authentication.salt

        if(!user){
            return res.status(400).send('>>>>>USER doesn\'t exist')
        }


        const expectedHash = authentication(user.authentication.salt, password);

        if(user.authentication.password !== expectedHash){
            return res.status(403).send('>>>>>Username or Password is incorrect')
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('TEST', user.authentication.sessionToken, {
            domain : 'localhost',
            path :'/'
        })

        return res.status(200).json(user).end();


    }catch(err){
        console.log('>>>>>>>>Error in login controller');
        return res.status(400).send('>>>>>Error in login')
    }
}

export const register = async (req : express.Request, res : express.Response) => {
    try{
        const {email, password, username} = req.body;

        if(!(email || password || username)){
            return res.status(400).send('>>>>>>>> Email or Password or Username is undefined')
        }

        const existingUser = await getUserByEmail(email);

        if(existingUser){
            return res.status(400).send('>>>>>>>>>>. USER exists already >>>>>>>>>>>>>>>')
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication : {
                salt, 
                password : authentication(salt, password)
            }
        });

        return res.status(200).json(user).end();

    }catch(err){
        console.log(err);
        return res.status(400).send('>>>>>>>> Something went wrong in authentication >>>>>>>>>>>')
    }
}