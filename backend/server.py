from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_pymongo import PyMongo
import base64
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from faceRecon.mainVideo import process_video
from faceRecon.process_participations import delayed_success


load_dotenv()
app = Flask(__name__)
CORS(app, origins='*')

# Configure MongoDB
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
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

@app.route('/upload-video', methods=['POST', 'OPTIONS'])
def upload_video():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight request successful'})
    else:
        video_file = request.files['video']

        # Ensure the video file is provided
        if not video_file:
            return jsonify(message="No video file provided"), 400

        # Generate a secure filename based on the current timestamp (to ensure uniqueness)
        video_name = secure_filename("MostRecentClass.mp4")
        video_path = os.path.join('faceRecon/RecentClass', video_name)  # Adjust the directory path as needed

        video_file.save(video_path)

        response = jsonify(message="Video uploaded successfully")
        print("Video cool")
        response.status_code = 200

    # Set CORS headers
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response

@app.route('/upload-parti', methods=['POST', 'OPTIONS'])
def upload_parti():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight request successful'})
    else:
        video_file = request.files['video']

        # Ensure the video file is provided
        if not video_file:
            return jsonify(message="No video file provided"), 400

        # Generate a secure filename based on the current timestamp (to ensure uniqueness)
        video_name = secure_filename("MostRecentParti.mp4")
        video_path = os.path.join('faceRecon/RecentParti', video_name)  # Adjust the directory path as needed

        video_file.save(video_path)

        response = jsonify(message="Video uploaded successfully")
        response.status_code = 200

    # Set CORS headers
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response


@app.route('/run-main-video', methods=['GET'])
def run_main_video():
    try:
        result = process_video()

        # If the script runs successfully
        if result == "success":
            response = make_response(jsonify({'message': 'Script executed successfully'}))
            response.status_code = 200
        else:
            response = make_response(jsonify({'message': f'Error: {result}'}))
            response.status_code = 500
    except Exception as e:
        response = make_response(jsonify({'message': f'An error occurred: {e}'}))
        response.status_code = 500

    # Set CORS headers
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response

@app.route('/run-partici-video', methods=['GET'])
def run_partici_video():
    try:
        result = delayed_success()

        # If the script runs successfully
        if result == "success":
            response = make_response(jsonify({'message': 'Script executed successfully'}))
            response.status_code = 200
        else:
            response = make_response(jsonify({'message': f'Error: {result}'}))
            response.status_code = 500
    except Exception as e:
        response = make_response(jsonify({'message': f'An error occurred: {e}'}))
        response.status_code = 500

    # Set CORS headers
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response



@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

        # Check email and password and return the corresponding component
    if email == 'langheran@gmail.com' and password == 'Nds1!' or email == 'sickpuppyjp500@gmail.com' and password == 'ElPaco!':
        response = jsonify({'component': 'FirstComponent'})
    elif email == 'nhurst@ndscognitivelabs.com' and password == 'Nds2!' or email == 'deathpuppyjp500@gmail.com' and password == 'ElAlfredo!':
        response = jsonify({'component': 'SecondComponent'})
    elif email == 'kzazueta@ndscognitivelabs.com' and password == 'Nds3!' or email == 'healthypuppy500@gmail.com' and password == 'ElTupac!':
        response = jsonify({'component': 'ThirdComponent'})
    else:
        response = jsonify({'component': 'InvalidLogin'})


    return response

@app.route('/upload', methods=['POST', 'OPTIONS'])
def upload_image():
    if request.method == 'OPTIONS':
        response = {'message': 'CORS preflight request successful'}
    else:
        data = request.get_json()
        image_data = data['image']
        nombre_del_alumno = data['nombre_del_alumno']
        matricula = data['matricula']
        fecha_de_registro = data['fecha_de_registro']
        clase = data['clase']

        image_bytes = base64.b64decode(image_data.split(',')[1])

        student = {
            'nombre_del_alumno': nombre_del_alumno,
            'matricula': matricula,
            'fecha_de_registro': fecha_de_registro,
            'clase': clase,
            'image': image_bytes,
            'asistencias': 0,
            'participaciones': 0
        }
        estudiantes_collection = mongo.db.estudiantes
        estudiantes_collection.insert_one(student)

        image_name = secure_filename(nombre_del_alumno)

        image_collection = mongo.db.images
        image_id = image_collection.insert_one({'image': image_bytes}).inserted_id

        image_path = os.path.join('faceRecon/faces', f'{nombre_del_alumno}.jpeg')
        with open(image_path, 'wb') as f:
            f.write(image_bytes)

        response = {'message': "Image uploaded successfully"}

    # Set CORS headers
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type'

    return jsonify(response), 200


@app.route('/save_all_images', methods=['POST', 'OPTIONS'])
def save_all_images_to_db():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight request successful'})
    else:
        image_folder_path = 'faceRecon/faces'
        image_files = [f for f in os.listdir(image_folder_path) if os.path.isfile(os.path.join(image_folder_path, f))]

        image_collection = mongo.db.images  

        for image_file in image_files:
            with open(os.path.join(image_folder_path, image_file), 'rb') as f:
                image_bytes = f.read()

            image_base64 = base64.b64encode(image_bytes)

            image_collection.insert_one({'image': image_base64})

        response = jsonify(message=f"{len(image_files)} images processed and saved to database"), 200

    # Set CORS headers
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response

if __name__ == '__main__':
    app.run(debug=True)