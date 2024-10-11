from pyfiles import face_utils as fs
import sys

# Example usage
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python main.py <image_path>")
        sys.exit(1)

    img_path = sys.argv[1]

    # Detect face
    print(fs.is_face_detected(img_path))


