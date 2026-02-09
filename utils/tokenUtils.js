const crypto = require('crypto');

exports.createPasswordResetToken = (user) => {
    const resetToken = crypto.randomBytes(32).toString('hex');

    user.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};
