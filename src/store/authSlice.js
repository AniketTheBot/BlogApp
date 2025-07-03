import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../appwrite/auth";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const session = await authService.login({
        email: credentials.email,
        password: credentials.password,
      });
      if (session) {
        const userData = await authService.getCurrentUser();
        return userData
          ? userData
          : thunkAPI.rejectWithValue("failed to fetch user after login");
      } else {
        return thunkAPI.rejectWithValue(
          "Login failed: Session error not created"
        );
      }
    } catch (error) {
      let errorMessage = "Unexpected login error occured";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await authService.logout();
    } catch (error) {
      let errorMessage = "Error logging out. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",

  async (credentials, thunkAPI) => {
    try {
      const createdAccount = await authService.createAccount({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
      });
      if (createdAccount) {
        const session = await authService.login({
          email: credentials.email,
          password: credentials.password,
        });
        if (session) {
          const userData = await authService.getCurrentUser();
          return userData
            ? userData
            : thunkAPI.rejectWithValue(
                "Signup successful, but failed to fetch user details after login."
              );
        } else {
          return thunkAPI.rejectWithValue(
            "Account created, but automatic login failed. Please try logging in manually."
          );
        }
      } else {
        return thunkAPI.rejectWithValue(
          "Signup failed: Account creation did not return expected result."
        );
      }
    } catch (error) {
      let errorMessage = "Error Signing Up. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, thunkAPI) => {
    try {
      const userData = await authService.getCurrentUser();
      return userData
        ? userData
        : thunkAPI.rejectWithValue("No active user session found.");
    } catch (error) {
      let errorMessage = "Could not verify authentication status";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const updateUserAccount = createAsyncThunk(
  "auth/updateAccount",
  async (name, thunkAPI) => {
    try {
      const updatedUser = await authService.updateName(name);

      if (updatedUser) {
        return updatedUser;
      } else {
        return thunkAPI.rejectWithValue("Failed to update name.");
      }
    } catch (error) {
      let errorMessage = "Error updating name. Please try again.";
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  status: false,
  userData: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.status = false;
        state.userData = null;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.status = false;
        state.userData = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.status = false;
        state.userData = null;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.status = false;
        state.userData = null;
        state.error = action.payload;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.status = false;
        state.userData = null;
        state.error = null;
      })
    .addCase(updateUserAccount.pending, (state) => {
      // You might not want a global loading spinner for a small update,
      // but it's good to clear any previous errors.
      state.error = null;
      // Optionally, you could set a specific loading flag like state.isUpdating = true;
    })
      .addCase(updateUserAccount.fulfilled, (state, action) => {
        state.error = null;
        // The payload from the thunk is the updated user object from Appwrite.
        // We simply replace our old userData with this new, updated one.
        state.userData = action.payload;
        // state.isUpdating = false;
      })
      .addCase(updateUserAccount.rejected, (state, action) => {
        // Set the error state so the UI can display it
        state.error = action.payload;
        // state.isUpdating = false;
      });
  },
});

export default authSlice.reducer;
