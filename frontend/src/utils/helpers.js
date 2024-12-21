export const validateUser = (user) => {
    if (!user?.username) {
        return false;
    }
    return true;
}