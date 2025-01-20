import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    navBarSearchActivated: false
}

const frontDeskNavBarSlice = createSlice({
    name: 'frontDeskNavBarSlice',
    initialState,
    reducers: {
        openNavBarSearch: (state) => {

            state.navBarSearchActivated = true;

        },
        closeNavBarSearch: (state) => {

            state.navBarSearchActivated = false;

        }
    }
});

export const { openNavBarSearch, closeNavBarSearch } = frontDeskNavBarSlice.actions;

export default frontDeskNavBarSlice;