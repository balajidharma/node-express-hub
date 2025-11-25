import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserLogin } from '@shared-types';
import { authClient } from '@web-react/lib/auth-client';


export const getSession = createAsyncThunk(
  'auth/getSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data: sessionData } = await authClient.getSession();
      if (!sessionData) {
        return rejectWithValue({ message: 'No active session' });
      }
      const serializableSession = {
        id: sessionData.session.id,
        token: sessionData.session.token,
        expiresAt: sessionData.session.expiresAt.toISOString(),
        createdAt: sessionData.session.createdAt.toISOString(),
      }
      const serializableUser = {
        id: sessionData.user.id,
        email: sessionData.user.email,
        username: sessionData.user.username,
        displayUsername: sessionData.user.displayUsername,
        emailVerified: sessionData.user.emailVerified,
        name: sessionData.user.name,
        image: sessionData.user.image,
        createdAt: sessionData.user.createdAt.toISOString(),
        updatedAt: sessionData.user.updatedAt.toISOString(),
      }
      return { user: serializableUser, session: serializableSession };
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: UserLogin, { dispatch, rejectWithValue }) => {
    try {
      const { error } = await authClient.signIn.username({
        username: loginData.username,
        password: loginData.password,
        rememberMe: loginData.remember,
      });

      if (error) {
        return rejectWithValue(error);
      }

      const sessionAction = await dispatch(getSession());
      if (getSession.fulfilled.match(sessionAction)) {
        return sessionAction.payload;
      }

      return rejectWithValue(sessionAction.payload || { message: 'Failed to get session after login.' });
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

interface AuthState {
  user: {
    id: string;
    email: string;
    username: string;
    displayUsername: string;
    emailVerified: boolean;
    name: string | null | undefined;
    image: string | null | undefined;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  session: {
    id: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  status: 'initial' | 'loading' | 'authenticated' | 'unauthenticated';
}

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  status: 'initial',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<AuthState['status']>) => {
      state.status = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<any | null>) => {
      state.user = action.payload
    },
    setSession: (state, action: PayloadAction<any | null>) => {
      state.session = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setAuthSession: (state, action: PayloadAction<any | null>) => {
      authSlice.caseReducers.setUser(state, { payload: action.payload?.user || null, type: 'setUser' });
      authSlice.caseReducers.setSession(state, { payload: action.payload?.session || null, type: 'setSession' });
      state.isLoading = false;
    },
    clearSession: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.status = 'unauthenticated';
    },
    logout: (state) => {
      authClient.signOut();
      authSlice.caseReducers.clearSession(state);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.status = 'unauthenticated';
    });

    builder.addCase(getSession.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSession.fulfilled, (state, action) => {
      authSlice.caseReducers.setAuthSession(state, { payload: action.payload, type: 'setAuthSession' });
      state.status = 'authenticated';
    });
    builder.addCase(getSession.rejected, (state, action) => {
      state.isLoading = false;
      state.status = 'unauthenticated';
    });
  }
});

export const { setStatus, setLoading, setUser, setSession, setAuthSession, clearSession, logout } = authSlice.actions;
export default authSlice.reducer;