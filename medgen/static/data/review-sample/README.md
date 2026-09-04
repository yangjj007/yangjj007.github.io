# MedGEN-Bench Review-Only Data Sample

This review-only dataset package contains 45 manually selected, unmodified benchmark records: 3 records for each of its 15 named tasks. It supports inspection of image pairs, task instructions, reference answers, construction-prompt evidence, and curation criteria. It is not a clinical dataset release and must not be redistributed.

## Contents

- `records.jsonl` — anonymized task records and image-file mappings.
- `images/` — native-resolution input/reference images for visual inspection.
- `prompts/` — exact record-level instructions plus documented construction/evaluation prompt material.
- `rubric/` — curation criteria and the review-attachment selection checklist.
- `MANIFEST.json` — coverage and SHA-256 integrity information.

The package intentionally contains no source-code or executable files.

## Coverage

The package covers all 15 named tasks and the six canonical reporting modalities (CT, MRI, ultrasound, X-ray, pathology, and clinical photography). The counterfactual removal/reconstruction records are synthetic benchmark tasks; they are not clinical forecasting, diagnostic, or preprocessing recommendations.

## Visual sample gallery

Open this file in a Markdown previewer. Each record retains its native image bytes in `images/`; the short answer below is a concise reviewer synopsis, while the canonical record answer is in `records.jsonl`.

### VQA

#### S01 — multiple-choice · Pathology

<img src="images/S01_input_01.png" alt="S01 input" width="220"> —

**Task.** Question: What is the type of staining used in this image? Options: A. H&E B. PAS C. Trichrome D. Immunohistochemical

**Expected output.** H&E stain.

*Selection note:* Histopathology multiple-choice item: identify H&E staining.

#### S02 — blank-filling · Clinical Photography

<img src="images/S02_input_01.jpg" alt="S02 input" width="220"> —

**Task.** The skin condition shown is ____.

**Expected output.** Spider angioma.

*Selection note:* Dermatology blank-filling item with a localized skin finding.

#### S03 — question-answering · X-ray

<img src="images/S03_input_01.png" alt="S03 input" width="220"> —

**Task.** What organ is inside the red box in this image?

**Expected output.** The heart.

*Selection note:* Region-grounded radiograph question using a visible red box.

#### S04 — report-generation · CT

<img src="images/S04_input_01.jpg" alt="S04 input" width="220"> —

**Task.** Generate a clinical report for this CT scan.

**Expected output.** Pancreatic head-neck mass with ductal dilatation and vascular involvement.

*Selection note:* CT report-generation example with a focal pancreatic finding.

### ImageEditing

#### S05 — anatomical-annotation · Ultrasound

<img src="images/S05_input_01.jpg" alt="S05 input" width="220"> <img src="images/S05_reference_01.jpg" alt="S05 reference" width="220">

**Task.** Annotate this Ultrasound image of Mitral Valve with detailed labels for the Mitral Regurgitation (Mr), including anatomical landmarks and diagnostic findings

**Expected output.** Annotated mitral-valve ultrasound with diagnostic labels.

*Selection note:* Ultrasound annotation pair for mitral regurgitation.

#### S06 — artifact-removal · X-ray

<img src="images/S06_input_01.jpg" alt="S06 input" width="220"> <img src="images/S06_reference_01.jpg" alt="S06 reference" width="220">

**Task.** Correct imaging artifacts in this X-Ray image

**Expected output.** PA chest radiograph with grid-line artifacts removed.

*Selection note:* Chest radiograph with visible grid-line artifacts and an artifact-reduced reference.

#### S07 — contrast-enhancement · Clinical Photography

<img src="images/S07_input_01.jpg" alt="S07 input" width="220"> <img src="images/S07_reference_01.jpg" alt="S07 reference" width="220">

**Task.** Enhance the contrast of this Clinical Photo image using advanced image processing algorithms for improved diagnostic visibility

**Expected output.** Skin lesion with improved contrast and brightness.

*Selection note:* Dermatology contrast-enhancement pair; the image is non-identifying.

#### S08 — noise-reconstruction · CT

<img src="images/S08_input_01.jpg" alt="S08 input" width="220"> <img src="images/S08_reference_01.jpg" alt="S08 reference" width="220">

