import os
from bson.objectid import ObjectId

def save_images_to_folder(mongo):
    # Set the folder to save images
    output_folder = 'faceRecon/faces'
    
    # Ensure the folder to save images exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Fetch all image documents from the collection
    image_collection = mongo.db.images
    all_images = image_collection.find()
    
    # Save each image
    for idx, image_data in enumerate(all_images):
        if 'image' in image_data:
            image_path = os.path.join(output_folder, f'image_{ObjectId(image_data["_id"])}.jpeg')
            with open(image_path, 'wb') as f:
                f.write(image_data['image'])