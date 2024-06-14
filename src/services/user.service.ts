import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { ObjectId } from 'mongoose';
import { UserDocument, User } from '../models/user.model';

const createUser = async (userBody: CreateUserDTO) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return User.create(userBody);
};

const queryUsers = async (
    filter: { [key: string]: any },
    options: { [key: string]: any }
) => {
    const users = await User.paginate(filter, options);
    return users;
};

const getUserById = async (
    id: string | ObjectId
): Promise<UserDocument | null> => {
    return await User.findById(id);
};

const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
    return await User.findOne({ email });
};

const updateUserById = async (
    userId: string | ObjectId,
    updateBody: UpdateUserDTO
) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (
        updateBody.email &&
        (await User.isEmailTaken(updateBody.email, userId as ObjectId))
    ) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

const deleteUserById = async (userId: string | ObjectId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.deleteOne();
    return user;
};

export default {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
};
