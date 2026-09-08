"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import ThemeToggle from "./theme-toggle";

const tabs = ["Home", "About", "Notes", "Env"] as const;
type Tab = (typeof tabs)[number];

// The values behind the Env tab; fetched from /api/env-test because env
// vars only exist server-side.
type EnvTest = { injected: string | null; dotenv: string | null; error?: string };

const tabCopy: Record<Exclude<Tab, "Home" | "Env">, { eyebrow: string; title: string; body: string }> = {
  About: {
    eyebrow: "About this project",
    title: "Small on purpose.",
    body: "This is a clean Next.js starting point for trying cloud-agent changes without a lot of setup or existing product complexity.",
  },
  Notes: {
    eyebrow: "A blank canvas",
    title: "What should we build next?",
    body: "Try asking an agent to add a photo gallery, a guestbook, or a new page. This tab is ready to become anything.",
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [envTest, setEnvTest] = useState<EnvTest | null>(null);

  useEffect(() => {
    if (activeTab !== "Env") return;
    setEnvTest(null);
    fetch("/api/env-test")
      .then((res) => res.json())
      .then((data: EnvTest) => setEnvTest(data))
      .catch((error) => setEnvTest({ injected: null, dotenv: null, error: String(error) }));
  }, [activeTab]);

  return (
    <main>
      <header className="site-header">
        <button className="brand" type="button" onClick={() => setActiveTab("Home")}>
          <span className="brand-mark" aria-hidden="true">●</span>
          Good Day
        </button>

        <nav className="tabs" aria-label="Main navigation">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab ? "tab active" : "tab"}
              type="button"
              key={tab}
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <ThemeToggle />
      </header>

      {activeTab === "Home" ? (
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">A simple Next.js starter</p>
          <h1 id="hero-title">Here’s a dog.</h1>
          <p className="intro">
            A tiny, friendly app made for testing ideas, shipping small changes,
            and giving a cloud agent somewhere pleasant to start.
          </p>

          <figure className="dog-card">
            <Image
              className="dog-image"
              src="/dog.png"
              alt="A happy golden retriever sitting in a sunlit meadow"
              width={1400}
              height={1124}
              priority
              sizes="(max-width: 720px) 90vw, 620px"
            />
            <figcaption>Professional good dog · Available for treats</figcaption>
          </figure>
        </section>
      ) : activeTab === "Env" ? (
        <section className="text-panel" aria-live="polite">
          <p className="eyebrow">Environment test</p>
          <h1>Where did each value come from?</h1>
          <p className="intro">
            <code>INJECTED_MESSAGE</code> should arrive through the process
            environment (an injected repo-environment var);{" "}
            <code>DOTENV_MESSAGE</code> through a <code>.env</code> file at the
            repo root, loaded by Next.js at server start.
          </p>
          {envTest === null ? (
            <p className="intro">Loading…</p>
          ) : envTest.error ? (
            <p className="intro">Could not reach /api/env-test: {envTest.error}</p>
          ) : (
            <ul className="intro" style={{ listStyle: "none", padding: 0 }}>
              <li>
                <code>INJECTED_MESSAGE</code> (injected):{" "}
                <strong>{envTest.injected ?? "(not set)"}</strong>
              </li>
              <li>
                <code>DOTENV_MESSAGE</code> (.env file):{" "}
                <strong>{envTest.dotenv ?? "(not set)"}</strong>
              </li>
            </ul>
          )}
          <button className="back-button" type="button" onClick={() => setActiveTab("Home")}>
            Back to the dog <span aria-hidden="true">→</span>
          </button>
        </section>
      ) : (
        <section className="text-panel" aria-live="polite">
          <p className="eyebrow">{tabCopy[activeTab].eyebrow}</p>
          <h1>{tabCopy[activeTab].title}</h1>
          <p className="intro">{tabCopy[activeTab].body}</p>
          <button className="back-button" type="button" onClick={() => setActiveTab("Home")}>
            Back to the dog <span aria-hidden="true">→</span>
          </button>
        </section>
      )}

      <footer>
        Built with Next.js <span aria-hidden="true">·</span> Ready for experiments
      </footer>
    </main>
  );
}
