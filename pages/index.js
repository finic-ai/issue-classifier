import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [inquiryInput, setInquiryInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("https://issue-classifier-backend-danhm3epmq-uc.a.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inquiry: inquiryInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setInquiryInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Buff Customer Support Demo</title>
      </Head>

      <main className={styles.main}>
        <h1>🦾</h1>
        <h3>Welcome to Home Depot, what is your issue?</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="inquiry"
            placeholder="Enter a question"
            value={inquiryInput}
            onChange={(e) => setInquiryInput(e.target.value)}
          />
          <input type="submit" value="Classify issue" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
