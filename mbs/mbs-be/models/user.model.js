const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        unique: true,
        required: 'This field is required.'
    },
    password: {
        type: String,
        required: 'This field is required.'
    },
    personalCode: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    _token: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.model('User', userSchema);