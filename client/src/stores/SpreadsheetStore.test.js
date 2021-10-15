const SpreadsheetStore = require("./SpreadsheetStore")
// @ponicode
describe("SpreadsheetStore.getColumnsLabels", () => {
    test("0", () => {
        let callFunction = () => {
            SpreadsheetStore.getColumnsLabels(0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            SpreadsheetStore.getColumnsLabels(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            SpreadsheetStore.getColumnsLabels(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            SpreadsheetStore.getColumnsLabels(-100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            SpreadsheetStore.getColumnsLabels(-5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            SpreadsheetStore.getColumnsLabels(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("observeCell", () => {
    let object
    let inst

    beforeEach(() => {
        object = [30, 4, ["group", "status", "phone", "token", "token"]]
        inst = new SpreadsheetStore.default({ rows: 10, columns: object, listeners: "Edmond", _id: { $oid: 9876 } })
    })

    test("0", () => {
        let callFunction = () => {
            inst.observeCell(-5.48, "status")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst.observeCell(100, "phone")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst.observeCell(100, "token")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst.observeCell(0, "phone")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst.observeCell(100, -100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst.observeCell(NaN, NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("updateCellValue", () => {
    let object
    let inst

    beforeEach(() => {
        object = [["group", "status", "phone", "token", "token"], 0, ["group", "status", "phone", "token", "token"]]
        inst = new SpreadsheetStore.default({ rows: 0, columns: object, listeners: "George", _id: { $oid: "bc23a9d531064583ace8f67dad60f6bb" } })
    })

    test("0", () => {
        let callFunction = () => {
            inst.updateCellValue(100, "phone", "elio@example.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst.updateCellValue(1, "token", "Elio")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst.updateCellValue(100, -5.48, "Elio")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst.updateCellValue(-100, "token", "Dillenberg")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst.updateCellValue(1, "phone", "Dillenberg")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst.updateCellValue(NaN, NaN, "")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("getRow", () => {
    let object
    let inst

    beforeEach(() => {
        object = [["group", "status", "phone", "token", "token"], 10, ["group", "status", "phone", "token", "token"]]
        inst = new SpreadsheetStore.default({ rows: 3.0, columns: object, listeners: "George", _id: { $oid: 9876 } })
    })

    test("0", () => {
        let callFunction = () => {
            inst.getRow(0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst.getRow(-5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst.getRow(10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst.getRow(-10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst.getRow(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst.getRow(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_recalculateRawValue", () => {
    let object
    let inst

    beforeEach(() => {
        object = [5, ["group", "status", "phone", "token", "token"], ["group", "status", "phone", "token", "token"]]
        inst = new SpreadsheetStore.default({ rows: 10, columns: object, listeners: "Jean-Philippe", _id: { $oid: "c466a48309794261b64a4f02cfcc3d64" } })
    })

    test("0", () => {
        let callFunction = () => {
            inst._recalculateRawValue(1800)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._recalculateRawValue(4)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._recalculateRawValue(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._recalculateRawValue(3)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._recalculateRawValue(320)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._recalculateRawValue(-Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_notifyChange", () => {
    let object
    let inst

    beforeEach(() => {
        object = [["group", "status", "phone", "token", "token"], 4, ["group", "status", "phone", "token", "token"]]
        inst = new SpreadsheetStore.default({ rows: 4, columns: object, listeners: "Edmond", _id: { $oid: 9876 } })
    })

    test("0", () => {
        let callFunction = () => {
            inst._notifyChange(1800, 254, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._notifyChange(100, 254, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._notifyChange(31, 159, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._notifyChange(1.0, 239, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._notifyChange(1, 254, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._notifyChange(Infinity, Infinity, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_notifySubscribers", () => {
    let object
    let inst

    beforeEach(() => {
        object = [["group", "status", "phone", "token", "token"], ["group", "status", "phone", "token", "token"], 10]
        inst = new SpreadsheetStore.default({ rows: 3.0, columns: object, listeners: "George", _id: { $oid: "bc23a9d531064583ace8f67dad60f6bb" } })
    })

    test("0", () => {
        let callFunction = () => {
            inst._notifySubscribers(1800, 30)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._notifySubscribers(320, 3.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._notifySubscribers(180, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._notifySubscribers(2, 4)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._notifySubscribers(31, 30)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._notifySubscribers(NaN, NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_notifyDependencyListeners", () => {
    let object
    let inst

    beforeEach(() => {
        object = [["group", "status", "phone", "token", "token"], ["group", "status", "phone", "token", "token"], ["group", "status", "phone", "token", "token"]]
        inst = new SpreadsheetStore.default({ rows: 4, columns: object, listeners: "Jean-Philippe", _id: { $oid: "bc23a9d531064583ace8f67dad60f6bb" } })
    })

    test("0", () => {
        let callFunction = () => {
            inst._notifyDependencyListeners(0.5)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._notifyDependencyListeners(0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._notifyDependencyListeners(0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._notifyDependencyListeners(7)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._notifyDependencyListeners(3)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._notifyDependencyListeners(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_addDependencyListener", () => {
    let object
    let inst

    beforeEach(() => {
        object = [["group", "status", "phone", "token", "token"], 10, ["group", "status", "phone", "token", "token"]]
        inst = new SpreadsheetStore.default({ rows: 5, columns: object, listeners: "George", _id: { $oid: "da7588892" } })
    })

    test("0", () => {
        let callFunction = () => {
            inst._addDependencyListener("./path/to/file", true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._addDependencyListener("path/to/file.ext", false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._addDependencyListener("/path/to/file", false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._addDependencyListener("C:\\\\path\\to\\file.ext", false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._addDependencyListener("path/to/file.ext", true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._addDependencyListener(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_removeDependencyListener", () => {
    let object
    let inst

    beforeEach(() => {
        object = [0, ["group", "status", "phone", "token", "token"], ["group", "status", "phone", "token", "token"]]
        inst = new SpreadsheetStore.default({ rows: 4, columns: object, listeners: "Jean-Philippe", _id: { $oid: "c466a48309794261b64a4f02cfcc3d64" } })
    })

    test("0", () => {
        let callFunction = () => {
            inst._removeDependencyListener("path/to/folder/", ["Michael", "Jean-Philippe", "Jean-Philippe", "Edmond", "Michael"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._removeDependencyListener("C:\\\\path\\to\\folder\\", ["Jean-Philippe", "Edmond", "George", "Jean-Philippe", "George"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._removeDependencyListener("path/to/folder/", ["Jean-Philippe", "Anas", "Pierre Edouard", "George", "Jean-Philippe"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._removeDependencyListener(".", ["George", "Michael", "George", "Pierre Edouard", "Anas"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._removeDependencyListener("C:\\\\path\\to\\folder\\", ["Edmond", "Jean-Philippe", "Michael", "George", "George"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._removeDependencyListener(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
