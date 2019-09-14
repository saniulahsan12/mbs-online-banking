const mongoose = require('mongoose');

let transactionSchema = new mongoose.Schema({
    from: {
        type: String
    },
    to: {
        type: String
    },
    tnxId: {
        type: String
    },
    amount: {
        type: Number,
        required: 'This field is required.'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Transaction', transactionSchema);