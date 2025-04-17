import { createSlice} from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark';


export const appSlice = createSlice({
  name: 'app',
  initialState: {
    themeMode: 'light' as ThemeMode
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode;
    }),
  }),
  selectors: {
     selectThemeMode: (state) => state.themeMode
  }
});

export const { changeThemeModeAC } = appSlice.actions;
export const { selectThemeMode } = appSlice.selectors;
export const appReducer = appSlice.reducer;
