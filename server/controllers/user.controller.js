import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.handler.js";
import bcryptjs from "bcryptjs";
import {
  validateUpdateUser,
} from "../validations/users.schemas.js";
import { validateAccount } from "../utils/validate.template.js";
import { NotvalidateAccount } from "../utils/Notvalidate.template.js";

export const test = (req, res) => {
  res.json({
    message: "API is working!",
  });
};
import sendMail from "../services/send.email.js"; 

/**
 * @desc get all user
 * @params GET /api/user
 * @access PUBLIC
 **/
export const getUsers = async (req, res, next) => {
  try {
    let result = await User.find();
    res.send({
      users: result,
      msg: "all users",
    });
  } catch (error) {
    console.log(error);
  }
};

//update user by id

export const updateUserDashbord = async (req, res, next) => {
  try {
    let updateUser = { ...req.body };

    let result = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updateUser },
      { new: true }
    );
    console.log("User's validation:", result.isValidate); // Log the user's email
        res.send({ newUser: result, msg: "User updated" });
      if(result.isValidate == true){
     // Assuming req.body.email contains the user's email
     const subject = "Validation account";
     const html = validateAccount();
     // Sending email to the user's email address
     await sendMail(result.email, subject, html);
      } else {
        const subject = "Validation account";
        const html = NotvalidateAccount();
        // Sending email to the user's email address
        await sendMail(result.email, subject, html);
      }
   
 
    

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const currentUser = async (req, res, next) => {
     res.status(200).send({ user: req.user });
};
// userRouter.get("/current", isAuth(), (req, res) => {
//   res.status(200).send({ user: req.user });
// });
/**
 * @desc get user by id
 * @params GET /api/user/:id
 * @access PUBLIC
 **/
export const getUser = async (req, res, next) => {
  try {
    // get user from db and except password
    const user = await User.findById(req.params.id).select("-password");
    //ckeck if user exist or not
    if (!user) return next(errorHandler(404, "user not found, invalid id"));
    return res.status(200).json({
      message: "get user success",
      status: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc update user
 * @params PUT /api/user/:id
 * @access PRIVET (owner of this account)
 **/
export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You can update only your account!"));
    }

    // validate update user schema
    const { error } = validateUpdateUser(req.body);
    if (error) return next(errorHandler(400, `${error.details[0].message}`));

    const { username, email, password,  profilePicture , isValidate , role  } = req.body;

    // Retrieve the current user
    const currentUser = await User.findById(req.params.id);

    // Update only the fields that are provided in the request body
    if (profilePicture) {
      currentUser.profilePicture= profilePicture;
    }
    if (username) {
      currentUser.username = username;
    }
    if (email) {
      currentUser.email = email;
    }
    if (role) {
      currentUser.role = role;
    }
    if (isValidate) {
      currentUser.isValidate = isValidate;
    }
    if (password) {
      currentUser.password = bcryptjs.hashSync(password, 10);
    }
   
    // Save the updated user
    await currentUser.save();

    return res.status(200).json({ message: "User updated successfully", status: true });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc delete user
 * @params DELETE /api/user/:id
 * @access PRIVET (owner of this account)
 **/

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can delete only your account!"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "User has been deleted...", status: true });
  } catch (error) {
    next(error);
  }
};

