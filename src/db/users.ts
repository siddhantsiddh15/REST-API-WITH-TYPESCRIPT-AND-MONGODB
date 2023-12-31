import mongoose from 'mongoose';

// let's define our schema
const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type: String,
        required : true
    },
    authentication : {
        // we are using select : false because everytime we need to fetch the user using anuy controller we don;t want to use the authentication object by accident. we dont want to give our entire api with authentication data
        password : {
            type : String, required : true, select : false
        },
        salt : {
            type : String, select : false
        },
        sessionToken : {
            type: String, select : false
        }
    }
})

// after definining the schema we need to convert this schema into a model

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => {
    return UserModel.find();
}

// below are the controllers for the operations we will perform
export const getUserByEmail = (email : string) => UserModel.findOne({email});

export const getUserBySessionToken = (sessionToken : string) => {
    return UserModel.findOne({
        'authentication.sessionToken' : sessionToken
    })
}

export const getUserById = (id : string) => {
    return UserModel.findById(id)
}

export const createUser = (values : Record<string, any>) => {
    return new UserModel(values).save().then((user) => user.toObject());
}

export const deleteUserById = (id : string) => UserModel.findOneAndDelete({_id : id});

export const updateUserById = (id : string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);