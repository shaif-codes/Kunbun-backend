import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    otp: {
        type: String,
        required: true,
        length: 6
    },
    purpose: {
        type: String,
        enum: ['email_verification', 'password_reset', 'two_factor', 'login'],
        default: 'email_verification'
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    attempts: {
        type: Number,
        default: 0,
        max: 5 // Maximum 5 attempts allowed
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
        index: { expireAfterSeconds: 0 } // MongoDB TTL index for automatic deletion
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastAttemptAt: {
        type: Date
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient queries
otpSchema.index({ email: 1, purpose: 1, isUsed: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Instance method to check if OTP is valid
otpSchema.methods.isValid = function() {
    return !this.isUsed && 
           this.expiresAt > new Date() && 
           this.attempts < 5;
};

// Instance method to increment attempts
otpSchema.methods.incrementAttempts = function() {
    this.attempts += 1;
    this.lastAttemptAt = new Date();
    return this.save();
};

// Instance method to mark as used
otpSchema.methods.markAsUsed = function() {
    this.isUsed = true;
    this.lastAttemptAt = new Date();
    return this.save();
};

// Static method to generate random 6-digit OTP
otpSchema.statics.generateOTP = function() {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to create new OTP and invalidate previous ones
otpSchema.statics.createOTP = async function(email, purpose = 'email_verification', ipAddress = null, userAgent = null) {
    try {
        // Invalidate any existing unused OTPs for this email and purpose
        await this.updateMany(
            { 
                email: email.toLowerCase(), 
                purpose, 
                isUsed: false,
                expiresAt: { $gt: new Date() }
            },
            { 
                isUsed: true 
            }
        );

        // Generate new OTP
        const otp = this.generateOTP();
        
        // Create new OTP record
        const otpRecord = new this({
            email: email.toLowerCase(),
            otp,
            purpose,
            ipAddress,
            userAgent
        });

        await otpRecord.save();
        
        return {
            success: true,
            otp,
            expiresAt: otpRecord.expiresAt,
            otpId: otpRecord._id
        };
    } catch (error) {
        console.error('Error creating OTP:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(email, otp, purpose = 'email_verification') {
    try {
        const otpRecord = await this.findOne({
            email: email.toLowerCase(),
            otp,
            purpose,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return {
                success: false,
                message: 'Invalid or expired OTP',
                code: 'INVALID_OTP'
            };
        }

        // Check if too many attempts
        if (otpRecord.attempts >= 5) {
            return {
                success: false,
                message: 'Too many attempts. Please request a new OTP',
                code: 'TOO_MANY_ATTEMPTS'
            };
        }

        // Mark as used
        await otpRecord.markAsUsed();

        return {
            success: true,
            message: 'OTP verified successfully',
            otpId: otpRecord._id
        };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return {
            success: false,
            message: 'Error verifying OTP',
            error: error.message
        };
    }
};

// Static method to record failed attempt
otpSchema.statics.recordFailedAttempt = async function(email, otp, purpose = 'email_verification') {
    try {
        const otpRecord = await this.findOne({
            email: email.toLowerCase(),
            otp,
            purpose,
            isUsed: false
        });

        if (otpRecord) {
            await otpRecord.incrementAttempts();
        }

        return otpRecord;
    } catch (error) {
        console.error('Error recording failed attempt:', error);
        return null;
    }
};

// Static method to cleanup expired OTPs (manual cleanup)
otpSchema.statics.cleanupExpired = async function() {
    try {
        const result = await this.deleteMany({
            expiresAt: { $lt: new Date() }
        });
        
        console.log(`Cleaned up ${result.deletedCount} expired OTP records`);
        return result;
    } catch (error) {
        console.error('Error cleaning up expired OTPs:', error);
        return null;
    }
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;