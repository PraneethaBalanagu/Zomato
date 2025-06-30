# classify_food.py
import sys
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
from PIL import Image
import torch

path = sys.argv[1]
image = Image.open(path).convert("RGB")

model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

pixel_values = feature_extractor(images=image, return_tensors="pt").pixel_values
output_ids = model.generate(pixel_values, max_length=16, num_beams=4)
caption = tokenizer.decode(output_ids[0], skip_special_tokens=True)

food = caption.split(',')[0].split()[0]
print(food)
