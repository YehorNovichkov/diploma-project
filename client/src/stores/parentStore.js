export default class ParentStore {
    constructor() {
        this._selectedStudentId = null
    }

    get selectedStudentId() {
        return this._selectedStudentId
    }

    setSelectedStudentId(id) {
        this._selectedStudentId = id
    }
}