**Task.** Apply sophisticated noise reduction to this CT scan while preserving fine anatomical details and diagnostic features

**Expected output.** Denoised chest CT with preserved pulmonary and mediastinal detail.

*Selection note:* Salt-and-pepper-noise reduction on chest CT while preserving anatomy.

#### S09 — resolution-editing · MRI

<img src="images/S09_input_01.jpg" alt="S09 input" width="220"> <img src="images/S09_reference_01.jpg" alt="S09 reference" width="220">

**Task.** Enhance the resolution of this Magnetic Resonance Imaging image using super-resolution algorithms for improved anatomical detail

**Expected output.** Higher-resolution MRI with preserved anatomical detail.

*Selection note:* Low-to-high-resolution sagittal MRI pair.

#### S10 — style-transfer · Pathology

<img src="images/S10_input_01.png" alt="S10 input" width="220"> <img src="images/S10_reference_01.jpg" alt="S10 reference" width="220">

**Task.** Apply advanced style transfer to this Pathology image while preserving anatomical accuracy and diagnostic quality

**Expected output.** Thermal-colormap pathology image preserving tissue morphology.

*Selection note:* Pathology style-transfer pair using a thermal color mapping.

### MultimodalGeneration

#### S11 — 2d-to-3d-reconstruction · CT

<img src="images/S11_input_01.jpg" alt="S11 input" width="220"> <img src="images/S11_reference_01.png" alt="S11 reference" width="220">

**Task.** Generate 3D reconstruction from this low attenuation CT slice

**Expected output.** Color-coded 3D reconstruction of the neck and upper thorax.

*Selection note:* Multi-slice CT grid to a color-coded 3D reconstruction.

#### S12 — 3d-to-2d-projection · CT

<img src="images/S12_input_01.png" alt="S12 input" width="220"> <img src="images/S12_reference_01.png" alt="S12 reference" width="220">

**Task.** Create axial_cross_section at 100% position in this 3D CT scan

**Expected output.** Axial chest CT slice with a highlighted right-lung nodule.

*Selection note:* 3D CT representation to an axial chest slice with a localized nodule.

#### S14 — instruction-editing · Ultrasound

<img src="images/S14_input_01.jpg" alt="S14 input" width="220"> <img src="images/S14_reference_01.jpg" alt="S14 reference" width="220">

**Task.** Apply enhancement processing to the jugular_vein using AI enhancement in this hypoechoic Ultrasound longitudinal image

**Expected output.** Longitudinal thyroid ultrasound with the internal jugular vein segmented in blue.

*Selection note:* Ultrasound instruction-edit pair with an internal-jugular-vein segmentation overlay.

#### S15 — organic-reconstruction · Ultrasound

<img src="images/S15_input_01.jpg" alt="S15 input" width="220"> <img src="images/S15_reference_01.jpg" alt="S15 reference" width="220">

**Task.** Reconstruct the extensive liver in this speckled Ultrasound image

**Expected output.** Liver ultrasound reconstructed from a masked region.

*Selection note:* Masked liver ultrasound reconstructed through an inpainting-style counterfactual edit.

#### S16 — organic-removal · Other / unspecified

<img src="images/S16_input_01.jpg" alt="S16 input" width="220"> <img src="images/S16_reference_01.jpg" alt="S16 reference" width="220">

**Task.** Remove the artery from this medical image using inpainting technique

**Expected output.** Artery-targeted inpainting counterfactual with surrounding anatomy retained.

*Selection note:* Fine-grained artery inpainting counterfactual. This is a synthetic editing stress test, not a clinical preprocessing recommendation.

### VQA

#### S17 — multiple-choice · Pathology

<img src="images/S17_input_01.png" alt="S17 input" width="220"> —

**Task.** Question: Which organ is this image most likely from? Options: A. Thymus B. Thyroid C. Lymph Node D. Salivary Gland

**Expected output.** Thyroid.

*Selection note:* Histopathology multiple-choice item identifying a thyroid tissue structure.

#### S18 — multiple-choice · Pathology

<img src="images/S18_input_01.png" alt="S18 input" width="220"> —

**Task.** Question: What lesion is most clearly visible in this image? Options: A. Atrophic Rete Ridges B. Hyperkeratosis C. Flat Rete Ridges D. Elongated Rete Ridges E.…

