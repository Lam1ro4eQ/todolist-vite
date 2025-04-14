import {createAction, nanoid, createSlice} from "@reduxjs/toolkit"


export const createTodolistAC = createAction("todolists/createTodolist", (title: string) => {
    return {payload: {title, id: nanoid()}}
})


// export const todolistsSlice = createSlice({
//     name: 'todolists',
//     initialState: [] as Todolist[],
//     reducers: {
//         deleteTodolistAC: (state, action: PayloadAction<{ id: string }>) => {
//             const index = state.findIndex(todolist => todolist.id === action.payload.id);
//             if (index !== -1) state.splice(index, 1);
//         },
//         changeTodolistTitleAC: (state, action: PayloadAction<{ id: string; title: string }>) => {
//             const index = state.findIndex(todolist => todolist.id === action.payload.id);
//             if (index !== -1) state[index].title = action.payload.title;
//         },
//         changeTodolistFilterAC: (state, action: PayloadAction<{ id: string; filter: FilterValues }>) => {
//             const todolist = state.find(todolist => todolist.id === action.payload.id);
//             if (todolist) todolist.filter = action.payload.filter;
//         },
//         createTodolistAC: (state,action: PayloadAction<{title:string}>) => {
//
//         }
//     }
// });
//
// export const {
//     deleteTodolistAC,
//     changeTodolistTitleAC,
//     changeTodolistFilterAC
// } = todolistsSlice.actions;



export type FilterValues = "all" | "active" | "completed";

export type Todolist = {
    id: string
    title: string
    filter: FilterValues
}


export const todolistsSlice = createSlice({
    name: 'todolists',
    initialState: [] as Todolist[],
    reducers: (create) => ({
        deleteTodolistAC: create.reducer<{ id: string }>(
            (state, action) => {
                const index = state.findIndex(todolist => todolist.id === action.payload.id);
                if (index !== -1) state.splice(index, 1);
            }
        ),
        changeTodolistTitleAC: create.reducer<{ id: string; title: string }>(
            (state, action) => {
                const index = state.findIndex(todolist => todolist.id === action.payload.id);
                if (index !== -1) state[index].title = action.payload.title;
            }
        ),
        changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>(
            (state, action) => {
                const todolist = state.find(todolist => todolist.id === action.payload.id);
                if (todolist) todolist.filter = action.payload.filter;
            }
        ),
    }),
});



export const {
    deleteTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC
} = todolistsSlice.actions;

export const todolistsReducer = todolistsSlice.reducer;