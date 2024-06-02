export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._userId = null
        this._userRoles = []
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    get userId() {
        return this._userId
    }

    get userRoles() {
        return this._userRoles
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
    }

    setUserId(id) {
        this._userId = id
    }

    setUserRoles(roles) {
        this._userRoles = roles
    }
}
