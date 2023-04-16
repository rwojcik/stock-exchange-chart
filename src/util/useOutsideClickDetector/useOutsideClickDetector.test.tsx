import { fireEvent, render, renderHook } from "@testing-library/react";
import { useOutsideClickDetector } from "./useOutsideClickDetector";

describe("useOutsideClickDetector", () => {
  it("should call the callback only when clicked outside of the element", () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useOutsideClickDetector<HTMLDivElement>(callback)
    );

    const div = document.createElement("div");
    const { rerender } = render(
      <div ref={result.current}>hooked</div>
    );

    fireEvent.mouseDown(div);
    expect(callback).not.toHaveBeenCalled();

    fireEvent.mouseDown(document);
    expect(callback).toHaveBeenCalled();

    rerender(<div ref={null} />);

    fireEvent.mouseDown(document);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