**Expected output.** Acanthosis.

*Selection note:* Pathology multiple-choice item with a visible dermatopathology finding.

#### S19 — blank-filling · Clinical Photography

<img src="images/S19_input_01.jpg" alt="S19 input" width="220"> —

**Task.** The pathology shown in this image is ____.

**Expected output.** Erythema migrans.

*Selection note:* Non-identifying dermatology photograph with a concise pathology answer.

#### S20 — blank-filling · Clinical Photography

<img src="images/S20_input_01.jpg" alt="S20 input" width="220"> —

**Task.** The pathology is more consistent with ____.

**Expected output.** Acne rosacea.

*Selection note:* Non-identifying facial-skin crop used for a dermatology blank-filling item.

#### S21 — question-answering · X-ray

<img src="images/S21_input_01.jpg" alt="S21 input" width="220"> —

**Task.** What imaging modality is used in this image?

**Expected output.** X-ray.

*Selection note:* Chest radiograph question asking for the imaging modality.

#### S22 — question-answering · X-ray

<img src="images/S22_input_01.jpg" alt="S22 input" width="220"> <img src="images/S22_input_02.jpg" alt="S22 input" width="220"> —

**Task.** Based on the radiographic findings in the first and second images, which diagnosis is most consistent with the asymmetric involvement of the distal interphalan…

**Expected output.** Asymmetric distal interphalangeal joint involvement.

*Selection note:* Multi-view hand radiograph question grounded in distal interphalangeal joints.

#### S23 — report-generation · CT

<img src="images/S23_input_01.jpg" alt="S23 input" width="220"> —

**Task.** Generate a clinical report for this CT scan.

**Expected output.** Chest CT report describing small nodules and mediastinal structures.

*Selection note:* Chest CT report-generation example describing pulmonary nodules.

#### S24 — report-generation · CT

<img src="images/S24_input_01.jpg" alt="S24 input" width="220"> <img src="images/S24_input_02.jpg" alt="S24 input" width="220"> <img src="images/S24_input_03.jpg" alt="S24 input" width="220"> —

**Task.** Generate a structured radiology report for the following case: Based on the visual findings across the first, second, and third images, which of the following …

**Expected output.** Structured report for head trauma and neurological symptoms.

*Selection note:* Structured radiology-report example using a multi-image skull case.

### ImageEditing

#### S25 — anatomical-annotation · Ultrasound

<img src="images/S25_input_01.jpg" alt="S25 input" width="220"> <img src="images/S25_reference_01.jpg" alt="S25 reference" width="220">

**Task.** Annotate this Ultrasound image of Liver with detailed labels for the Nodule diagnosed as CHC (Cholangiocarcinoma), including anatomical landmarks and diagnosti…

**Expected output.** Annotated liver ultrasound with a nodule label.

*Selection note:* Ultrasound annotation pair for a liver nodule.

#### S26 — anatomical-annotation · Ultrasound

<img src="images/S26_input_01.jpg" alt="S26 input" width="220"> <img src="images/S26_reference_01.jpg" alt="S26 reference" width="220">

**Task.** Overlay clinical annotations on this Ultrasound scan

**Expected output.** Annotated ultrasound image with a lesion-focused label.

*Selection note:* Ultrasound annotation pair for a complex adnexal lesion.

#### S27 — artifact-removal · X-ray

<img src="images/S27_input_01.jpg" alt="S27 input" width="220"> <img src="images/S27_reference_01.jpg" alt="S27 reference" width="220">

**Task.** Clean up this X-Ray scan

**Expected output.** Post-artifact-removal PA chest radiograph.

*Selection note:* Validated chest-radiograph artifact-removal example with truncation lines removed.

#### S28 — artifact-removal · X-ray

<img src="images/S28_input_01.jpg" alt="S28 input" width="220"> <img src="images/S28_reference_01.jpg" alt="S28 reference" width="220">

**Task.** Eliminate distortions from this X-Ray scan

**Expected output.** Chest X-ray with the left breast shadow digitally reduced.

*Selection note:* Validated X-ray artifact-removal example showing improved lung-field visibility.

#### S29 — contrast-enhancement · X-ray

<img src="images/S29_input_01.jpg" alt="S29 input" width="220"> <img src="images/S29_reference_01.jpg" alt="S29 reference" width="220">

