import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, unique: true, required: true, minlength: 4 },
  password: { type: String, required: true },
  firstName: { type: String, required: true, minlength: 2 },
  lastName: { type: String, required: true, minlength: 2 },
});

const UserModel = model('User', UserSchema);

export default UserModel;
