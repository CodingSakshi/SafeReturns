from pyfiles import face_utils as fs

# Example usage
if __name__ == "__main__":
    # img1_path = "images/img.jpg"
    img1_path = "images/found/1728661511194-img24.jpg"
    # img2_path = "data/img2.jpg"

    # Detect face
    if fs.is_face_detected(img1_path):
        print(f"Face detected in {img1_path}.")
    else:
        print(f"No face detected in {img1_path}.")
        exit()

    # Detect face
    # if fs.is_face_detected(img2_path):
    #     print(f"Face detected in {img2_path}.")
    # else:
    #     print(f"No face detected in {img2_path}.")
    #     exit()

    # # Verify faces
    # verification_result = fs.verify_faces(img1_path, img2_path)
    # if verification_result:
    #     print("Face verification result:", verification_result)
    # else:
    #     print("Face verification failed.")
