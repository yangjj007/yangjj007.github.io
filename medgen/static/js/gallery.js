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
  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const compactText = (value) => String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

  const randomSample = (records, count) => {
    const shuffled = [...records];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  const chunk = (items, size) => Array.from(
    { length: Math.ceil(items.length / size) },
    (_, index) => items.slice(index * size, (index + 1) * size)
  );

  const sampleImageUrl = (file) => `static/data/review-sample/${String(file).replace(/^\.\//, "")}`;

  const sampleImageMosaic = (record, files, type) => {
    const images = files.length > 0 ? files : [];
    const labelRoot = type === "input" ? "Input" : "Reference";

    return `
      <div class="sample-image-mosaic sample-image-mosaic-${Math.min(images.length, 3)}">
        ${images.map((file, index) => `
          <a class="sample-image-link" href="${escapeHtml(sampleImageUrl(file))}" target="_blank" rel="noopener" aria-label="Open ${labelRoot.toLowerCase()} image ${index + 1} at full resolution">
            <img src="${escapeHtml(sampleImageUrl(file))}" alt="${labelRoot} ${index + 1}, ${escapeHtml(record.canonical_modality || "medical image")}" loading="lazy">
            ${images.length > 1 ? `<span class="sample-image-index">${labelRoot} ${index + 1}</span>` : ""}
          </a>
        `).join("")}
      </div>
    `;
  };

  const sampleOverlay = ({ kicker, title, label, text }) => `
    <div class="sample-hover-overlay" tabindex="0">
      <span class="sample-hover-kicker">${escapeHtml(kicker)}</span>
      <strong>${escapeHtml(title)}</strong>
      <span class="sample-hover-copy"><b>${escapeHtml(label)}</b>${escapeHtml(text)}</span>
    </div>
  `;

  const sampleVisualPanel = ({ record, files, type, overlay }) => {
    const panelLabel = type === "input" ? "Benchmark Input" : "Reference Target";

    return `
      <figure class="sample-visual-panel" data-panel-label="${escapeHtml(panelLabel)}">
        <h3 class="sample-mobile-panel-title">${escapeHtml(panelLabel)}</h3>
        <div class="sample-visual-stage">
          ${sampleImageMosaic(record, files, type)}
          ${sampleOverlay(overlay)}
        </div>
      </figure>
    `;
  };

  const sampleTextTarget = (record, task, synopsis) => {
    return `
      <figure class="sample-visual-panel sample-text-target" data-panel-label="Reference Target">
        <h3 class="sample-mobile-panel-title">Reference Target</h3>
        <div class="sample-visual-stage sample-text-stage" tabindex="0" aria-label="Text response. Focus or hover to read the reviewer synopsis.">
          <div class="sample-text-stage-summary">
            <span>Text-only target</span>
            <p>This VQA example has no reference image. Its target is a short text response.</p>
          </div>
          ${sampleOverlay({
            kicker: "Text response",
            title: task,
            label: "Reviewer synopsis",
            text: synopsis
          })}
        </div>
      </figure>
    `;
  };

  const sampleShowcase = (record) => {
    const task = taskLabels[record.task] || record.task;
    const instruction = compactText(record.instruction);
    const synopsis = compactText(record.reviewer_synopsis || record.answer);
    const subtask = compactText(record.named_subtask) || task;
    const inputFiles = record.input_files || [];
    const referenceFiles = record.reference_files || [];

    return `
      <article class="sample-showcase" aria-label="${escapeHtml(task)} example">
        <div class="sample-showcase-grid">
          ${sampleVisualPanel({
            record,
            files: inputFiles,
            type: "input",
            overlay: {
              kicker: task,
              title: subtask,
              label: "Instruction",
              text: instruction
            }
          })}
          ${referenceFiles.length > 0 ? sampleVisualPanel({
            record,
            files: referenceFiles,
            type: "reference",
            overlay: {
              kicker: "Reference target",
              title: task,
              label: "Reviewer synopsis",
              text: synopsis
            }
          }) : sampleTextTarget(record, task, synopsis)}
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
      const imageTargetRecords = records.filter((record) => record.format !== "VQA");
      const selectedRecords = randomSample(imageTargetRecords, 10);
      const pages = chunk(selectedRecords, 2);

      gallery.innerHTML = `
        <div class="sample-gallery-shell">
          <div class="sample-carousel" data-carousel role="region" aria-roledescription="carousel" aria-label="Random MedGEN-Bench examples" tabindex="0">
            <div class="sample-carousel-frame">
              <button class="sample-carousel-arrow sample-carousel-prev" type="button" data-carousel-prev aria-label="Previous examples">‹</button>
              <div class="sample-carousel-viewport">
                ${pages.map((page, pageIndex) => `
                  <div class="sample-carousel-slide${pageIndex === 0 ? " is-active" : ""}" data-carousel-slide data-carousel-label="Examples ${pageIndex * 2 + 1}–${pageIndex * 2 + page.length}" role="group" aria-roledescription="slide" aria-label="Example page ${pageIndex + 1} of ${pages.length}"${pageIndex === 0 ? "" : " hidden"}>
                    <div class="sample-gallery-column-head" aria-hidden="true">
                      <span>Benchmark Input</span>
                      <span>Reference Target</span>
                    </div>
                    <div class="sample-showcase-list">${page.map(sampleShowcase).join("")}</div>
                  </div>
                `).join("")}
              </div>
              <button class="sample-carousel-arrow sample-carousel-next" type="button" data-carousel-next aria-label="Next examples">›</button>
            </div>
            <div class="sample-carousel-navigation">
              <div class="gallery-dots" role="group" aria-label="Choose an example page">
                ${pages.map((_, pageIndex) => `<button class="gallery-dot${pageIndex === 0 ? " is-active" : ""}" type="button" data-carousel-dot="${pageIndex}" aria-label="Show example page ${pageIndex + 1}" aria-pressed="${pageIndex === 0}"${pageIndex === 0 ? ' aria-current="true"' : ""}></button>`).join("")}
              </div>
              <p class="gallery-status visually-hidden" data-carousel-status aria-live="polite">1 / ${pages.length} · Examples 1–2</p>
            </div>
          </div>
        </div>
      `;

      const controller = initializeCarousel(gallery.querySelector("[data-carousel]"));
      if (controller) carouselControllers.push(controller);
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

  const carouselControllers = [];

  const initializeCarousel = (carousel) => {
    if (!carousel) return null;
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
  };

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const controller = initializeCarousel(carousel);
    if (controller) carouselControllers.push(controller);
  });

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
