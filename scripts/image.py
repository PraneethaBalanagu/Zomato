from transformers import AutoImageProcessor, ConvNextForImageClassification
from PIL import Image
import torch
import requests

# Load image (local or from URL)
image = Image.open("soft-idli-recipe.jpg").convert("RGB")

# Load processor and model
processor = AutoImageProcessor.from_pretrained("donalddc/convnextv2-base-food101")
model = ConvNextForImageClassification.from_pretrained("donalddc/convnextv2-base-food101")

# Preprocess image
inputs = processor(images=image, return_tensors="pt")
with torch.no_grad():
    logits = model(**inputs).logits

# Get predicted label
predicted_class_idx = logits.argmax(-1).item()
label = model.config.id2label[predicted_class_idx]
print("🍽️ Predicted Dish:", label)

# Map dish to cuisine
dish_to_cuisine = {
    "butter chicken": "North Indian",
    "pad thai": "Thai",
    "sushi": "Japanese",
    "tandoori chicken": "North Indian",
    "chicken tikka masala": "North Indian",
    "miso soup": "Japanese",
    "biryani": "Mughlai",
    "pho": "Vietnamese",
    "lasagna": "Italian",
    # Add more mappings as needed
}

cuisine = dish_to_cuisine.get(label.lower(), "Unknown")
print("🌏 Predicted Cuisine:", cuisine)
