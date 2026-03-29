import cv2
import numpy as np
import os
from rembg import remove
from PIL import Image

def process_images():
    brain_dir = r"C:\Users\pc\.gemini\antigravity\brain\66dac3b4-9e31-4560-b3df-61504baefae3"
    input_tray_path = os.path.join(brain_dir, "media__1774759528769.png")
    output_dir = r"C:\Users\pc\.gemini\antigravity\scratch\chocolate-website\public\images"
    
    # 1. Remove background from the main tray image
    print(f"Loading {input_tray_path}...")
    try:
        input_image = cv2.imread(input_tray_path)
        if input_image is None:
            print("Failed to read image")
            return
            
        print("Removing background for the tray...")
        output_image = remove(input_image)
        
        # 2. Crop tightly to the non-transparent pixels
        print("Cropping tightly...")
        # Get alpha channel
        alpha = output_image[:, :, 3]
        # Find contour
        coords = cv2.findNonZero(alpha)
        x, y, w, h = cv2.boundingRect(coords)
        
        tight_tray = output_image[y:y+h, x:x+w]
        
        # Save authentic tray
        tray_out_path = os.path.join(output_dir, "mystifyme-authentic-tray.png")
        cv2.imwrite(tray_out_path, tight_tray)
        print(f"Saved {tray_out_path}")
        
        # 3. Extract a single chocolate truffle (approximate crop from the center cluster)
        # The tray is filled with white spherical chocolates.
        # We'll take a crop near the center of the bounding box.
        center_x = w // 2 - 20
        center_y = int(h * 0.45) # slightly higher than center
        truffle_size = int(w * 0.15) # approximate size of one truffle
        
        single_truffle = tight_tray[center_y:center_y+truffle_size, center_x:center_x+truffle_size]
        truffle_out_path = os.path.join(output_dir, "mystifyme-single-truffle.png")
        cv2.imwrite(truffle_out_path, single_truffle)
        print(f"Saved {truffle_out_path}")
        
    except Exception as e:
        print(f"Error processing images: {e}")

if __name__ == "__main__":
    process_images()
