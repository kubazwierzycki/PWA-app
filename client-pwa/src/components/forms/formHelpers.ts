import axios from "axios";
import bggService from "../../services/bgg";

export enum Severity {
    Error = "error",
    Info = "info",
    Success = "success",
    Warning = "warning",
}

export interface Message {
    message: string;
    severity: Severity;
}

export enum ValidationResult {
    Success = "success",
    ShortUsername = "Username must be at least 4 characters long",
    LongUsername = "Username must be no more than 20 characters long",
    IncorrectPattern = "Username must start with a letter, and may contain only letters, numbers and underscores (_)",
    ShortBggUsername = "BGG username must be at least 4 characters long",
    LongBggUsername = "BGG username must be no more than 20 characters long",
    IncorrectBggPattern = "BGG username must start with a letter, and may contain only letters, numbers and underscores (_)",
    ShortPassword = "Password must be at least  6 characters long",
    PasswordConfirmationNotMatch = "Password and password confirmation do not match",
    BggUserNotFound = "The BGG user with the specified username cannot be found",
}

export enum UsernameType {
    CoGame,
    Bgg,
}

export const validateUsername = (
    username: string,
    type: UsernameType
): ValidationResult => {
    const usernameLength = username.length;
    if (usernameLength < 4) {
        return type === UsernameType.CoGame
            ? ValidationResult.ShortUsername
            : ValidationResult.ShortBggUsername;
    }
    if (usernameLength > 20) {
        return type === UsernameType.CoGame
            ? ValidationResult.LongUsername
            : ValidationResult.LongBggUsername;
    }
    const regexp = new RegExp("^[a-zA-Z][\\w\\d]{3,19}$");
    const hasValidCharacters = regexp.test(username);
    console.log("hasValidCharacters: ", hasValidCharacters, username);
    if (!hasValidCharacters) {
        return type === UsernameType.CoGame
            ? ValidationResult.IncorrectPattern
            : ValidationResult.IncorrectBggPattern;
    }

    return ValidationResult.Success;
};

export const validatePassword = (
    password: string,
    passwordConfirmation: string
): ValidationResult => {
    if (password.length < 6) {
        return ValidationResult.ShortPassword;
    }
    if (password !== passwordConfirmation) {
        return ValidationResult.PasswordConfirmationNotMatch;
    }
    return ValidationResult.Success;
};

export const getBggUserId = async (bggUsername: string): Promise<string> => {
    let bggUserId = "";
    try {
        const res = await bggService.getUserByUsername(bggUsername);
        bggUserId = bggService.getUserIdFromResponse(res);
        console.log("bggId:", bggUserId);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.code === "ERR_NETWORK") bggUserId = "";
        }
    }
    return bggUserId;
};
