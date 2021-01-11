const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({})
                .select('-__v -password')
                .populate('books');

                return userData;
            }

            throw new AuthenticationError('Not Logged In!');
        }
    },

    Mutation: {
        addUser: async (parent, ars) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },

        login: async(parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user) {
                throw new AuthenticationError('Wrong Username or Password!')
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Wrong Username or Password!')
            }

            const token = signToken(user);
            return {token, user};
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $addToSet: { savedBooks: args.input } },
                    { new: true}
                );

                return updatedUser;
            }

            throw new AuthenticationError('Must be logged in to do this!')
        },

        removeBook: async (parent, args, context) => {
            if(context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('Must be logged in do this!')
        }
    }
};

module.exports = resolvers;