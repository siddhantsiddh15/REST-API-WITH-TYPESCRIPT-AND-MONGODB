import express from 'express';

import {deleteUserById, getUserById, getUsers} from '../db/users';

export const getAllUsers = async (req : express.Request, res : express.Response) => {
    try{
        const user = await getUsers();

        return res.status(200).json(user)
    }catch(err){
        console.log('>>>>>>>>>>>>Error in getAllUsers ',err)
    }
}

export const deleteUser = async (req : express.Request, res : express.Response) => {
    try{
        const {id} = req.params;

        const deleteUser = await deleteUserById(id);

        if(!deleteUser){
            return res.status(404).send('NO SUCH USER EXISTS')
        }
        return res.json(deleteUser);
    }catch(err){
        console.log('>>>>>>>>error in delete user', err);
        return res.status(400).send('Could not delete user')
    }
}


export const updateUser = async (req : express.Request, res : express.Response) => {
    try{
        const {id} = req.params
        const {username} = req.body;

        if(!username){
            return res.status(400).send('>>>>Invalid user name')
        }
        const user = await getUserById(id);
        user.username = username
        await user.save();

        return res.status(200).json(user).end();

    }catch(err){
        console.log('>>>>>.error in update user');
        return res.status(400).send('COULD NOT UPDATE USER');
    }
}