**Task.** Improve the visual quality of this Radiograph scan through advanced contrast enhancement while preserving diagnostic information

**Expected output.** Contrast-enhanced X-ray with improved anatomical visibility.

*Selection note:* X-ray contrast-enhancement pair with preserved anatomical structures.

#### S30 — contrast-enhancement · Clinical Photography

<img src="images/S30_input_01.jpg" alt="S30 input" width="220"> <img src="images/S30_reference_01.jpg" alt="S30 reference" width="220">

**Task.** Enhance the contrast of this Clinical Photo image using advanced image processing algorithms for improved diagnostic visibility

**Expected output.** Skin lesion with darker, more diagnostic contrast.

*Selection note:* Non-identifying dermatology contrast-enhancement pair.

#### S31 — noise-reconstruction · CT

<img src="images/S31_input_01.jpg" alt="S31 input" width="220"> <img src="images/S31_reference_01.jpg" alt="S31 reference" width="220">

**Task.** Apply sophisticated noise reduction to this CT scan while preserving fine anatomical details and diagnostic features

**Expected output.** Denoised CT sagittal view with preserved vertebral anatomy.

*Selection note:* Salt-and-pepper-noise reduction on a CT sagittal view.

#### S32 — noise-reconstruction · CT

<img src="images/S32_input_01.jpg" alt="S32 input" width="220"> <img src="images/S32_reference_01.jpg" alt="S32 reference" width="220">

**Task.** Clean up this noisy CT image

**Expected output.** Cleaner chest CT with preserved cardiopulmonary structures.

*Selection note:* Chest CT cleanup example with visible noise reduction.

#### S33 — resolution-editing · MRI

<img src="images/S33_input_01.jpg" alt="S33 input" width="220"> <img src="images/S33_reference_01.jpg" alt="S33 reference" width="220">

**Task.** Improve the spatial resolution of this Magnetic_Resonance_Imaging image using deep learning-based super-resolution methods

**Expected output.** Higher-resolution multi-view MRI.

*Selection note:* Multi-view brain MRI resolution-enhancement pair.

#### S34 — resolution-editing · MRI

<img src="images/S34_input_01.jpg" alt="S34 input" width="220"> <img src="images/S34_reference_01.jpg" alt="S34 reference" width="220">

**Task.** Enhance the resolution of this low-quality Magnetic Resonance Imaging image

**Expected output.** MRI with enhanced spatial detail.

*Selection note:* Focused MRI resolution-enhancement pair with a visible anatomical target.

#### S35 — style-transfer · Pathology

<img src="images/S35_input_01.png" alt="S35 input" width="220"> <img src="images/S35_reference_01.png" alt="S35 reference" width="220">

**Task.** Transform this Pathology using thermal colormap visualization to enhance tissue contrast and signal intensity distribution. Technical Implementation: Apply the…

**Expected output.** Thermal-colormap pathology visualization.

*Selection note:* Pathology thermal-colormap style-transfer pair with strong visual contrast.

#### S36 — style-transfer · Pathology

<img src="images/S36_input_01.png" alt="S36 input" width="220"> <img src="images/S36_reference_01.png" alt="S36 reference" width="220">

**Task.** Transform this Pathology using thermal colormap to enhance tissue contrast. Technical: Apply thermal mapping (blue-cold to red-hot) with histogram equalization…

**Expected output.** Thermal-mapped pathology image.

*Selection note:* Pathology thermal-mapping pair with preserved tissue layout.

### MultimodalGeneration

#### S37 — 2d-to-3d-reconstruction · CT

<img src="images/S37_input_01.jpg" alt="S37 input" width="220"> <img src="images/S37_reference_01.png" alt="S37 reference" width="220">

**Task.** Reconstruct 3D volume from this 2D CT image

**Expected output.** Color-coded 3D brain-parenchyma reconstruction.

*Selection note:* CT slices converted into a color-coded 3D segmentation view.

#### S38 — 2d-to-3d-reconstruction · CT

<img src="images/S38_input_01.jpg" alt="S38 input" width="220"> <img src="images/S38_reference_01.png" alt="S38 reference" width="220">

**Task.** Create volumetric model from this 2D CT scan

**Expected output.** Color-coded 3D thoracic reconstruction.

