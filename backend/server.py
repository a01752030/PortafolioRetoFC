from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_pymongo import PyMongo
import base64
import os
from werkzeug.utils import secure_filename
from faceRecon.mainVideo import process_video
from faceRecon.detection import process_video_and_detect_faces
from graphs import generate_heatmap,generate_bubble_chart,generate_pie_chart,generate_class_specific_bar_chart,generate_class_participation_box_plot, generate_student_ranking_bar_graph, generate_student_attendance_bar_chart


app = Flask(__name__)
CORS(app, origins='*')


# Configure MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/fcRecog"
mongo = PyMongo(app)


@app.route('/generate_heatmap', methods=['GET'])
def generate_heatmap_route():
    try:
        _, image_stream = generate_heatmap()
        print(image_stream)
        image_stream.seek(0)

        # Convert the image stream to base64 encoding
        image_data = base64.b64encode(image_stream.read()).decode('utf-8')

        return image_data
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_bubble_chart', methods=['GET'])
def generate_bubble_chart_route():
    try:
        _, image_stream = generate_bubble_chart()
        image_stream.seek(0)

        # Convert the image stream to base64 encoding
        image_data = base64.b64encode(image_stream.read()).decode('utf-8')

        return image_data
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/generate_pie_chart', methods=['GET'])
def generate_pie_chart_route():
    try:
        _, image_stream = generate_pie_chart()
        image_stream.seek(0)

        # Convert the image stream to base64 encoding
        image_data = base64.b64encode(image_stream.read()).decode('utf-8')

        return image_data
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_class_specific_bar_chart', methods=['POST'])
def generate_class_specific_bar_chart_route():
    try:
        class_name = request.json.get('className')
        _, image_stream = generate_class_specific_bar_chart(class_name)
        image_stream.seek(0)

        # Convert the image stream to base64 encoding
        image_data = base64.b64encode(image_stream.read()).decode('utf-8')

        return image_data
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/generate_class_participation_box_plot', methods=['POST'])
def generate_class_participation_box_plot_route():
    try:
        class_name = request.json.get('className')
        _, image_stream = generate_class_participation_box_plot(class_name)
        image_stream.seek(0)

        # Convert the image stream to base64 encoding
        image_data = base64.b64encode(image_stream.read()).decode('utf-8')

        return image_data
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_student_attendance_bar_chart', methods=['POST'])
def generate_student_attendance_bar_chart_route():
    try:
        class_name = request.json.get('className')
        _, image_stream = generate_student_attendance_bar_chart(class_name)
        image_stream.seek(0)

        # Convert the image stream to base64 encoding
        image_data = base64.b64encode(image_stream.read()).decode('utf-8')

        return image_data
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_student_ranking_bar_graph', methods=['POST'])
def generate_student_ranking_bar_graph_route():
    try:
        class_name = request.json.get('className')
        _, image_stream = generate_student_ranking_bar_graph(class_name)
        image_stream.seek(0)

        # Convert the image stream to base64 encoding
        image_data = base64.b64encode(image_stream.read()).decode('utf-8')

        return image_data
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
@app.route('/delete_graph_image', methods=['DELETE'])
def delete_graph_image_route():
    image_path = 'graph_image.png'
    try:
        os.remove(image_path)
        return jsonify({'message': 'Image deleted successfully'})
    except Exception as e:
        return jsonify({'error': f'Error deleting image: {e}'}), 500


@app.route('/get-students', methods=['GET'])
def get_students_route():
    estudiantes_collection = mongo.db.estudiantes
    students = list(estudiantes_collection.find({}))

    # Convert ObjectId() to string and remove the image data
    for student in students:
        student["_id"] = str(student["_id"])
        del student["image"]  # remove the image data

    return jsonify(students)

@app.route('/upload-assistance', methods=['POST', 'OPTIONS'])
def upload_video_route():
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
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response

@app.route('/upload-parti', methods=['POST', 'OPTIONS'])
def upload_parti_route():
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
        print("Video ok")        
        try:
            result = process_video_and_detect_faces()

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
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response


@app.route('/run-main-video', methods=['GET'])
def run_main_video_route():
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

@app.route('/run_parti_video', methods=['GET'])
def run_parti_video_route():
    try:
        result = process_video_and_detect_faces()

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
def login_route():
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
def upload_image_route():
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
def save_all_images_to_db_route():
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