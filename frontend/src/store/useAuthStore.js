import { create } from "zustand";

export const useAuthStore = create((set) => ({
    authUser: {name: "John Doe", _id: "123", age: 30},
    isLoggedIn: false,
    isLoading: false,

    login: () => {
        console.log("We just logged in")
        set({isLoggedIn: true, loading: true})
    }
}))