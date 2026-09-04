# Task-level construction prompt excerpts

This file preserves task-level prompt templates from the manuscript source used to document the construction workflow. The exact per-record instructions and reference answers for every supplied sample are available in `prompts/record_level_prompts.json`.

## Anatomical annotation

> You are a medical imaging expert. You will receive two images (Input, Ground Truth). Please: (1) infer modality and view; (2) infer the specific anatomical entity/region involved from the images; (3) generate a task instruction by inserting the inferred entity into an instruction template; (4) generate a concise answer describing the Ground Truth image; (5) summarize key visual differences.

Create an instruction that tasks the model with adding anatomical annotations to this medical image, highlighting key structures or pathological findings. Return JSON with `instruction`, `answer`, and `visual_differences` fields.

## Image restoration and appearance editing

### Artifact removal

> You are a medical imaging expert. You will receive two images (Input, Ground Truth). Please generate aligned instruction-answer text pairs based on paired input and ground truth images.

Create an instruction that tasks the model with removing imaging artifacts from this medical scan while preserving all anatomical structures. The instruction must be grounded in the Input image and the answer must accurately describe the Ground Truth image.

### Contrast enhancement

> You are a medical imaging expert. Generate instruction-answer pairs for medical image processing.

Create an instruction that tasks the model with enhancing contrast and visibility of anatomical structures. Preserve anatomical relationships and diagnostic features. Return JSON with instruction and answer content.

### Noise reconstruction

> You are a medical imaging expert. Analyze paired medical images and generate instruction-answer pairs.

Create an instruction that tasks the model with reducing noise and reconstructing image quality while maintaining anatomical accuracy, tissue boundaries, and structural detail. Return structured JSON with instruction, answer, and visual differences.

### Resolution editing

> You are a medical imaging expert. Generate aligned text pairs for medical image enhancement tasks.

Create an instruction that tasks the model with improving resolution and clarity while preserving anatomical relationships, proportional scaling, diagnostic features, and structural interfaces. Return JSON with a detailed instruction and concise answer.

### Style transfer

> You are a medical imaging expert. Generate instruction-answer pairs for medical image style transformation.

Create an instruction that tasks the model with applying a different imaging style or modality appearance while preserving anatomical accuracy and clinically relevant anatomical and pathological information. Return JSON with instruction content, answer content, and explanations.

## Counterfactual generation/editing

### Organic removal

> You are a medical imaging expert. Enrich the instruction based on annotation information and sample images.

Required metadata: organ, removal method, and modality. Template examples include: `Remove the {organ} and fill the region with noise in this {modality} image`; `Remove the {organ} and apply Gaussian blur to the region in this {modality} image`; and `Remove the {organ} and fill the region with black in this {modality} image`.

### Organic reconstruction

> You are a medical imaging expert. Create enriched instructions for organ reconstruction tasks.

Required metadata: organ, reconstruction method, and modality. Template examples include: `Reconstruct the {organ} using inpainting in this {modality} image` and `Reconstruct the {organ} using interpolation in this {modality} image`.

### Instruction editing

> You are a medical imaging expert. Generate enriched instructions for image editing tasks.

Required metadata: edit method, organ, and modality. Template examples include: `Brighten the {organ} region in this {modality} image`; `Enhance the contrast of the {organ} in this {modality} scan`; and `Sharpen the {organ} structure in this {modality} image`.

## Quality-validation prompt

> You are a medical imaging expert. Please evaluate the quality of this instruction-answer pair for medical AI training.

Evaluate medical accuracy, clarity, completeness, and consistency using the instruction, answer, modality, and task type. Return a structured JSON object with scores, specific suggestions, an overall assessment, an `is_valid` flag, and a list of issues.

## Scope note

The supplied examples are review-only benchmark records. They are not clinical recommendations, diagnostic reports, or deployment instructions. The counterfactual removal/reconstruction examples are synthetic benchmark tasks and must not be interpreted as clinical preprocessing or patient forecasting.
