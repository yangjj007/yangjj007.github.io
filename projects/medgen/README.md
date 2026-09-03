# MedGEN-Bench — visual academic project page

An independent GitHub Pages presentation of **MedGEN-Bench: Contextually entangled benchmark for open-ended multimodal medical generation**.

- Project page: <https://yangjj007.github.io/projects/medgen/>
- Paper: <https://arxiv.org/abs/2511.13135>
- Dataset: <https://huggingface.co/datasets/Jack04810/MedGEN-Bench>

The layout follows the image-forward rhythm of the DMD academic project page while preserving MedGEN-Bench's verified paper and release statistics.

## License

Website code is available under CC BY-SA 4.0. Dataset reuse is governed separately by the terms published with the source dataset.

## Curated sample gallery

The project page includes the extracted review-only sample at `static/data/review-sample/`. It contains 45 manually selected records covering all 15 named tasks, seven sample modalities, and the VQA, image-editing, and multimodal-generation formats. The gallery reads `records.jsonl` and supports search plus modality, task, and format filters.

To preview the page locally, serve this directory over HTTP so the JSONL asset can be fetched:

```bash
python -m http.server 8000
```

The review-only package is provided for inspection and is not a clinical dataset release. Reuse remains subject to the package scope and original source-data terms.
