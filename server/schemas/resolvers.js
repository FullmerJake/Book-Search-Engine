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

        },

        login: async(parent, {email, password}) => {

        },

        saveBook: async (parent, args, context) => {

        },

        removeBook: async (parent, args, context) => {

        }
    }
};

module.exports = resolvers;