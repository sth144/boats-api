export interface IError {
    error_type: string
}

export const ErrorTypes = {
    INTERFACE: "INTERFACE",
    UNIQUE: "UNIQUE",
    BAD_EDIT: "BAD_EDIT",
    NO_ID: "NO_ID",
    DOESNT_EXIST: "DOESNT_EXIST"
}

export const isError = (_testObj): boolean => {
    if ("error_type" in _testObj) return true;
    return false;
}