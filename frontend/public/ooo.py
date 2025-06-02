#!/usr/bin/env python3
import sys
from PIL import Image

# Hard-coded path to your PNG
IMG_PATH = r'C:\Users\phear\PycharmProjects\AUPP-eCampus\frontend\public\aupp_ecampus_logo.png'

def main():
    try:
        with Image.open(IMG_PATH) as img:
            w, h = img.size
            print(f"{IMG_PATH}: {w}px × {h}px")
    except FileNotFoundError:
        print(f"Error: File not found: {IMG_PATH}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading image: {e}", file=sys.stderr)
        sys.exit(2)

if __name__ == "__main__":
    main()
