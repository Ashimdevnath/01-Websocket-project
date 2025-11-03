export const getRoomName = (userId1: string, userId2: string): string => {
    // Sort alphabetically so that "A_B" and "B_A" become the same
    return [userId1, userId2].sort().join("_");
}