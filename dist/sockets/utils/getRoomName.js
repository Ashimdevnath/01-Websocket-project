"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomName = void 0;
const getRoomName = (userId1, userId2) => {
    // Sort alphabetically so that "A_B" and "B_A" become the same
    return [userId1, userId2].sort().join("_");
};
exports.getRoomName = getRoomName;
