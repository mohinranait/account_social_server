const { Schema, model, Types, } = require('mongoose');

const socialSchema = new Schema({
    type: {
        type: String,
    },
    url: {
        type: String,
    },
    status: {
        type: String,
        default: 'Public', // Public, Onlyme, Friends
    },
}, { timestamps: true })

const userSchema = new Schema({
    name: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            minlength: 2,
        },
        lastName: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        status: {
            type: String,
            default: 'Public', // Public, Onlyme, Friends
        },
        validate: {
            validator: (value) => {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
            },
            message: (props) => `The "${props?.value}" is not valid email`
        }
    },

    defaultPhone: {
        type: String,
        status: {
            type: String,
            default: 'Public', // Public, Onlyme, Friends
        }
    },
    phones: [
        {
            phone: String,
            isVarified: Boolean,
            status: {
                type: String,
                default: 'Public', // Public, Onlyme, Friends
            }
        }
    ],

    password: {
        type: String,
        require: [true, "Password is required"],
        trim: true,
        minlength: [6, "Password minimum 6 charecters"]
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
        ref: 'Media'
    },
    coverImage: {
        type: Types.ObjectId,
        ref: 'Media'
    },
    profileUrl: String,
    userStatus: {
        type: String,
        default: 'Active',
        enum: ['Active', "Pending", "Block", "Suspend"]
    },
    website: {
        type: Array,
    },
    profileTitle: {
        type: String,
        status: {
            type: String,
            default: 'Public', // Public, Onlyme, Friends
        }
    },
    birthday: {
        month: {
            type: String,
            required: [true, "Month is required"],
            status: {
                type: String,
                default: 'Public', // Public, Onlyme, Friends
            }
        },
        year: {
            type: String,
            required: [true, "Year is required"],
            status: {
                type: String,
                default: 'Public', // Public, Onlyme, Friends
            }
        },
        day: {
            type: String,
            required: [true, "Day is required"],
            status: {
                type: String,
                default: 'Public', // Public, Onlyme, Friends
            }
        },
        date: {
            type: String,
            status: {
                type: String,
                default: 'Public', // Public, Onlyme, Friends
            },
        },
    },
    homeTown: {
        value: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            default: 'Public', // Public, Onlyme, Friends
        },
    },
    currentCity: {
        value: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            default: 'Public', // Public, Onlyme, Friends
        },
    },
    isMarried: {
        type: String,
        default: "Single",
        enum: ['Single', 'Married', 'Ralation'],
        status: {
            type: String,
            default: 'Public', // Public, Onlyme, Friends
        },
    },
    isRelation: {
        relationType: {
            type: String,
            default: "Single",
            enum: ['Single', 'Married', 'Ralation'],
        },
        withRelation: {
            type: Types.ObjectId,
            default: null,
            ref: 'User',
        },
        year: {
            type: String,
        },
        month: {
            type: String,
        },
        day: {
            type: String,
        },
        status: {
            type: String,
            default: 'Public', // Public, Onlyme, Friends
        },
    },
    socialMedia: {
        type: [socialSchema],
    },
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