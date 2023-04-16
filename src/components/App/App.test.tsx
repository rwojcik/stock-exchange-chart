import { render, screen } from "@testing-library/react";
import { App } from "./App.component";
import { Providers } from "../../util/providers/Providers";

describe("App", () => {
  test("renders api key and company selector inputs", () => {
    render(
      <Providers>
        <App />
      </Providers>
    );
    const apiInput = screen.getByLabelText("API key");
    expect(apiInput).toBeInTheDocument();

    const companySelector = screen.getByLabelText("Company select");
    expect(companySelector).toBeInTheDocument();
  });
});
