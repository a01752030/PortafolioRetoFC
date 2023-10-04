import cv2
from simple_facerec import SimpleFacerec
from pymongo import MongoClient

# Initialize the MongoDB connection
client = MongoClient('localhost', 27017)
db = client['fcRecog']  # Replace with your database name
students_collection = db['estudiantes']

# This set will hold the names of students that have been recognized
recognized_once = set()

# Load Camera
cap = cv2.VideoCapture(0)

# Encode faces from a folder
sfr = SimpleFacerec()
sfr.load_encoding_images("images/")

while True:
    ret, frame = cap.read()

    # Detect faces
    face_locations, face_names = sfr.detect_known_faces(frame)

    for face_loc, name in zip(face_locations, face_names):
        y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]

        cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 0), 2)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)

        # Update MongoDB for new recognitions
        if name not in recognized_once:
            recognized_once.add(name)
            # Update the MongoDB database
            students_collection.update_one({"nombre_del_alumno": name}, {"$inc": {"asistencias": 1}})

    cv2.imshow('Frame', frame)

    key = cv2.waitKey(1)
    if key == 27:
        break

cap.release()
cv2.destroyAllWindows()
client.close()
