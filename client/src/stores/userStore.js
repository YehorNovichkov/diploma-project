export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    isAdmin() {
        if (this._user) {
            return this._user.role === 'ADMIN'
        }
        return false
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
    }
}
