# Dataset curation and review rubric

## Three reported curation dimensions

The manuscript describes three curation dimensions. A record is appropriate for retention only when all three dimensions are satisfactory.

| Dimension | Review question | Pass condition |
|---|---|---|
| Question validity | Is the instruction clinically meaningful, clear, and grounded in features visible in the input image? | The requested task is unambiguous and does not require information absent from the supplied input. |
| Answer accuracy | Does the answer agree with the reference image and the available record metadata? | The answer uses appropriate medical terminology and describes the reference output without unsupported claims. |
| Multimodal relevance | Is the image necessary to resolve the instruction? | The task cannot be answered adequately from wording alone; image content determines the answer or transformation. |

## Review-attachment selection checklist

This checklist was applied to select the review-package examples. It documents package selection and does not substitute for a retrospective human-expert calibration study.

1. Input image(s) and reference image(s), when applicable, open correctly and are visually legible at native resolution.
2. The task, modality, instruction, answer, and available metadata are mutually consistent enough for reviewer inspection.
3. The selected records cover all 15 named tasks and the six canonical reporting modalities: CT, MRI, ultrasound, X-ray, pathology, and clinical photography.
4. Clinical-photograph examples are non-identifying cropped skin images; no names, faces, or account identifiers are supplied in this package.
5. Counterfactual generation/editing examples are explicitly labeled as synthetic and non-diagnostic.
6. No source-data path, author identifier, API credential, or repository-account identifier is retained in the distributed JSON records.
