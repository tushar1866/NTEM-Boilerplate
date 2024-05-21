import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { roles } from '../config/roles';
import { toJSON, paginate } from './plugins';
import { IUser } from '../types/user';

type UserDocument = Document & {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  isPasswordMatch(password: string): Promise<boolean>;
};

interface UserModel extends Model<UserDocument> {
  isEmailTaken(email: string, excludeUserId?: ObjectId): Promise<boolean>;
  paginate: Function;
}

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Invalid email',
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate: {
        validator: (value: string) => /\d/.test(value) && /[a-zA-Z]/.test(value),
        message: 'Password must contain at least one letter and one number',
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

UserSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

UserSchema.methods.isPasswordMatch = async function (this: IUser, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre<UserDocument>('save', async function (next) {
  const user = this as UserDocument;
  if (user.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User: UserModel = mongoose.model<UserDocument, UserModel>('User', UserSchema);

export { User, UserDocument };
