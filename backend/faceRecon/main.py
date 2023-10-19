from ultralytics import YOLO
import cv2
import os
import cv2
import face_recognition
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['fcRecog']  
students_collection = db['estudiantes']
recognized_once = set()


# Directory containing known face images
known_faces_dir = "./faces"

# Initialize lists to store known face encodings and labels
known_face_encodings = []
known_face_labels = []

# Load known face images and create face encodings
for filename in os.listdir(known_faces_dir):
    if filename.endswith(".jpg") or filename.endswith(".jpeg"):
        # Load the image file
        face_image = face_recognition.load_image_file(os.path.join(known_faces_dir, filename))

        # Extract face encodings from the image
        face_encoding = face_recognition.face_encodings(face_image)[0]  # Assuming there's only one face in each image

        # Extract the label (person's name) from the filename (excluding the extension)
        label = os.path.splitext(filename)[0]

        # Add the face encoding and label to the lists
        known_face_encodings.append(face_encoding)
        known_face_labels.append(label)

# Function to recognize faces in the frame
def recognize_faces(frame):
    # Find all face locations and face encodings in the current frame
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    # Iterate through each detected face and check if it matches a known face
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        # Check if the detected face matches any known face
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"  # Default label if no match is found

        # If a match is found, use the name corresponding to the known face
        if True in matches:
            first_match_index = matches.index(True)
            name = known_face_labels[first_match_index]

        # Draw rectangle around the face and display the name
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 0.5, (255, 255, 255), 1)
        if name not in recognized_once:
            recognized_once.add(name)
            students_collection.update_one({"nombre_del_alumno": name}, {"$inc": {"asistencias": 1}})

    return frame

# Rest of the code remains the same...
# Initialize the video capture object
cap = cv2.VideoCapture(0)  # 0 corresponds to the default camera (you can change it to a different camera index if necessary)

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    # Perform face recognition on the frame
    frame_with_faces = recognize_faces(frame)

    # Display the resulting frame
    cv2.imshow('Face Recognition', frame_with_faces)

    # Break the loop if 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object and close all windows
cap.release()
cv2.destroyAllWindows()