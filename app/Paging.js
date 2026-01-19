"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paging = exports.DEFAULT_PAGE_SETTINGS = void 0;
exports.DEFAULT_PAGE_SETTINGS = { page: 1, rowsPerPage: 10, totalRows: 0, totalPages: 1, limit: 10, offset: 10, rows: 0 };
class Paging {
    setting;
    constructor(setting = {}) {
        this.setting = { ...exports.DEFAULT_PAGE_SETTINGS, ...setting };
    }
    clear() {
        this.reset(exports.DEFAULT_PAGE_SETTINGS);
    }
    reset(setting) {
        if (setting) {
            this.setting = { ...this.setting, ...setting };
        }
    }
    hasPaging(rows) {
        if (!rows)
            rows = this.setting.totalRows;
        let chapter = this.setting.rowsPerPage;
        return (chapter > 0) && (rows > chapter);
    }
    recordsOffset() {
        let page = this.setting.page - 1;
        let chapter = this.setting.rowsPerPage;
        if (page > 0)
            return page * chapter;
        return 0;
    }
    recordsNumber(seqno) {
        return seqno + this.recordsOffset();
    }
    buildPagingModel(opts) {
        const options = opts ?? { totalRows: 0 };
        const results = [];
        const totalRows = this.resolveTotalRows(options.totalRows);
        const totalPages = this.calculateTotalPages(totalRows);
        const pagingRange = this.calculatePagingRange();
        this.addFirstAndPrevious(results, pagingRange);
        this.addPageNumbers(results, totalRows, totalPages, pagingRange);
        this.addLast(results, totalRows, pagingRange);
        return results;
    }
    resolveTotalRows(totalRows) {
        return totalRows || this.setting.totalRows;
    }
    calculateTotalPages(totalRows) {
        let pages = 0;
        for (let i = 0; i < totalRows; i += this.setting.rowsPerPage) {
            pages++;
        }
        return pages;
    }
    calculatePagingRange() {
        let pages = this.setting.page;
        let chapters = this.setting.rowsPerPage;
        let limit = this.setting.limit <= 0 ? chapters : this.setting.limit;
        let counter = 0;
        let startIdx = pages;
        while (startIdx > limit) {
            counter++;
            startIdx -= limit;
        }
        return { pages, chapters, limit, previousPage: counter * limit };
    }
    addFirstAndPrevious(results, range) {
        if (range.limit > 0 && range.pages > range.limit) {
            results.push({ page: 1, text: "|<", css: "" }, { page: range.previousPage, text: "<<", css: "" });
        }
    }
    getNextPageNumber(page, totalPages) {
        let nextPage = page;
        if (nextPage > totalPages)
            nextPage = totalPages;
        return nextPage;
    }
    addPageNumbers(results, totalRows, totalPages, range) {
        let pageNumber = 0;
        let pageCounter = 0;
        for (let i = 0; i < totalRows; i += range.chapters) {
            pageNumber++;
            if (range.limit > 0) {
                if (pageNumber <= range.previousPage)
                    continue;
                pageCounter++;
                if (range.limit < pageCounter) {
                    let nextPage = this.getNextPageNumber(pageNumber, totalPages);
                    results.push({ page: nextPage, text: ">>", css: "" });
                    break;
                }
            }
            const selected = range.pages === pageNumber ||
                (pageNumber === 1 && range.pages === 0)
                ? "pageselectedclass active"
                : "";
            results.push({
                page: pageNumber,
                text: String(pageNumber),
                css: selected
            });
        }
    }
    addLast(results, totalRows, range) {
        if (range.limit <= 0)
            return;
        let pageCount = 0;
        for (let i = 0; i < totalRows; i += range.chapters) {
            pageCount++;
        }
        if (range.limit < pageCount) {
            results.push({ page: pageCount, text: ">|", css: "" });
        }
    }
}
exports.Paging = Paging;
