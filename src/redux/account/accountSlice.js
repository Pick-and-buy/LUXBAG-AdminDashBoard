import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        "id": "",
        "username": "",
        "avatar": "",
        "lastName": "",
        "firstName": "",
        "email": "",
        "phoneNumber": "",
        "dob": "",
        "likedPosts": [],
        "roles": [
            {
                "name": "",
                "description": "",
                "permissions": [],
            }
        ],
        "createdPosts": []
    },
};


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    
    reducers: {
        doLoginAction: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isLoading = false;
        },

        doGetAccountAction: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isLoading = false;
        },

        doLogoutAction: (state, action) => {
            localStorage.removeItem('accessToken');
            state.isAuthenticated = false;
            state.user = {
                id: "",
                username: "",
                avatar: "",
                lastName: "",
                firstName: "",
                email: "",
                phoneNumber: "",
                dob: "",
                likedPosts: [],
                roles: [
                    {
                        name: "",
                        description: "",
                        permissions: [],
                    }
                ],
                createdPosts: [],
            };
        },
        
    },
    
    extraReducers: (builder) => {
        
    },
});

export const { doLoginAction, doGetAccountAction, doLogoutAction } = accountSlice.actions;

export default accountSlice.reducer;
