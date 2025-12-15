import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "../LoginPage";

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
      login: vi.fn(),
    })),
  };
});

import { useAuth } from "../../contexts/AuthContext";

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it("renders login form", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText("🍰 Sweet Shop")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("displays link to registration page", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const registerLink = screen.getByRole("link", { name: /register here/i });
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("handles successful login", async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn().mockResolvedValueOnce(undefined);
    (useAuth as any).mockReturnValue({
      login: mockLogin,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("displays error message on failed login", async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn().mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });
    (useAuth as any).mockReturnValue({
      login: mockLogin,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("shows loading state while logging in", async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    );
    (useAuth as any).mockReturnValue({
      login: mockLogin,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it("clears error when user starts typing", async () => {
    const user = userEvent.setup();
    const mockLogin = vi
      .fn()
      .mockRejectedValueOnce({
        response: { data: { error: "Invalid credentials" } },
      })
      .mockResolvedValueOnce(undefined);
    (useAuth as any).mockReturnValue({
      login: mockLogin,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "test");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    // Mock succeeds on second call
    await user.clear(passwordInput);
    await user.type(passwordInput, "correctpassword");
    await user.click(submitButton);

    // Error should be cleared when login succeeds
    await waitFor(() => {
      expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
    });
  });
});