*Selection note:* Multi-slice CT grid converted into a color-coded 3D thoracic model.

#### S39 — 3d-to-2d-projection · CT

<img src="images/S39_input_01.png" alt="S39 input" width="220"> <img src="images/S39_reference_01.png" alt="S39 reference" width="220">

**Task.** Create axial_cross_section at 75% position in this 3D CT scan

**Expected output.** Axial upper-abdominal CT projection.

*Selection note:* Grayscale axial projection from a 3D CT representation.

#### S40 — 3d-to-2d-projection · CT

<img src="images/S40_input_01.png" alt="S40 input" width="220"> <img src="images/S40_reference_01.png" alt="S40 reference" width="220">

**Task.** Create axial_cross_section at 50% position in this 3D CT scan

**Expected output.** Axial CT slice with a segmented bladder.

*Selection note:* Color-coded 3D CT representation projected to a labeled axial slice.

#### S43 — instruction-editing · Ultrasound

<img src="images/S43_input_01.jpg" alt="S43 input" width="220"> <img src="images/S43_reference_01.jpg" alt="S43 reference" width="220">

**Task.** Process the carotid artery lumen with AI enhancement in this heterogeneous Ultrasound longitudinal view

**Expected output.** Longitudinal carotid ultrasound with the lumen labeled.

*Selection note:* Carotid-lumen instruction-edit pair with a visible label overlay.

#### S44 — instruction-editing · Ultrasound

<img src="images/S44_input_01.jpg" alt="S44 input" width="220"> <img src="images/S44_reference_01.jpg" alt="S44 reference" width="220">

**Task.** Apply AI-based enhancement enhancement to the carotid_artery in this heterogeneous Ultrasound longitudinal image

**Expected output.** Longitudinal neck ultrasound with the carotid artery segmented.

*Selection note:* Common-carotid instruction-edit pair with a blue segmentation overlay.

#### S45 — organic-reconstruction · Ultrasound

<img src="images/S45_input_01.jpg" alt="S45 input" width="220"> <img src="images/S45_reference_01.jpg" alt="S45 reference" width="220">

**Task.** Reconstruct the large-scale fetal head in this homogeneous Ultrasound image

**Expected output.** Fetal-head ultrasound reconstructed from a masked region.

*Selection note:* Fetal-head ultrasound reconstructed from an obscured region.

#### S46 — organic-reconstruction · Ultrasound

<img src="images/S46_input_01.jpg" alt="S46 input" width="220"> <img src="images/S46_reference_01.jpg" alt="S46 reference" width="220">

**Task.** Reconstruct the extensive head_circumference in this anechoic Ultrasound image

**Expected output.** Reconstructed fetal-head ultrasound with clear cranial structures.

*Selection note:* Fetal-head ultrasound reconstruction with the cranial boundary restored.

#### S47 — organic-removal · Other / unspecified

<img src="images/S47_input_01.jpg" alt="S47 input" width="220"> <img src="images/S47_reference_01.jpg" alt="S47 reference" width="220">

**Task.** Remove the artery from this medical image using inpainting technique

**Expected output.** Artery-targeted inpainting counterfactual.

*Selection note:* Artery-targeted inpainting counterfactual retained for task-level inspection.

#### S48 — organic-removal · Other / unspecified

<img src="images/S48_input_01.jpg" alt="S48 input" width="220"> <img src="images/S48_reference_01.jpg" alt="S48 reference" width="220">

**Task.** Remove the artery from this medical image using inpainting technique

**Expected output.** Artery-removal inpainting counterfactual.

*Selection note:* Artery-removal inpainting counterfactual with native-resolution ultrasound context.

## Review-only conditions

The package contains no author names, e-mail addresses, API credentials, account identifiers, absolute workstation paths, or source-code files. Source-dataset labels and non-identifying record metadata are retained only to enable audit of task provenance. Any downstream reuse remains subject to the original source-data terms and approvals.

For reviewer use, upload this ZIP with the file designation **Dataset**. TMI permits datasets as Supporting Documents, while it does not permit a supplementary manuscript-like document that extends the main paper with prose or figures. The 40 MB TMI limit applies to the manuscript PDF; this package is deliberately kept below 39 MiB as a conservative portal-safe target.
