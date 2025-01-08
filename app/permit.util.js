"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPermissions = exports.getPermitModel = exports.Permission = exports.DEFAULT_PERMITS = void 0;
const app_info_1 = require("./app.info");
const app_util_1 = require("./app.util");
const permitsChunk = {};
exports.DEFAULT_PERMITS = { all: false, insert: false, retrieve: false, update: false, delete: false, import: false, export: false, launch: true, print: false };
class Permission {
    constructor(setting = {}) {
        this.permits = Object.assign({}, exports.DEFAULT_PERMITS, setting);
    }
    canDo(action) {
        let cando = this.permits[action];
        return cando !== undefined && cando;
    }
}
exports.Permission = Permission;
async function getPermitModel(pid) {
    if (!pid || pid.trim().length == 0)
        return undefined;
    if (!permitsChunk[pid]) {
        await loadPermissions(pid);
    }
    return new Permission(permitsChunk[pid]);
}
exports.getPermitModel = getPermitModel;
async function loadPermissions(pid) {
    if (!pid || pid.trim().length == 0)
        return undefined;
    try {
        let params = (0, app_util_1.serializeParameters)({ progid: pid });
        let options = { method: "POST", headers: { ...params.headers, "Content-Type": app_info_1.DEFAULT_CONTENT_TYPE }, body: params.jsondata };
        let response = await fetch((0, app_info_1.getApiUrl)() + "/api/permit/get", options);
        let json = await response.json();
        console.log("loadPermissions: pid=" + pid, json);
        if (json && json.body[pid]) {
            permitsChunk[pid] = json.body[pid];
        }
    }
    catch (ex) {
        console.error(ex);
    }
}
exports.loadPermissions = loadPermissions;
