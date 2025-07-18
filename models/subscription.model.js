import mongoose from 'mongoose';


const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'price must be greater than 0'],

    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'SR'],
        default: 'SR'
    },
    frequency: {
        type: String,
        enum: ['Weekly', 'Monthly', 'Yearly'],
        default: 'Monthly'
    },
    category: {
        type: String,
        enum: ['Non-Gaming', 'Gaming'],
        default: 'Non-Gaming'
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment methods are required'],
        trim: true
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['active', 'inactive']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        //required: [true, 'Renewal date is required'],  // Fixed message typo
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true });

// Auto-calculate renewal date if missing
subscriptionSchema.pre('save', function (next) {
    const renewalPeriods = {
        Weekly: 7,
        Monthly: 30,
        Yearly: 365,
    };

    if (!this.renewalDate) {
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + (renewalPeriods[this.frequency] || 30));
    }

    if (this.renewalDate < new Date()) {
        this.status = 'inactive';
    }

    next(); // ✅ MUST CALL NEXT!
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;