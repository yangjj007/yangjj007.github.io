(() => {
  "use strict";

  const AUTOPLAY_DELAY = 5000;
  const SWIPE_THRESHOLD = 55;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const SAMPLE_DATA_URL = "static/data/review-sample/records.jsonl";
  const taskLabels = {
    "2d-to-3d-reconstruction": "2D → 3D reconstruction",
    "3d-to-2d-projection": "3D → 2D projection",
    "anatomical-annotation": "Anatomical annotation",
    "artifact-removal": "Artifact removal",
    "blank-filling": "Blank filling",
    "contrast-enhancement": "Contrast enhancement",
    "instruction-editing": "Instruction-guided editing",
    "multiple-choice": "Multiple choice",
    "noise-reconstruction": "Noise reconstruction",
    "organic-reconstruction": "Organic reconstruction",
    "organic-removal": "Organic removal",
    "question-answering": "Question answering",
    "report-generation": "Report generation",
    "resolution-editing": "Resolution editing",
    "style-transfer": "Style transfer"
  };
  const formatLabels = {
    VQA: "Visual question answering",
    ImageEditing: "Image editing",
    MultimodalGeneration: "Multimodal generation"
  };

  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const compactText = (value) => String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

  const sampleImageUrl = (file) => `static/data/review-sample/${String(file).replace(/^\.\//, "")}`;

  const sampleMedia = (record) => [
    ...(record.input_files || []).map((file, index) => ({ file, label: `Input ${index + 1}` })),
    ...(record.reference_files || []).map((file, index) => ({ file, label: `Reference ${index + 1}` }))
  ].map(({ file, label }) => `
    <a class="sample-card-media" href="${escapeHtml(sampleImageUrl(file))}" target="_blank" rel="noopener">
      <img src="${escapeHtml(sampleImageUrl(file))}" alt="${escapeHtml(record.sample_id)} ${escapeHtml(label)}" loading="lazy">
      <span>${escapeHtml(label)}</span>
    </a>
  `).join("");

  const sampleCard = (record) => {
    const task = taskLabels[record.task] || record.task;
    const format = formatLabels[record.format] || record.format;
    const instruction = compactText(record.instruction);
    const synopsis = compactText(record.reviewer_synopsis || record.answer);
    const selection = compactText(record.selection_summary);
    const source = compactText(record.source_dataset_label);
    const hasReference = (record.reference_files || []).length > 0;

    return `
      <article class="sample-card${hasReference ? " has-reference" : ""}" data-task="${escapeHtml(record.task)}" data-modality="${escapeHtml(record.canonical_modality)}" data-format="${escapeHtml(record.format)}" data-search="${escapeHtml(`${record.sample_id} ${task} ${record.canonical_modality} ${format} ${instruction} ${synopsis}`.toLowerCase())}">
        <div class="sample-card-topline">
          <span class="sample-card-id">${escapeHtml(record.sample_id)}</span>
          <span class="sample-card-format">${escapeHtml(format)}</span>
        </div>
        <div class="sample-card-heading">
          <h3>${escapeHtml(task)}</h3>
          <span>${escapeHtml(record.canonical_modality)}</span>
        </div>
        <div class="sample-card-media-grid">${sampleMedia(record)}</div>
        <div class="sample-card-copy">
          <p><strong>Instruction</strong>${escapeHtml(instruction)}</p>
          <p class="sample-card-answer"><strong>Reviewer synopsis</strong>${escapeHtml(synopsis)}</p>
          <details>
            <summary>Record details</summary>
            <dl>
              <dt>Source label</dt><dd>${escapeHtml(source || "Not specified")}</dd>
              <dt>Selection note</dt><dd>${escapeHtml(selection || "Curated benchmark record")}</dd>
            </dl>
          </details>
        </div>
      </article>
    `;
  };

  const renderSampleGallery = async (gallery) => {
    gallery.innerHTML = '<p class="sample-gallery-state">Loading the curated review sample…</p>';

    try {
      const response = await fetch(SAMPLE_DATA_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const records = (await response.text())
        .split(/\r?\n/)
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));
      const modalities = [...new Set(records.map((record) => record.canonical_modality))].sort();
      const tasks = [...new Set(records.map((record) => record.task))].sort();
      const formats = [...new Set(records.map((record) => record.format))].sort();

      gallery.innerHTML = `
        <div class="sample-gallery-shell">
          <div class="sample-gallery-stats" aria-label="Review sample coverage">
            <div><strong>${records.length}</strong><span>curated records</span></div>
            <div><strong>${tasks.length}</strong><span>named tasks</span></div>
            <div><strong>${modalities.length}</strong><span>modalities</span></div>
            <div><strong>${formats.length}</strong><span>output formats</span></div>
          </div>
          <div class="sample-gallery-filters" aria-label="Filter gallery records">
            <label>Search<input type="search" data-sample-search placeholder="Search task, anatomy, or sample ID"></label>
            <label>Modality<select data-sample-modality><option value="">All modalities</option>${modalities.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}</select></label>
            <label>Task<select data-sample-task><option value="">All tasks</option>${tasks.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(taskLabels[value] || value)}</option>`).join("")}</select></label>
            <label>Format<select data-sample-format><option value="">All formats</option>${formats.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(formatLabels[value] || value)}</option>`).join("")}</select></label>
            <button class="sample-gallery-reset" type="button" data-sample-reset>Reset</button>
          </div>
          <div class="sample-gallery-resultbar"><span data-sample-count></span><span>Click any image to open its native-resolution file.</span></div>
          <div class="sample-gallery-grid" data-sample-grid></div>
          <p class="sample-gallery-empty" data-sample-empty hidden>No records match these filters.</p>
          <p class="sample-gallery-license">This gallery is a review-only sample for inspection. It is not a clinical dataset release; reuse remains subject to the source-data terms and approvals. <a href="static/data/review-sample/README.md" target="_blank" rel="noopener">Read the sample documentation</a>.</p>
        </div>
      `;

      const search = gallery.querySelector("[data-sample-search]");
      const modality = gallery.querySelector("[data-sample-modality]");
      const task = gallery.querySelector("[data-sample-task]");
      const format = gallery.querySelector("[data-sample-format]");
      const reset = gallery.querySelector("[data-sample-reset]");
      const grid = gallery.querySelector("[data-sample-grid]");
      const count = gallery.querySelector("[data-sample-count]");
      const empty = gallery.querySelector("[data-sample-empty]");

      const update = () => {
        const query = compactText(search.value).toLowerCase();
        const filtered = records.filter((record) => (
          (!query || `${record.sample_id} ${taskLabels[record.task] || record.task} ${record.canonical_modality} ${formatLabels[record.format] || record.format} ${record.instruction} ${record.reviewer_synopsis}`.toLowerCase().includes(query))
          && (!modality.value || record.canonical_modality === modality.value)
          && (!task.value || record.task === task.value)
          && (!format.value || record.format === format.value)
        ));
        grid.innerHTML = filtered.map(sampleCard).join("");
        count.textContent = `${filtered.length} of ${records.length} records shown`;
        empty.hidden = filtered.length !== 0;
      };

      [search, modality, task, format].forEach((control) => control.addEventListener("input", update));
      [modality, task, format].forEach((control) => control.addEventListener("change", update));
      reset.addEventListener("click", () => {
        search.value = "";
        modality.value = "";
        task.value = "";
        format.value = "";
        update();
      });
      update();
    } catch (error) {
      gallery.innerHTML = '<p class="sample-gallery-state sample-gallery-error">The sample gallery could not be loaded. Please serve the project from a local web server so the JSONL asset can be fetched.</p>';
      console.error("MedGEN-Bench sample gallery", error);
    }
  };

  const sampleGallery = document.querySelector("[data-sample-gallery]");
  if (sampleGallery) renderSampleGallery(sampleGallery);

  const belongsTo = (carousel) => (element) => (
    element.closest("[data-carousel]") === carousel
  );

  const carouselControllers = Array.from(
    document.querySelectorAll("[data-carousel]")
  ).map((carousel) => {
    const isOwned = belongsTo(carousel);
    const findAll = (selector) => Array.from(
      carousel.querySelectorAll(selector)
    ).filter(isOwned);
    const findOne = (selector) => findAll(selector)[0] || null;

    const slides = findAll("[data-carousel-slide]");
    const dots = findAll("[data-carousel-dot]");
    const previous = findOne("[data-carousel-prev]");
    const next = findOne("[data-carousel-next]");
    const status = findOne("[data-carousel-status]");
    const toggle = findOne("[data-carousel-toggle]");
    const toggleIcon = findOne("[data-carousel-toggle-icon]");
    const toggleLabel = findOne("[data-carousel-toggle-label]");

    if (slides.length === 0) return null;

    const classActiveIndex = slides.findIndex((slide) => (
      slide.classList.contains("is-active")
    ));
    const visibleIndex = slides.findIndex((slide) => !slide.hidden);
    const initiallyActive = classActiveIndex === -1 ? visibleIndex : classActiveIndex;

    let activeIndex = initiallyActive === -1 ? 0 : initiallyActive;
    let autoplayTimer = null;
    let hoverPaused = false;
    let focusPaused = carousel.contains(document.activeElement);
    let userPaused = false;
    let touchStart = null;

    const dotTarget = (dot, fallbackIndex) => {
      const value = dot.getAttribute("data-carousel-dot");
      if (value === null || value.trim() === "") return fallbackIndex;

      const parsed = Number(value);
      return Number.isInteger(parsed) ? parsed : fallbackIndex;
    };

    const stopAutoplay = () => {
      if (autoplayTimer === null) return;
      window.clearTimeout(autoplayTimer);
      autoplayTimer = null;
    };

    const canAutoplay = () => (
      slides.length > 1
      && !userPaused
      && !hoverPaused
      && !focusPaused
      && !document.hidden
      && !reducedMotion.matches
    );

    const updateToggle = () => {
      if (!toggle) return;

      toggle.hidden = reducedMotion.matches || slides.length < 2;
      toggle.setAttribute("aria-pressed", String(userPaused));
      toggle.setAttribute(
        "aria-label",
        userPaused ? "Resume automatic slide rotation" : "Pause automatic slide rotation"
      );

      if (toggleIcon) toggleIcon.textContent = userPaused ? "▶" : "Ⅱ";
      if (toggleLabel) toggleLabel.textContent = userPaused ? "Play" : "Pause";
    };

    const showSlide = (requestedIndex, { automatic = false } = {}) => {
      activeIndex = ((requestedIndex % slides.length) + slides.length) % slides.length;

      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.hidden = !isActive;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach((dot, index) => {
        const targetIndex = dotTarget(dot, index);
        const distance = Math.abs(targetIndex - activeIndex);
        const isActive = distance === 0;

        dot.classList.toggle("is-active", isActive);
        dot.classList.toggle("is-distance-1", distance === 1);
        dot.classList.toggle("is-distance-2", distance === 2);
        dot.setAttribute("aria-pressed", String(isActive));

        if (isActive) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });

      if (status) {
        const label = slides[activeIndex].dataset.carouselLabel || "";
        status.setAttribute("aria-live", automatic ? "off" : "polite");
        status.textContent = `${activeIndex + 1} / ${slides.length}${label ? ` · ${label}` : ""}`;
      }
    };

    const scheduleAutoplay = () => {
      stopAutoplay();
      if (!canAutoplay()) return;

      autoplayTimer = window.setTimeout(() => {
        autoplayTimer = null;
        showSlide(activeIndex + 1, { automatic: true });
        scheduleAutoplay();
      }, AUTOPLAY_DELAY);
    };

    const showManualSlide = (index) => {
      showSlide(index);
      scheduleAutoplay();
    };

    if (previous) {
      previous.addEventListener("click", () => showManualSlide(activeIndex - 1));
      previous.disabled = slides.length < 2;
    }

    if (next) {
      next.addEventListener("click", () => showManualSlide(activeIndex + 1));
      next.disabled = slides.length < 2;
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showManualSlide(dotTarget(dot, index)));
    });

    if (toggle) {
      toggle.addEventListener("click", () => {
        userPaused = !userPaused;
        updateToggle();

        if (userPaused) stopAutoplay();
        else scheduleAutoplay();
      });
    }

    carousel.addEventListener("keydown", (event) => {
      if (event.target.closest("[data-carousel]") !== carousel) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showManualSlide(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showManualSlide(activeIndex + 1);
      }
    });

    carousel.addEventListener("mouseenter", () => {
      hoverPaused = true;
      stopAutoplay();
    });

    carousel.addEventListener("mouseleave", () => {
      hoverPaused = false;
      scheduleAutoplay();
    });

    carousel.addEventListener("focusin", () => {
      focusPaused = true;
      stopAutoplay();
    });

    carousel.addEventListener("focusout", (event) => {
      if (event.relatedTarget && carousel.contains(event.relatedTarget)) return;
      focusPaused = false;
      scheduleAutoplay();
    });

    carousel.addEventListener("touchstart", (event) => {
      if (event.target.closest("[data-carousel]") !== carousel) return;
      if (event.changedTouches.length === 0) return;
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
      if (event.target.closest("[data-carousel]") !== carousel) return;
      if (!touchStart || event.changedTouches.length === 0) return;

      const touch = event.changedTouches[0];
      const distanceX = touch.clientX - touchStart.x;
      const distanceY = touch.clientY - touchStart.y;
      touchStart = null;

      if (
        Math.abs(distanceX) < SWIPE_THRESHOLD
        || Math.abs(distanceX) <= Math.abs(distanceY)
      ) return;

      showManualSlide(activeIndex + (distanceX < 0 ? 1 : -1));
    }, { passive: true });

    carousel.addEventListener("touchcancel", () => {
      touchStart = null;
    }, { passive: true });

    const refreshAutoplay = () => {
      updateToggle();
      scheduleAutoplay();
    };

    showSlide(activeIndex, { automatic: true });
    updateToggle();
    scheduleAutoplay();

    return { refreshAutoplay };
  }).filter(Boolean);

  if (carouselControllers.length === 0) return;

  const refreshCarousels = () => {
    carouselControllers.forEach(({ refreshAutoplay }) => refreshAutoplay());
  };

  document.addEventListener("visibilitychange", refreshCarousels);

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", refreshCarousels);
  } else {
    reducedMotion.addListener(refreshCarousels);
  }
})();
