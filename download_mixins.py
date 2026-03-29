import urllib.request
import os
from rembg import remove
from PIL import Image
import io

urls = {
    'almonds': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Almonds.jpg',
    'cashew': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Roasted_cashews.jpg',
    'raisins': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Raisins_2.jpg'
}

out_dir = os.path.join('public', 'images')
os.makedirs(out_dir, exist_ok=True)

for name, url in urls.items():
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = response.read()
            
            print(f"Removing background from {name}...")
            # Use rembg to cut out the nuts perfectly!
            output_data = remove(data)
            
            # Save PNG
            img = Image.open(io.BytesIO(output_data))
            # Resize them to a manageable icon size (like 150x150)
            img.thumbnail((200, 200))
            out_path = os.path.join(out_dir, f"mixin-{name}.png")
            img.save(out_path, format="PNG")
            print(f"Saved {out_path}")
    except Exception as e:
        print(f"Failed processing {name}: {e}")

print("Done downloading mixin assets!")
