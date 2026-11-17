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

// Figure links still open the original asset when a reader follows them in a new tab.
if (typeof HTMLDialogElement !== "undefined" && HTMLDialogElement.prototype.showModal) {
  const dialog = document.createElement("dialog");
  dialog.className = "figure-dialog";
  dialog.setAttribute("aria-label", "Expanded paper figure");
  dialog.innerHTML = `
    <form method="dialog" class="figure-tools">
      <a class="button" target="_blank" rel="noopener">Open original ↗</a>
      <button class="button" type="submit" autofocus>Close</button>
    </form>
    <figure><img alt=""><figcaption></figcaption></figure>`;
  const original = dialog.querySelector("a");
  const expanded = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  document.body.append(dialog);

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("figure a[href]");
    if (!link || !/\.(?:webp|png|jpe?g)(?:[?#]|$)/i.test(link.pathname)) return;
    const thumbnail = link.querySelector("img");
    if (!thumbnail) return;
    event.preventDefault();
    expanded.src = original.href = link.href;
    expanded.alt = thumbnail.alt;
    caption.textContent = link.closest("figure").querySelector("figcaption")?.textContent.trim() || "";
    dialog.showModal();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) {
      dialog.close();
    }
  });
}
