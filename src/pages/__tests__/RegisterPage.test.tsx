import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { RegisterPage } from "../RegisterPage";

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthContext
vi.mock("../../contexts/AuthContext", async () => {
  const actual = await vi.importActual("../../contexts/AuthContext");
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      register: vi.fn(),
    })),
  };
});

import { useAuth } from "../../contexts/AuthContext";

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it("renders registration form", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/🍰 Sweet Shop/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    // Check for password fields by their specific labels
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  it("displays link to login page", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const loginLink = screen.getByRole("link", { name: /login here/i });
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("handles successful registration", async () => {
    const user = userEvent.setup();
    const mockRegister = vi.fn().mockResolvedValueOnce(undefined);
    (useAuth as any).mockReturnValue({
      register: mockRegister,
    });

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInputs = screen.getAllByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    await user.type(emailInput, "newuser@example.com");
    await user.type(passwordInputs[0], "securepass123"); // password
    await user.type(passwordInputs[1], "securepass123"); // confirm password

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "newuser@example.com",
        "securepass123"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("displays error message on failed registration", async () => {
    const user = userEvent.setup();
    const mockRegister = vi.fn().mockRejectedValueOnce({
      response: { data: { error: "Email already in use" } },
    });
    (useAuth as any).mockReturnValue({
      register: mockRegister,
    });

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInputs = screen.getAllByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    await user.type(emailInput, "existing@example.com");
    await user.type(passwordInputs[0], "password123");
    await user.type(passwordInputs[1], "password123");

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email already in use")).toBeInTheDocument();
    });
  });

  it("validates email field is required", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    }) as HTMLInputElement;
    expect(emailInput.required).toBe(true);
  });

  it("validates password field is required", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText(
      /^Password$/i
    ) as HTMLInputElement;
    expect(passwordInput.required).toBe(true);
  });

  it("disables submit button while registering", async () => {
    const user = userEvent.setup();
    const mockRegister = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    );
    (useAuth as any).mockReturnValue({
      register: mockRegister,
    });

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInputs = screen.getAllByLabelText(/password/i);
    const button = screen.getByRole("button", { name: /register/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInputs[0], "password123");
    await user.type(passwordInputs[1], "password123");

    await user.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });
});
