// Validar formato del username
export const isUsernameValid = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    return usernameRegex.test(username);
};

