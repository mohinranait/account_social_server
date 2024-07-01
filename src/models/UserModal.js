const { Schema, model, Types, } = require('mongoose');

const userSchema = new Schema({
    name: {
        firstName: {
            type: String,
            require: true,
        },
        lastName: {
            type: String,
            require: true,
        },
        fullName: {
            type: String,
            require: true,
        },
    },

    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        status: {
            type: String,
            default: 'public', // Public, Onlyme, Friends
        }
    },
    defaultPhone: {
        type: String,
        status: {
            type: String,
            default: 'public', // Public, Onlyme, Friends
        }
    },
    phones: [
        {
            phone: String,
            isVarified: Boolean,
            status: {
                type: String,
                default: 'public', // Public, Onlyme, Friends
            }
        }
    ],

    password: {
        type: String,
        require: true,
        trim: true,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', "Admin", "Manager"]
    },
    gender: {
        type: String,
        default: "Male",
        enum: ["Male", 'Female', "Others"]
    },
    profileImage: {
        type: Types.ObjectId,
        ref: 'FileType'
    },
    coverImage: {
        type: Types.ObjectId,
        ref: 'FileType'
    },
    profileUrl: String,
    userStatus: {
        type: String,
        default: 'Active',
        enum: ['Active', "Pending", "Block", "Suspend"]
    },
    website: String,
    profileTitle: {
        type: String,
        status: {
            type: String,
            default: 'public', // Public, Onlyme, Friends
        }
    },
    birthday: {
        month: {
            type: String,
            status: {
                type: String,
                default: 'public', // Public, Onlyme, Friends
            }
        },
        year: {
            type: String,
            status: {
                type: String,
                default: 'public', // Public, Onlyme, Friends
            }
        },
        day: {
            type: String,
            status: {
                type: String,
                default: 'public', // Public, Onlyme, Friends
            }
        },
        date: {
            type: String,
            status: {
                type: String,
                default: 'public', // Public, Onlyme, Friends
            },
        },
    },
    homeTown: {
        type: String,
        status: {
            type: String,
            default: 'public', // Public, Onlyme, Friends
        },
    },
    currentCity: {
        type: String,
        status: {
            type: String,
            default: 'public', // Public, Onlyme, Friends
        },
    },
    isMarried: {
        type: String,
        default: "Unmarried",
        enum: ['Unmarried', 'Married', 'Ralation'],
        status: {
            type: String,
            default: 'public', // Public, Onlyme, Friends
        },
    },
    socialMedia: [
        {
            type: String,
            url: String,
            status: {
                type: String,
                default: 'public', // Public, Onlyme, Friends
            },
        }
    ],
    followrs: {
        type: Array,
        default: [],
    },
    folloing: {
        type: Array,
        default: []
    },
}, { timestamps: true })


const User = model("User", userSchema);
module.exports = User;