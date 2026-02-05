export function getJQuery() {
    const jq = globalThis.jQuery || globalThis.$;
    if (!jq) {
        throw new Error("jQuery not found. Please load jquery first.");
    }
    return jq;
}
export default getJQuery();
