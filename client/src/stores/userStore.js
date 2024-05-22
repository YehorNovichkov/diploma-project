import { makeAutoObservable } from 'mobx'

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._userId = null
        makeAutoObservable(this)
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

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
    }

    setUserId(id) {
        this._userId = id
    }
}
