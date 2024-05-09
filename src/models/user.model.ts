import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { roles } from '../config/roles';
// import { toJSON, paginate } from './plugins';
import { IUser } from '../types/user';

type UserDocument = Document & {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
};

const UserSchema = new Schema(
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

// add plugin that converts mongoose to json
// UserSchema.plugin(toJSON);
// UserSchema.plugin(paginate);

UserSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

UserSchema.methods.isPasswordMatch = async function (this: IUser, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre<IUser>('save', async function (next) {
  const user = this as mongoose.Document & IUser;
  if (user.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', UserSchema);

export { User, UserDocument };
