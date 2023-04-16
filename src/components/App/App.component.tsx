import { ApiKeyInput } from "../ApiKeyInput/ApiKeyInput.component";
import { useLocalStorage } from "../../util/useLocalStorage/useLocalStorage";
import {
  Company,
  CompanySelector,
} from "../CompanySelector/CompanySelector.component";
import { useState } from "react";
import { CompanyChart } from "../CompanyChart/CompanyChart.component";
import styles from "./App.module.css";

export function App() {
  const [apiKey, setApiKey] = useLocalStorage("api_key");
  const [company, setCompany] = useState<Company>();

  function handleChangeApiKey(value: string) {
    setApiKey(value);
  }

  function handleCompanyChange(company: Company) {
    setCompany(company);
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <ApiKeyInput onChange={handleChangeApiKey} value={apiKey} />
        <CompanySelector onChange={handleCompanyChange} apiKey={apiKey} />
      </header>
      {company != null && (
        <main>
          <CompanyChart company={company} apiKey={apiKey} />
        </main>
      )}
    </div>
  );
}
