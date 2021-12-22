import { createContext, useReducer } from 'react'
import AuthReducer from './AuthReducer'

const INITIAL_STATE = {
    user: {

        "_id":  "61b1fdf9b651fdd59528a978",
        "username": "qwerty",
        "email": "qwerty@gmail.com",
        "password": "$2b$10$O1HxfNNenSgJ3b4.UIjoLe.2ip0lDRAqbvuWxGCJ420KDJEF/gOfm",
        "profilePicture": "",
        "coverPicture": "",
        "followers": ["61b1fdffb651fdd59528a97a", "61b1fe05b651fdd59528a97c", "61b1fe14b651fdd59528a980"],
        "followings": ["61b1fe14b651fdd59528a980"],
        "isAdmin": false,
        "createdAt": {
            "$date": "2021-12-09T13:00:41.685Z"
        },
        "updatedAt": {
            "$date": "2021-12-09T13:17:49.330Z"
        },
        "__v": 0

    },
    isFetching: false,
    error: false
}

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider = (props) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    return (
        <AuthContext.Provider value={{ user: state.user, isFetching: state.isFetching, error: state.error, dispatch }}>
            {props.children}
        </AuthContext.Provider>
    )
}