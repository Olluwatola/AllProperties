"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFeaturesExports = void 0;
class APIFeatures {
    constructor(query, querystring) {
        this.query = query;
        this.querystring = querystring;
    }
    filter() {
        const queryObj = Object.assign({}, this.querystring);
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);
        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if (this.querystring.sort) {
            const sortBy = this.querystring.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields() {
        if (this.querystring.fields) {
            const fields = this.querystring.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate() {
        const page = this.querystring.page * 1 || 1;
        const limit = this.querystring.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
exports.ApiFeaturesExports = {
    APIFeatures
};
