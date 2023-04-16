import { render, fireEvent, screen } from "@testing-library/react";
import { ApiKeyInput } from "./ApiKeyInput.component";

describe("ApiKeyInput component", () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it("should render with the correct label", () => {
    render(<ApiKeyInput value="" onChange={onChange} />);

    expect(screen.getByLabelText("API key")).toBeInTheDocument();
  });

  it("should call onChange when the input value changes", () => {
    render(<ApiKeyInput value="" onChange={onChange} />);

    const input = screen.getByLabelText("API key");

    fireEvent.change(input, { target: { value: "test value" } });

    expect(onChange).toHaveBeenCalledWith("test value");
  });

  it("should display the correct input value", () => {
    render(<ApiKeyInput value="test value" onChange={onChange} />);

    const input = screen.getByLabelText("API key") as HTMLInputElement;

    expect(input.value).toBe("test value");
  });
});
