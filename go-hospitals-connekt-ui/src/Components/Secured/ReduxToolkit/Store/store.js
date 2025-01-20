import { configureStore } from "@reduxjs/toolkit";
import frontDesk from '../Slices/frontDeskNavBarSlice'

const store = configureStore({
    reducer: {
        frontDeskNavBar: frontDesk.reducer
    }
});

export default store;