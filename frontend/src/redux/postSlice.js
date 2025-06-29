import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
        selectedPost: null,
        postCreated: false,
    },
    reducers: {
        //actions
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        },
        triggerPostCreated: (state) => {
            state.postCreated = !state.postCreated; // just toggles
        },
    }
});

export const { setPosts, setSelectedPost, triggerPostCreated  } = postSlice.actions;
export default postSlice.reducer;