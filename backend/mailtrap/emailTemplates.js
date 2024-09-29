// emailTemplates.js
export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body>
  <h1>Verify Your Email</h1>
  <p>Your verification code is: <strong>{verificationCode}</strong></p>
  <p>Thank you for signing up!</p>
</body>
</html>
`

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body>
  <h1>Password Reset</h1>
  <p>Click the link below to reset your password:</p>
  <a href="{resetURL}">Reset Password</a>
</body>
</html>
`

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body>
  <h1>Password Reset Successful</h1>
  <p>Your password has been successfully reset.</p>
</body>
</html>
`
