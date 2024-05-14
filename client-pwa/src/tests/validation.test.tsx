import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import SingInForm from "../components/forms/SignInForm";

describe("SignInForm validation", () => {
    it("it should display alert after using incorrect username and password", async () => {
        //BrowserRouter is required for testing this component.
        //screen.debug(); Uncomment to debug the test code.
        const user = userEvent.setup();
        render(
            <BrowserRouter>
                <SingInForm />
            </BrowserRouter>
        );

        const usernameInput = screen.getByText("Username");
        const passwordInput = screen.getByText("Password");
        const submitButton = screen.getByRole("button", { name: "Sign in" });
        await user.type(usernameInput, "a");
        await user.type(passwordInput, "a");
        await user.click(submitButton);

        expect(screen.getByText("Incorrect username or password.")).toBeInTheDocument();
    });
});
