import { setUncaughtExceptionCaptureCallback } from "node:process"

const HTTP_CODES = {

    SUCCESS: {
        OK: 200
    },
    CLIENT_ERROR: {
        NOT_FOUND: 404
    },
    SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: 500
    }
}

export default HTTP_CODES;