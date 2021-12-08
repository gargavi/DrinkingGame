import { createSlice} from "@reduxjs/toolkit"; 


export const timerSlice = createSlice({ 
    name: "timer", 
    initialState: {
        seconds: 5, 
        interval: null, 
        over: false,
        active: false
    }, 
    reducers: { 
        start: (state) =>  {
            state.active = true
        }, 
        tick: (state) =>  {
            if (state.seconds > 0) { 
                state.seconds -= 1
            } else {
                clearInterval(state.interval);
                state.interval = null;
                state.active = false
            }
        }, 
        setstateInterval: (state, action) => {
            state.interval = action.payload
        }, 
        resetInterval: (state) => { 
            clearInterval(state.interval);
            state.interval = null
        }, 
        setTime: (state, action) => { 
            state.seconds = action.payload;
        }, 
        addTime: (state, action) => {
            state.minutes += action.payload;
        }
    }
})

export const {start, addTime, tick, setstateInterval, setTime, resetInterval} = timerSlice.actions; 

export default timerSlice.reducer;