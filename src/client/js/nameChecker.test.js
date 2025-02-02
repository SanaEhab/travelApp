import { checkForName } from './nameChecker';


global.alert = jest.fn();

describe("Testing the checkForName function", () => {
    test("It should alert 'Welcome, Captain!' for valid names", () => {
        checkForName("Picard");
        expect(global.alert).toHaveBeenCalledWith("Welcome, Captain!");

    });

    test("It should alert 'Enter a valid captain name' for invalid names", () => {
        checkForName("John");
        expect(global.alert).toHaveBeenCalledWith("Enter a valid captain name");

    });
});
