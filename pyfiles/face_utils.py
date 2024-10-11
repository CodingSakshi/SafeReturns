from deepface import DeepFace
import os

# Setting environment variable to reduce TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


# To verify faces
def verify_faces(img1_path, img2_path):
    try:
        result = DeepFace.verify(img1_path=img1_path, img2_path=img2_path, model_name='Facenet',
                                 enforce_detection=False)
        return result
    except Exception as e:
        # Print the error message and return None
        print(f"An error occurred: {e}")
        return None


# To detect face from images
def is_face_detected(image_path):
    try:
        extracted_faces = DeepFace.extract_faces(image_path, enforce_detection=True)

        if len(extracted_faces) > 0:
            return True
        else:
            return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
