import { render, fireEvent, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  CompaniesDatasetResponse,
  CompanySelector,
} from "./CompanySelector.component";
import { Providers } from "../../util/providers/Providers";

describe("CompanySelector", () => {
  const fooCompany = {
    id: 1,
    dataset_code: "TEST_1",
    description: "Test company 1",
    name: "Foo",
  };
  const barCompany = {
    id: 2,
    dataset_code: "TEST_2",
    description: "Test company 2",
    name: "Bar",
  };

  const server = setupServer(
    rest.get("https://data.nasdaq.com/api/v3/datasets/", (req, res, ctx) => {
      return res(
        ctx.json<CompaniesDatasetResponse>({
          datasets: [fooCompany, barCompany],
          meta: {
            next_page: 2,
            total_count: 2,
            query: "string",
          },
        })
      );
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("renders", async () => {
    render(
      <Providers>
        <CompanySelector onChange={() => {}} />
      </Providers>
    );

    const input = screen.getByLabelText("Company select");

    expect(input).toBeInTheDocument();
  });

  test("renders loading state initially", async () => {
    render(
      <Providers>
        <CompanySelector onChange={() => {}} />
      </Providers>
    );

    const input = screen.getByLabelText("Company select");

    fireEvent.click(input);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders error state if API request fails", async () => {
    server.use(
      rest.get("https://data.nasdaq.com/api/v3/datasets/", (req, res, ctx) => {
        return res(ctx.status(404, "Not found"));
      })
    );

    render(
      <Providers>
        <CompanySelector onChange={() => {}} />
      </Providers>
    );

    const input = screen.getByLabelText("Company select");

    fireEvent.click(input);

    const errorElement = await screen.findByText(/Error:/i);
    expect(errorElement).toBeInTheDocument();
  });

  test("renders error state if network is unavailable", async () => {
    server.use(
      rest.get("https://data.nasdaq.com/api/v3/datasets/", (req, res, ctx) => {
        return res.networkError("Unavailable network");
      })
    );

    render(
      <Providers>
        <CompanySelector onChange={() => {}} />
      </Providers>
    );

    const input = screen.getByLabelText("Company select");

    fireEvent.click(input);

    const errorElement = await screen.findByText(/Error:/i);
    expect(errorElement).toBeInTheDocument();
  });

  test("renders options and calls onChange when an option is selected", async () => {
    const handleChange = jest.fn();
    render(
      <Providers>
        <CompanySelector onChange={handleChange} />
      </Providers>
    );

    const input = screen.getByLabelText("Company select");

    fireEvent.click(input);

    const optionElement = await screen.findByText("Foo");
    expect(optionElement).toBeInTheDocument();

    const option = screen.getByRole("button", { name: "Foo" });

    fireEvent.click(option);
    expect(handleChange).toHaveBeenCalledWith(fooCompany);
  });
});
