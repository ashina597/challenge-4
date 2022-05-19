"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allow = void 0;
const Allow = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) {
        return res.json({ error: 'Not authorized to access this route no token found' });
    }
    if (token !== 'secret') {
        return res.json({ error: 'Wrong Token' });
    }
    next();
};
exports.Allow = Allow;
