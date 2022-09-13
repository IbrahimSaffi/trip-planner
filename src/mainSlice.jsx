import { createSlice, current } from "@reduxjs/toolkit";
let mainSlice = createSlice({
    name: "primary-slice",
    initialState: {
        user: JSON.parse(localStorage.getItem("PROFILE")),
        error: "",
        loading: false,
        trips: [],
        trip: {},
        autocomplete: [],
        placesAdded: []
    },
    reducers: {
        login: (state, action) => {
            console.log(action.payload)
            state.user = action.payload
            localStorage.setItem("PROFILE", JSON.stringify(action.payload))
        },
        addTrips: (state, action) => {
            state.trips = action.payload
        },
        displayTrip: (state, action) => {
            state.trip = action.payload
        },
        setCurrPlaces: (state, action) => {
            if (action.payload === "del") {
                state.placesAdded = []
            }
            else if (action.payload === "edit") {
                console.log(state.trip.places.split("-"))
                state.placesAdded = state.trip.places.split("-")
            }
            else {
                state.placesAdded.push(action.payload.join("&&"))
            }
        },
        setAutocomplete: (state, action) => {
            state.autocomplete = action.payload
        },
        logout: (state, action) => {
            state.autocomplete = []
            state.placesAdded = []
            state.user = null
            state.error = ""
            state.loading = false
            state.trips = []
            state.trip = {}
        },
        delPlace:(state,action)=>{
            state.placesAdded.splice(action.payload,1)
        },
        // addError:(state,action)=>{
        //     if(action.payload!==""){

        //         state.error = JSON.stringify(action.payload)
        //     }
        //     else{
        //         action.payload=""
        //     }
        // },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})
export const { delPlace,login, addError, setLoading, addTrips, displayTrip, setCurrPlaces, setAutocomplete,logout} = mainSlice.actions
export default mainSlice.reducer