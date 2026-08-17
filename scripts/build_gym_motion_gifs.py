import os
import glob
from PIL import Image, ImageEnhance

BRAIN_DIR = r"C:\Users\mcreg\.gemini\antigravity\brain\9996f6c5-aa47-46dc-8d23-8c8c8582b4a1"
TARGET_DIR = r"C:\Users\mcreg\Desktop\SAM Fit\public\artifacts\exercises"

os.makedirs(TARGET_DIR, exist_ok=True)

# List of exercise definitions with matching generated files
EXERCISES = [
    {
        "name": "leg_press",
        "frames": ["leg_press_start_*.jpg", "leg_press_ext_*.jpg"],
        "gif_name": "leg_press_motion.gif",
        "cover_name": "leg_press_illustrated.jpg",
        "start_name": "leg_press_start.png",
        "finish_name": "leg_press_finish.png"
    },
    {
        "name": "chest_press",
        "frames": ["chest_press_start_*.jpg", "chest_press_ext_*.jpg"],
        "gif_name": "chest_press_motion.gif",
        "cover_name": "chest_press_illustrated.jpg",
        "start_name": "chest_press_start.png",
        "finish_name": "chest_press_finish.png"
    },
    {
        "name": "lat_pulldown",
        "frames": ["lat_pulldown_start_*.jpg", "lat_pulldown_pulled_*.jpg"],
        "gif_name": "lat_pulldown_motion.gif",
        "cover_name": "lat_pulldown_illustrated.jpg",
        "start_name": "lat_pulldown_start.png",
        "finish_name": "lat_pulldown_finish.png"
    },
    {
        "name": "seated_row",
        "frames": ["seated_row_start_*.jpg", "seated_row_pulled_*.jpg"],
        "gif_name": "seated_row_motion.gif",
        "cover_name": "seated_row_illustrated.jpg",
        "start_name": "seated_row_start.png",
        "finish_name": "seated_row_finish.png"
    },
    {
        "name": "leg_extension",
        "frames": ["leg_ext_start_*.jpg", "leg_ext_finish_*.jpg"],
        "gif_name": "leg_extension_motion.gif",
        "cover_name": "leg_extension_illustrated.jpg",
        "start_name": "leg_extension_start.png",
        "finish_name": "leg_extension_finish.png"
    },
    {
        "name": "seated_leg_curl",
        "frames": ["seated_leg_curl_*.jpg"],
        "gif_name": "seated_leg_curl_motion.gif",
        "cover_name": "seated_leg_curl_illustrated.jpg",
        "start_name": "seated_leg_curl_start.png",
        "finish_name": "seated_leg_curl_finish.png"
    },
    {
        "name": "shoulder_press",
        "frames": ["shoulder_press_*.jpg"],
        "gif_name": "shoulder_press_motion.gif",
        "cover_name": "shoulder_press_illustrated.jpg",
        "start_name": "shoulder_press_start.png",
        "finish_name": "shoulder_press_finish.png"
    },
    {
        "name": "triceps_pressdown",
        "frames": ["triceps_pressdown_*.jpg"],
        "gif_name": "triceps_pressdown_motion.gif",
        "cover_name": "tricep_pressdown_illustrated.jpg",
        "start_name": "triceps_pressdown_start.png",
        "finish_name": "triceps_pressdown_finish.png"
    },
    {
        "name": "cable_fly",
        "frames": ["cable_fly_*.jpg"],
        "gif_name": "cable_fly_motion.gif",
        "cover_name": "cable_fly_illustrated.jpg",
        "start_name": "cable_fly_start.png",
        "finish_name": "cable_fly_finish.png"
    },
    {
        "name": "recumbent_bike",
        "frames": ["recumbent_bike_*.jpg"],
        "gif_name": "recumbent_bike_motion.gif",
        "cover_name": "recumbent_bike_illustrated.jpg",
        "start_name": "recumbent_bike_start.png",
        "finish_name": "recumbent_bike_finish.png"
    },
    {
        "name": "treadmill_walk",
        "frames": ["treadmill_walk_*.jpg"],
        "gif_name": "treadmill_walk_motion.gif",
        "cover_name": "treadmill_walk_start.png",
        "start_name": "treadmill_walk_start.png",
        "finish_name": "treadmill_walk_finish.png"
    },
    {
        "name": "hip_mobility",
        "frames": ["hip_mobility_*.jpg"],
        "gif_name": "hip_mobility_motion.gif",
        "cover_name": "hip_mobility_illustrated.jpg",
        "start_name": "hip_mobility_start.png",
        "finish_name": "hip_mobility_finish.png"
    },
    {
        "name": "shoulder_circles",
        "frames": ["shoulder_circles_*.jpg"],
        "gif_name": "shoulder_circles_motion.gif",
        "cover_name": "shoulder_circles_start.png",
        "start_name": "shoulder_circles_start.png",
        "finish_name": "shoulder_circles_finish.png"
    }
]

def find_file(pattern):
    matches = glob.glob(os.path.join(BRAIN_DIR, pattern))
    if matches:
        matches.sort(key=os.path.getmtime, reverse=True)
        return matches[0]
    return None

def process_exercise(ex):
    print(f"Processing {ex['name']}...")
    found_frames = []
    for p in ex["frames"]:
        f = find_file(p)
        if f and os.path.exists(f):
            found_frames.append(f)
    
    if not found_frames:
        print(f"  Warning: No frames found for {ex['name']}")
        return

    images = [Image.open(f).convert("RGB") for f in found_frames]
    
    # Resize to standard 640x640
    resized_images = [img.resize((640, 640), Image.Resampling.LANCZOS) for img in images]
    
    # Save static cover
    cover_path = os.path.join(TARGET_DIR, ex["cover_name"])
    resized_images[0].save(cover_path, quality=92)
    print(f"  Saved cover -> {ex['cover_name']}")

    # Save start & finish png
    start_path = os.path.join(TARGET_DIR, ex["start_name"])
    resized_images[0].save(start_path)
    
    if len(resized_images) > 1:
        finish_path = os.path.join(TARGET_DIR, ex["finish_name"])
        resized_images[1].save(finish_path)

    # Build looping animated GIF
    # If 2 frames: create smooth 4-frame bounce [0, 1, 1, 0] with 600ms duration
    if len(resized_images) >= 2:
        gif_frames = [
            resized_images[0],
            resized_images[1],
            resized_images[1],
            resized_images[0]
        ]
        durations = [650, 750, 650, 750]
    else:
        # Subtle dynamic brightness/scale bounce for single frame to create breathing motion
        enhancer = ImageEnhance.Brightness(resized_images[0])
        f1 = resized_images[0]
        f2 = enhancer.enhance(1.05)
        f3 = enhancer.enhance(0.96)
        gif_frames = [f1, f2, f1, f3]
        durations = [700, 700, 700, 700]

    gif_path = os.path.join(TARGET_DIR, ex["gif_name"])
    gif_frames[0].save(
        gif_path,
        save_all=True,
        append_images=gif_frames[1:],
        duration=durations,
        loop=0,
        optimize=True
    )
    print(f"  Saved animated GIF -> {ex['gif_name']}")

for ex in EXERCISES:
    process_exercise(ex)

print("All Gym exercises updated successfully with Sami's Avatar!")
