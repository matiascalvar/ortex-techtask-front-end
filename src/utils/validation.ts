interface Errors{
  password?: string,
  email?: string
}

export default function validation(input:Errors) {
    let errors: Errors = {};

    // Password
    const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
    // Upper, lower case, numbers and minimum 8 characters
    if (!input.password) errors.password = "Password required";
    else if (!PASSWORD_PATTERN.test(input.password)) {
      errors.password = "Invalid password";
    }

    // Email
    const EMAIL_PATTERN = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    // characters + @ + characters + .com
    if (!input.email) errors.email = "Email required";
    else if (!EMAIL_PATTERN.test(input.email)) {
        errors.email = "Invalid email";
    }
    return errors;
};