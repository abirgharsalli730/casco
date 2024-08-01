import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/*==== registerUser =====*/
export const registerUser = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      console.log("data", data);
      const response = await axios.post("/auth/signup", data);
      console.log("data", data);
      toast.success(`${data.username} register success`);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);

      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
/*====// registerUser //=====*/
/*==== loginUser =====*/
export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/signin", data);
      const decodedToken = jwtDecode(response.data.data.token);
      console.log("isValidate attribute:", decodedToken.isValidate); // Log the isValidate attribute

      // Check if the account is validated
      if (decodedToken.isValidate) {
        // If the account is not validated, return a rejected promise with an error message
        const errorMessage =
          "Account is not validated. Please validate your account before logging in.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

      const token = response.data.data.token;
      const responseChane = { ...decodedToken, token };

      toast.success(`Sign-in successful`);
      return responseChane;
    } catch (error) {
      // Handle other errors
      toast.error(error.response.data.message);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

/*====// loginUser //=====*/
/*==== forgot-password =====*/
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put("/auth/forgot-password", data);
      console.log("data", data);
      toast.success(`${response.data.message}`);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);

      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
/*====// forgotPassword //=====*/
/*==== createNewPassword =====*/
export const createNewPassword = createAsyncThunk(
  "auth/createNewPassword",
  async (data, { rejectWithValue }) => {
    try {
      const { password, confirm_password } = data;
      const sendData = { password, confirm_password };
      console.log("data", data);
      const response = await axios.put(
        `/auth/password-reset/${data.id}`,
        sendData,
        {
          headers: { authorization: data.token },
        }
      );

      toast.success(response.data.message);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);

      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
/*====// createNewPassword //=====*/
/*==== updateUser =====*/
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const { username, email, password, confirm_password, id, profilePicture } =
      data;
    const sendData = {
      username,
      email,
      password,
      confirm_password,
      profilePicture,
    };
    try {
      const response = await axios.put(`/user/${data.id}`, sendData, {
        headers: { authorization: getState().user.token },
      });
      toast.success(response.data.message);

      return dispatch(getUser({ id }));
    } catch (error) {
      toast.error(error.response.data.message);

      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
/*====// updateUser //=====*/

/*==== deleteUser =====*/
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (data, { rejectWithValue, getState }) => {
    try {
      const response = await axios.delete(`/user/${data.id}`, {
        headers: { authorization: getState().user.token },
      });
      toast.success(response.data.message);

      return response;
    } catch (error) {
      toast.error(error.response.data.message);

      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
/*====// deleteUser //=====*/
/*==== logOut =====*/
export const logOut = createAsyncThunk(
  "auth/logOut",
  async (data, { rejectWithValue, getState }) => {
    try {
      localStorage.removeItem("token");
      console.log("data", data);
      const response = await axios.post(`/auth/signout`, data, {
        headers: { authorization: getState().user.token },
      });
      toast.success(response.data.message);

      return response;
    } catch (error) {
      toast.error(error.response.data.message);

      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

/*====// logOut //=====*/

/*==== getUser =====*/
export const getUser = createAsyncThunk(
  "user/getUser",
  async (data, { rejectWithValue, getState }) => {
    console.log("data", data);
    try {
      const response = await axios.get(`/user/${data.id}`, {
        headers: { authorization: getState().user.token },
      });
      return response.data.data;
    } catch (error) {
      toast.error(error.response.data.message);

      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
/*====// getUser //=====*/

//get all users
export const getusers = createAsyncThunk("user/getall", async () => {
  try {
    let result = await axios.get(`http://localhost:3001/api/user/`);
    console.log(result.data.users);
    return result?.data?.users;
    // console.log(result.data.data.users)
  } catch (error) {
    console.log(error);
  }
});
// end get all users
//update dashbord user
export const updateUserDashbord = createAsyncThunk(
  "user/update",
  async ({ id, newUser }) => {
    try {
      let result = axios.put(
        `http://localhost:3001/api/user/updateuserdash/${id}`,
        newUser
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }
);
export const userCurrent = createAsyncThunk(
  "user/current",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        // Token is not present
        return rejectWithValue("Token not found");
      }

      const response = await axios.get("http://localhost:3001/api/auth/current-user", {
        headers: {
          Authorization: token,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return rejectWithValue(error.response?.data?.message || "Error fetching current user");
    }
  }
);


const initialState = {
  user: null,
  users: null,
  usersList: [],
  userInfo: {},
  token: null,
  isAuth: false,
  userId: null,
  errors: null,
  loading: false,
  isActive: false,
  checkResetPassword: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.errors = false;
    },
    
  },

  extraReducers: (builder) => {
    /*==== registerUser =====*/
    builder.addCase(registerUser.fulfilled, (state) => {
      state.errors = null;
      state.loading = false;
      state.isActive = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.errors = action.payload;
    });
    /*====// registerUser //=====*/
    /*==== logOut =====*/
    builder.addCase(logOut.fulfilled, (state) => {
      state.userInfo = {};
      state.token = null;
      state.isAuth = false;
      state.userId = null;
      state.errors = null;
      state.loading = false;
      state.isActive = false;
    });
    builder.addCase(logOut.rejected, (state, action) => {
      state.errors = action.payload;
    });
    /*====// registerUser //=====*/

    /*==== loginUser =====*/
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.id;
      state.loading = false;
      localStorage.setItem("token", action.payload.token);
      state.isAuth = true;
      state.errors = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.errors = action.payload;
      state.loading = false;
    });
    /*====// loginUser //=====*/

    /*==== updateUser =====*/
    builder.addCase(updateUser.rejected, (state, action) => {
      state.errors = action.payload;
    });
    /*====// updateUser //=====*/

    /*==== checkRestePasswordUrl =====*/
    builder.addCase(createNewPassword.fulfilled, (state, action) => {
      state.checkResetPassword = true;
    });
    builder.addCase(createNewPassword.rejected, (state, action) => {
      state.errors = action.payload;
    });
    /*====// checkRestePasswordUrl //=====*/
    /*==== forgotPassword =====*/
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.errors = action.payload;
    });
    /*====// forgotPassword //=====*/
    /*==== deleteUser =====*/
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.userInfo = {};
      state.token = null;
      state.isAuth = false;
      state.userId = null;
      state.errors = null;
      state.loading = false;
      state.isActive = false;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.errors = action.payload;
    });
    /*====// deleteUser //=====*/

    /*==== getUser =====*/
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.userInfo = action.payload.user;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    });
    /*====// getUser //=====*/

    //get all  user

    builder
      .addCase(getusers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getusers.fulfilled, (state, action) => {
        state.status = "success";
        state.users = action.payload;
      })
      .addCase(getusers.rejected, (state) => {
        state.status = "fail";
      });

    //end get all  user
    builder
    .addCase(userCurrent.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(userCurrent.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(userCurrent.rejected, (state, action) => {
      state.loading = false;     
      state.isAuth = false; 
      state.error = action.payload;
    });
  },
});
export const { signOut } = userSlice.actions;

export default userSlice.reducer;
