import Joi from "joi";

// validate register data from client
export const valdiateRegister = (user) => {
  const schema = Joi.object({
    firstname: Joi.string().trim().min(2).max(100).required(),
    lastname: Joi.string().trim().min(2).max(100).required(),
    username: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().min(2).max(100).email().required(),
    password: Joi.string().trim().min(8).required()
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/)
      .message("Password must contain at least one lowercase letter, one uppercase letter, and one special character"),
    confirm_password: Joi.string().valid(Joi.ref("password")).required(),
  });
  return schema.validate(user);
};

// validate login data from client
export const valdiateLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(2).max(100).email().required(),
    password: Joi.string().trim().min(8).required()
      
  });
  return schema.validate(user);
};

// validate update data from client
export const validateUpdateUser = (updateUser) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().min(2).max(100).email().required(),
    password: Joi.string().trim().min(8).required()
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/)
      .message("Password must contain at least one lowercase letter, one uppercase letter, and one special character"),
    confirm_password: Joi.string().valid(Joi.ref("password")).required(),
    profilePicture: Joi.string(),
  });
  return schema.validate(updateUser);
};

// validate email
export const valdiateEmail = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(2).max(100).email().required(),
  });
  return schema.validate(obj);
};
// valdiate  password
export const valdiateResetPassword = (obj) => {
  const schema = Joi.object({
    password: Joi.string().trim().min(8).max(100).required()
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/)
      .message("Password must contain at least one lowercase letter, one uppercase letter, and one special character"),
    confirm_password: Joi.string().valid(Joi.ref("password")).required(),
  });
  return schema.validate(obj);
};

//valdiatePassword