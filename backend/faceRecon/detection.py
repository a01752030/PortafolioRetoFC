import cv2
import os
import face_recognition
from ultralytics import YOLO
from pymongo import MongoClient
import time

def process_video_and_detect_faces():
    client = MongoClient('localhost', 27017)
    db = client['fcRecog']
    students_collection = db['estudiantes']

    start_time = time.time()
    model_pose = YOLO('yolov8n-pose.pt')

    # Directory containing known face images
    known_faces_dir = r'.\faceRecon\faces'

    # Initialize lists to store known face encodings and labels
    known_face_encodings = []
    known_face_labels = []

    # Load known face images and create face encodings
    for filename in os.listdir(known_faces_dir):
        if filename.endswith(".jpg"):
            # Load the image file
            face_image = face_recognition.load_image_file(os.path.join(known_faces_dir, filename))

            face_location = face_recognition.face_locations(face_image, model="hog")

            # Extract face encodings from the image
            face_encoding = face_recognition.face_encodings(face_image, face_location)[0]  # Assuming there's only one face in each image

            # Extract the label (person's name) from the filename (excluding the extension)
            label = os.path.splitext(filename)[0]

            # Add the face encoding and label to the lists
            known_face_encodings.append(face_encoding)
            known_face_labels.append(label)

    names = {name: [0, 0, 'down'] for name in known_face_labels}

    detect_conf = 0.6
    track_conf = 0.6

    path = r".\faceRecon\RecentParti\MostRecentParti.mp4"

    vidFile = cv2.VideoCapture(path)

    nFrames = int(vidFile.get(cv2.CAP_PROP_FRAME_COUNT))  # one good way of namespacing legacy openCV: cv2.cv.*

    names = {name: [0, 0, 'down'] for name in known_face_labels}
    names['Unknown'] = [0, 0, 'down']

    prevs = []
    news = []

    for l in range(nFrames - 1):
        ret, frame = vidFile.read()  # read next frame, get next return code
        if l % 10 != 0: continue
        else:
            image = frame.copy()

            show = image.copy()

            results = model_pose(image, show=False, conf=0.39, save=False, verbose=False)

            show = results[0].plot()

            for i in range(len(results[0].boxes.cls)):

                keypoints = results[0].keypoints.xy[i]
                nose = keypoints[0][1]
                rght_hnd = keypoints[10][1]
                lft_hnd = keypoints[9][1]

                cond1 = nose > rght_hnd
                cond2 = nose > lft_hnd

                if rght_hnd == 0:
                    cond1 = False
                if lft_hnd == 0:
                    cond2 = False

                if cond1 or cond2:
                    box = results[0].boxes.xyxy[i]

                    x = int(box[0])
                    y = int(box[1])
                    w = int(box[2]) - x
                    h = int(box[3]) - y

                    image_crop = cv2.cvtColor(image[y:y + h, x:x + w], cv2.COLOR_BGR2RGB)

                    face_locations = face_recognition.face_locations(image_crop, model="hog")
                    face_encodings = face_recognition.face_encodings(image_crop, face_locations)

                    top, right, bottom, left = face_locations[0]
                    face_encoding = face_encodings[0]

                    # Check if the detected face matches any known face
                    matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.4)
                    name = "Unknown"  # Default label if no match is found

                    # If a match is found, use the name corresponding to the known face
                    if True in matches:
                        first_match_index = matches.index(True)
                        name = known_face_labels[first_match_index]

                    news.append(name)

                    names[name][0] += 1
                    if names[name][0] > 0 and names[name][2] == 'down':
                        names[name][1] += 1
                        students_collection.update_one({"nombre_del_alumno": name}, {"$inc": {"participaciones": 1}})
                        names[name][2] = 'up'
                        names[name][0] = 0

            for prev in prevs:
                if prev not in news:
                    names[prev][2] = 'down'
                    names[prev][0] = 0

            prevs = news
            news = []
    vidFile.release()        
    end_time = time.time()
    elapsed_time = end_time - start_time

    try:
        print(names)
        print(f"Script execution time: {elapsed_time:.2f} seconds")
        os.remove(path)
        print(f"Video '{path}' has been deleted successfully.")
        return "success"
    except Exception as e:
        print(f"Error deleting video '{path}': {e}")
        return str(e)


if __name__=="__main__":
    print(process_video_and_detect_faces())