const copyButton = document.querySelector("[data-copy-citation]");
const citation = document.querySelector("#bibtex code");
const copyStatus = document.querySelector(".copy-status");

if (copyButton && citation && copyStatus) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(citation.textContent.trim());
      copyStatus.textContent = "BibTeX copied.";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(citation);
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = "BibTeX selected. Press Ctrl+C or Command+C to copy.";
    }
  });
}
