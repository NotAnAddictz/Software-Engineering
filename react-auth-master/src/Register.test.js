import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import Register from './Register';

describe('A registeration email tests', () => {
  
  let emailInput;
  let passwordInput;
  let confirmPasswordInput;
  let usertypeInput;
  let submitButton;

  afterEach(cleanup)

  test("Cannot register an already taken email", () => {
    render(<Register />);

    emailInput = screen.getByTestId("reg-email");
    passwordInput = screen.getByTestId("reg-password");
    confirmPasswordInput = screen.getByTestId("reg-confpassword");
    usertypeInput = screen.getByTestId("reg-usertype");
    submitButton = screen.getByTestId("reg-button");

    fireEvent.change(emailInput, { target: { value: "2112irfan@gmail.com"}});
    fireEvent.change(passwordInput, { target: { value: "P4$$w0rd"}});
    fireEvent.change(confirmPasswordInput, { target: { value: "P4$$w0rd"}});
    fireEvent.change(usertypeInput, { target: { value: "Adult"}});
    fireEvent.click(submitButton);

    expect(screen.getByTestId("reg-notReg")).toBeInTheDocument;
  });

  test("Can register an email not taken", () => {
    render(<Register />);
    
    emailInput = screen.getByTestId("reg-email");
    passwordInput = screen.getByTestId("reg-password");
    confirmPasswordInput = screen.getByTestId("reg-confpassword");
    usertypeInput = screen.getByTestId("reg-usertype");
    submitButton = screen.getByTestId("reg-button");

    fireEvent.change(emailInput, { target: { value: "21ifran@gmail.com"}});
    fireEvent.change(passwordInput, { target: { value: "P4$$w0rd"}});
    fireEvent.change(confirmPasswordInput, { target: { value: "P4$$w0rd"}});
    fireEvent.change(usertypeInput, { target: { value: "Adult"}});
    fireEvent.click(submitButton);

    expect(screen.findByTestId("reg-Reg")).toBeInTheDocument;
  });
});