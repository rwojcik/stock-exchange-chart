import { render, fireEvent, screen } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return initial value when no value is stored in local storage", () => {
    const key = "testKey";
    const initialValue = "testValue";

    const TestComponent = () => {
      const [value] = useLocalStorage(key, initialValue);
      return <div>{value}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText(initialValue)).toBeInTheDocument();
  });

  it("should return value stored in local storage when available", () => {
    const key = "testKey";
    const storedValue = "storedValue";
    localStorage.setItem(key, JSON.stringify(storedValue));

    const TestComponent = () => {
      const [value] = useLocalStorage(key, "");
      return <div>{value}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText(storedValue)).toBeInTheDocument();
  });

  it("should update value in local storage when value changes", () => {
    const key = "testKey";
    const initialValue = "initialValue";
    const updatedValue = "updatedValue";

    const TestComponent = () => {
      const [value, setValue] = useLocalStorage(key, initialValue);

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      };

      return (
        <div>
          <input type="text" value={value} onChange={handleChange} />
          <div>{value}</div>
        </div>
      );
    };

    render(<TestComponent />);
    const input = screen.getByRole("textbox");
    const valueDiv = screen.getByText(initialValue);

    expect(input).toHaveValue(initialValue);
    expect(valueDiv).toBeInTheDocument();

    fireEvent.change(input, { target: { value: updatedValue } });

    expect(input).toHaveValue(updatedValue);
    expect(valueDiv).toHaveTextContent(updatedValue);
    expect(localStorage.getItem(key)).toEqual(JSON.stringify(updatedValue));
  });
});
