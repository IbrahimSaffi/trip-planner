import { configureStore } from "@reduxjs/toolkit";
import mainSlice from "./mainSlice";

let store = configureStore({
    reducer: {
        mainSlice:mainSlice
    }
})
export default store