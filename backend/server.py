from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import base64
from bson.objectid import ObjectId
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configure MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/fcRecog"
mongo = PyMongo(app)



@app.route('/get-students', methods=['GET'])
def get_students():
    estudiantes_collection = mongo.db.estudiantes
    students = list(estudiantes_collection.find({}))

    # Convert ObjectId() to string and remove the image data
    for student in students:
        student["_id"] = str(student["_id"])
        del student["image"]  # remove the image data

    return jsonify(students)


@app.route('/upload', methods=['POST'])
def upload_image():
    image_data = request.json['image']
    data = request.json
    image_data = data['image']
    nombre_del_alumno = data['nombre_del_alumno']
    matricula = data['matricula']
    fecha_de_registro = data['fecha_de_registro']
    clase = data['clase']
    asistencias = 0

    image_bytes = base64.b64decode(image_data.split(',')[1])

    student = {
        'nombre_del_alumno': nombre_del_alumno,
        'matricula': matricula,
        'fecha_de_registro': fecha_de_registro,
        'clase': clase,
        'image': image_bytes,
        'asistencias': 0
    }
    estudiantes_collection = mongo.db.estudiantes
    estudiantes_collection.insert_one(student)


    # Ensure the image_name is safe to use as a filename (avoid directory traversal attacks, invalid characters, etc.)
    image_name = secure_filename(nombre_del_alumno)

    image_collection = mongo.db.images
    image_id = image_collection.insert_one({'image': image_bytes}).inserted_id

    # Save the recently uploaded image to the folder
    image_path = os.path.join('faceRecon/images', f'{nombre_del_alumno}.jpeg')
    with open(image_path, 'wb') as f:
        f.write(image_bytes)
    
    return jsonify(message="Image uploaded successfully"), 200

@app.route('/save_all_images', methods=['POST'])
def save_all_images_to_db():
    image_folder_path = 'faceRecon/images'
    image_files = [f for f in os.listdir(image_folder_path) if os.path.isfile(os.path.join(image_folder_path, f))]

    image_collection = mongo.db.images  

    for image_file in image_files:
        with open(os.path.join(image_folder_path, image_file), 'rb') as f:
            image_bytes = f.read()

        image_base64 = base64.b64encode(image_bytes)

        image_collection.insert_one({'image': image_base64})

    return jsonify(message=f"{len(image_files)} images processed and saved to database"), 200

if __name__ == '__main__':
    app.run(debug=True) 