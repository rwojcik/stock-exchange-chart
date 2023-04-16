import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import styles from "./CompanySelector.module.css";
import { useOutsideClickDetector } from "../../util/useOutsideClickDetector/useOutsideClickDetector";
import clsx from "clsx";
import { useDebounce } from "use-debounce";

export type Company = {
  id: number;
  name: string;
  description: string;
  dataset_code: string;
};

export type CompaniesDatasetResponse = {
  datasets: Array<Company>;
  meta: {
    next_page: number;
    total_count: number;
    query: string;
  };
};

export type CompanySelectorProps = {
  onChange: (company: Company) => void;
  apiKey?: string;
};

export function CompanySelector({
  onChange,
  apiKey = "",
}: CompanySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isFetching,
    isFetched,
  } = useInfiniteQuery<CompaniesDatasetResponse, Error>(
    ["companies", apiKey, debouncedSearchQuery],
    ({ pageParam = 1 }) =>
      fetch(
        `https://data.nasdaq.com/api/v3/datasets/?database_code=WIKI&page=${pageParam}&query=${debouncedSearchQuery}&api_key=${apiKey}`
      ).then<CompaniesDatasetResponse>((res) => res.json()),
    {
      getNextPageParam: (lastPage) => lastPage.meta.next_page,
    }
  );

  const handleChange = (id: number) => {
    const option = data?.pages
      .flatMap((page) => page.datasets)
      .find((c) => c.id === id);
    if (option) {
      onChange(option);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const resultsRef = useOutsideClickDetector<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  const handleLoadMoreClick = () => {
    fetchNextPage();
  };

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  const options = data?.pages
    .flatMap((p) => p.datasets)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={styles.companySelector}>
      <div className={clsx(styles.inputWrapper, { [styles.open]: isOpen })}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onClick={handleInputClick}
          placeholder="Select a company or query for one..."
          aria-label="Company select"
        />
      </div>
      {isOpen && (
        <div className={styles.results} ref={resultsRef}>
          {isFetching && <div className={styles.status}>Loading...</div>}
          {isFetched && options && options.length > 0 ? (
            <>
              <ul>
                {options.map(({ id, name }) => (
                  <li key={id} onClick={() => handleChange(id)} role="button">
                    {name}
                  </li>
                ))}
              </ul>
              {hasNextPage && (
                <button
                  className={styles.loadMoreButton}
                  onClick={handleLoadMoreClick}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage
                    ? "Loading more options..."
                    : "Load more options"}
                </button>
              )}
            </>
          ) : (
            <div className={styles.status}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
