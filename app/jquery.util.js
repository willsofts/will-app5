import $ from "jquery";
export function getJQuery() {
    const jq = globalThis.jQuery || globalThis.$;
    if (!jq) {
        console.warn("jQuery not found. Please load jquery first.");
        return $;
    }
    return jq;
}
export default getJQuery();
