import os
import face_recognition
import cv2
from pymongo import MongoClient

def process_video():
    client = MongoClient('localhost', 27017)
    db = client['fcRecog']
    students_collection = db['estudiantes']
    recognized_once = set()

    # Directory containing known face images
    known_faces_dir = "./faceRecon/faces"

    # Initialize lists to store known face encodings and labels
    known_face_encodings = []
    known_face_labels = []

    # Load known face images and create face encodings
    for filename in os.listdir(known_faces_dir):
        if filename.endswith(".jpg") or filename.endswith(".jpeg"):
            # Load the image file
            face_image = face_recognition.load_image_file(os.path.join(known_faces_dir, filename))
            # Extract face encodings from the image
            face_encoding = face_recognition.face_encodings(face_image)[0]
            # Extract the label (person's name) from the filename
            label = os.path.splitext(filename)[0]
            # Add the face encoding and label to the lists
            known_face_encodings.append(face_encoding)
            known_face_labels.append(label)

    # Function to recognize faces in the frame
    def recognize_faces(frame):
        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"  # Default label
            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_labels[first_match_index]
            if name not in recognized_once:
                recognized_once.add(name)
                students_collection.update_one({"nombre_del_alumno": name}, {"$inc": {"asistencias": 1}})
        return frame

    # Initialize the video capture object
    video_path = './faceRecon/RecentClass/MostRecentClass.mp4'
    cap = cv2.VideoCapture(video_path)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        recognize_faces(frame)

    cap.release()

    try:
        os.remove(video_path)
        print(f"Video '{video_path}' has been deleted successfully.")
        return "success"
    except Exception as e:
        print(f"Error deleting video '{video_path}': {e}")
        return str(e)

if __name__ == "__main__":
    process_video()