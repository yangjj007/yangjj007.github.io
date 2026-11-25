const gallery = document.querySelector('[data-model-gallery]');

if (gallery) {
  const cases = [...gallery.querySelectorAll('.model-gallery__case')];
  const links = [...gallery.querySelectorAll('.model-gallery__picker a')];
  const controls = gallery.querySelector('.model-gallery__controls');
  const status = controls.querySelector('[role="status"]');
  const buttons = [...controls.querySelectorAll('button')];
  let current;
  let viewer;
  let stageResize;
  let nearViewport = false;
  let generation = 0;
  let runtime;

  function loadRuntime() {
    if (!runtime) {
      const context = document.createElement('canvas').getContext('webgl2');
      if (!context) throw new Error('WebGL 2 is unavailable');
      context.getExtension('WEBGL_lose_context')?.loseContext();
      runtime = import('./vendor/model-viewer-4.4.0/model-viewer.min.js');
    }
    return runtime;
  }

  function resetView() {
    viewer.cameraTarget = 'auto auto auto';
    viewer.cameraOrbit = current.dataset.orbit + ' 105%';
    viewer.fieldOfView = 'auto';
    viewer.jumpCameraToGoal();
  }

  function frameOnOrbit(model) {
    const size = model.getDimensions();
    const fitRadius = model.getCameraOrbit().radius;
    const tanFov = Math.tan(15 * Math.PI / 180);
    function fit() {
      const aspect = model.clientWidth / model.clientHeight;
      if (!aspect) return;
      const {theta, phi} = model.getCameraOrbit();
      const sin = Math.abs(Math.sin(theta)), cos = Math.abs(Math.cos(theta));
      const rise = Math.abs(Math.cos(phi)), run = Math.abs(Math.sin(phi));
      // Project the bounds at the original camera distance. This enlarges side
      // views while reserving space for the tail at the poles. User zoom and
      // pan still act independently on the scene inside this frame.
      const horizontal = (cos * size.x + sin * size.z) / 2;
      const alongView = (sin * size.x + cos * size.z) / 2;
      const vertical = rise * alongView + run * size.y / 2;
      const depth = run * alongView + rise * size.y / 2;
      const halfHeight = (fitRadius - depth) * tanFov * Math.max(1, model.getIdealAspect() / aspect);
      const scale = Math.max(1, Math.min(1.8, .89 * halfHeight / vertical, .89 * halfHeight * aspect / horizontal));
      model.style.transform = 'scale(' + scale.toFixed(3) + ')';
    }
    fit();
    model.addEventListener('camera-change', fit);
    stageResize = new ResizeObserver(fit);
    stageResize.observe(model.parentElement);
  }

  async function openModel() {
    const ticket = ++generation;
    const panel = current;
    const stage = panel.querySelector('.model-gallery__stage');
    const poster = stage.querySelector('img');
    status.textContent = 'Loading 3D model…';
    try {
      await loadRuntime();
      if (ticket !== generation) return;
      const model = document.createElement('model-viewer');
      viewer = model;
      model.alt = panel.dataset.description;
      model.cameraControls = true;
      model.cameraOrbit = panel.dataset.orbit + ' 105%';
      model.minCameraOrbit = 'auto 0deg auto';
      model.maxCameraOrbit = 'auto 180deg 250%';
      model.touchAction = 'none';
      model.disableTap = true;
      model.interactionPrompt = 'none';
      model.loading = 'eager';
      model.shadowIntensity = 0;
      model.poster = poster.src;
      model.addEventListener('load', () => {
        if (ticket !== generation) return;
        frameOnOrbit(model);
        poster.hidden = true;
        status.textContent = 'Drag to rotate. Scroll or pinch to zoom.';
        for (const button of buttons) button.hidden = false;
      });
      model.addEventListener('error', showFallback);
      model.src = panel.dataset.model;
      stage.append(model);
    } catch {
      showFallback();
    }

    function showFallback() {
      if (ticket !== generation) return;
      stageResize?.disconnect();
      viewer?.remove();
      viewer = null;
      poster.hidden = false;
      for (const button of buttons) button.hidden = true;
      status.textContent = '3D view unavailable. Showing the model preview.';
    }
  }

  function select(panel) {
    if (!panel || panel === current) return;
    generation++;
    stageResize?.disconnect();
    viewer?.remove();
    viewer = null;
    current = panel;
    for (const other of cases) other.hidden = other !== panel;
    for (const link of links) {
      if (link.hash === '#' + panel.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    const stage = panel.querySelector('.model-gallery__stage');
    stage.querySelector('img').hidden = false;
    stage.after(controls);
    controls.hidden = !panel.dataset.model;
    for (const button of buttons) button.hidden = true;
    status.textContent = '';
    if (nearViewport && panel.dataset.model) openModel();
  }

  function caseForHash(hash) {
    return cases.find(panel => '#' + panel.id === hash);
  }

  for (const link of links) {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      select(caseForHash(link.hash));
    });
  }
  window.addEventListener('hashchange', () => select(caseForHash(location.hash)));
  for (const button of buttons) {
    button.addEventListener('click', () => {
      if (!viewer) return;
      if (button.dataset.zoom) viewer.zoom(Number(button.dataset.zoom));
      else resetView();
    });
  }
  select(caseForHash(location.hash) || cases[0]);
  const start = () => {
    nearViewport = true;
    if (current.dataset.model) openModel();
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      start();
    }, {rootMargin: '250px'});
    observer.observe(gallery);
  } else {
    start();
  }
}
