import mongoose, {
    Document,
    Model,
    ObjectId,
    Schema,
    HydratedDocument,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { roles } from '../config/roles';
import toJSON from './plugins/toJSON.plugin';
import paginate from './plugins/paginate.plugin';

interface UserDocument extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: string;
    isEmailVerified: boolean;
    isPasswordMatch(password: string): Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {
    isEmailTaken(email: string, excludeUserId?: ObjectId): Promise<boolean>;
    paginate: Function;
}

const userSchemaDefinition = {
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
            validator: (value: string) =>
                /\d/.test(value) && /[a-zA-Z]/.test(value),
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
};

const userSchema = new Schema<UserDocument, UserModel>(userSchemaDefinition, {
    timestamps: true,
});

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (
    email: string,
    excludeUserId?: ObjectId
): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.methods.isPasswordMatch = async function (
    this: HydratedDocument<UserDocument>,
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
    const user = this as HydratedDocument<UserDocument>;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User, UserDocument };
