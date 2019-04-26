export interface IError {
    error_type: string
}

export const ErrorTypes = {
    INTERFACE: "INTERFACE",
    NOT_UNIQUE: "NOT_UNIQUE",
    BAD_EDIT: "BAD_EDIT",
    NO_ID: "NO_ID",
    NOT_FOUND: "NOT_FOUND",
    FORBIDDEN: "FORBIDDEN"
}

export const isError = (_testObj: object): boolean => {
    if (_testObj == undefined) return false;
    if ("error_type" in _testObj) return true;
    return false;
}