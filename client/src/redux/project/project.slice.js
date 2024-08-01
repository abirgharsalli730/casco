import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

/*==== CreateProject =====*/
export const createProject = createAsyncThunk(
  "project/createproject",
  async (data, { rejectWithValue, getState }) => {
   
    try {
      const response = await axios.post("project/createproject", data, {
        headers: { authorization: getState().user.token },
      });
      toast.success(`Project Creation success`);
      return response.data.project;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/*==== FetchProjects =====*/
export const fetchProjects = createAsyncThunk(
  "project/getprojects",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get("project/getprojects", {
        headers: { authorization: getState().user.token },
      });
      return response.data.projects;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/*==== UpdateProject =====*/
export const updateProject = createAsyncThunk(
  "project/updateproject",
  async (data, { rejectWithValue, getState }) => {
    try {
      const response = await axios.put(`project/updateproject/${data._id}`, data, {
        headers: { authorization: getState().user.token },
      });
      toast.success(`Project Update success`);
      return response.data.project;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Define the initial state
const initialState = {
  projectsList: [],
  projectInfo: {}, // Initialize projectInfo as an empty object
  errors: null,
  loading: false,
  isActive: false,
};

// Define the project slice
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectInfo(state, action) {
      state.projectInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.fulfilled, (state, action) => {
        state.errors = null;
        state.loading = false;
        state.isActive = true;
        // Dispatch the project info to setProjectInfo reducer
        projectSlice.caseReducers.setProjectInfo(state, action);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.errors = action.payload;
      })
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projectsList = action.payload;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.errors = null;
        state.loading = false;
        // Update the project in the projectsList
        const updatedProject = action.payload;
        const index = state.projectsList.findIndex((project) => project._id === updatedProject._id);
        if (index !== -1) {
          state.projectsList[index] = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.errors = action.payload;
      });
  },
});

export const { setProjectInfo } = projectSlice.actions;

export default projectSlice.reducer;
