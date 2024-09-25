<script lang="ts">
  import { completeWithGroq } from "./lib/api/groq";
  import { fetchDataFromRepo } from "./lib/api/github";
  import { marked } from "marked";
  import { downloadTextAsFile, downloadTextAsPdf } from "./lib/utils/utils";

  let repoUrl = "";
  let isValidUrl = false;
  let loading = false;
  let resultInMd = "";
  let resultInHtml = "";

  const githubUrlRE = new RegExp(/https:\/\/github.com\/(.+?)\/(.+)/);
  $: isValidUrl = githubUrlRE.test(repoUrl);

  async function submitCreation() {
    loading = true;
    const reposToFeed = await fetchDataFromRepo(repoUrl);
    console.log(reposToFeed);
    const message = await completeWithGroq(reposToFeed);
    const messageInMD = await marked(message || "");
    resultInMd = message;
    resultInHtml = messageInMD;
    loading = false;
  }
</script>

<main>
  {#if loading}
    <h1>Loading...</h1>
  {:else if resultInHtml?.length}
    <div class="results">
      <header>
        <button
          on:click={() => downloadTextAsFile("documentation.md", resultInMd)}
          >Download as Markdown</button
        >
        <button
          on:click={() => downloadTextAsPdf("documentation", resultInHtml)}
          >Download as PDF</button
        >
      </header>
      <article>{@html resultInHtml}</article>
    </div>
  {:else}
    <div class="main-input">
      <div>
        <h1>Code 2 Doc</h1>
        <h2>Document your repository</h2>
      </div>
      <label>
        <p>GitHub Repository URL:</p>
        <input type="text" bind:value={repoUrl} />
      </label>
      <button on:click={submitCreation} disabled={!isValidUrl}>Create</button>
    </div>
  {/if}
</main>

<style>
  main {
    width: 100dvw;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .results {
    max-height: 90%;
    max-width: 90%;
    overflow-y: auto;
  }

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  h1 {
    text-align: center;
  }

  h2 {
    color: #484444;
  }

  input {
    border-radius: 15px;
    padding: 1rem;
  }

  button {
    border-radius: 15px;
    padding: 1rem;
    background-color: #00ff00;
    color: #000;
    cursor: pointer;
    border: 0;
  }

  button:hover:not(:disabled) {
    background-color: #0d950d;
  }

  button:disabled {
    background-color: #484444;
    cursor: not-allowed;
  }

  .main-input {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 768px) {
    .main-input {
      width: 90%;
    }
  }
</style>
