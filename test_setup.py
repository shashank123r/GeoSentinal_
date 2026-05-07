"""
Test script to verify xBD integration
Run this to check if everything is set up correctly
"""

import os
import sys
from pathlib import Path

def check_mark(condition):
    return "✅" if condition else "❌"

def test_setup():
    print("=" * 60)
    print("GeoSentinel xBD Integration - Setup Verification")
    print("=" * 60)
    print()
    
    # Check 1: Dataset directories
    print("1. Checking dataset directories...")
    train_exists = Path("train").exists()
    test_exists = Path("test").exists()
    train_images = Path("train/images").exists() if train_exists else False
    test_images = Path("test/images").exists() if test_exists else False
    
    print(f"   {check_mark(train_exists)} train/ directory")
    print(f"   {check_mark(test_exists)} test/ directory")
    print(f"   {check_mark(train_images)} train/images/ directory")
    print(f"   {check_mark(test_images)} test/images/ directory")
    print()
    
    # Check 2: Generated files
    print("2. Checking generated metadata files...")
    disasters_json = Path("src/data/disasters.json").exists()
    statistics_json = Path("src/data/statistics.json").exists()
    
    print(f"   {check_mark(disasters_json)} src/data/disasters.json")
    print(f"   {check_mark(statistics_json)} src/data/statistics.json")
    
    if disasters_json:
        import json
        with open("src/data/disasters.json") as f:
            data = json.load(f)
            disaster_count = len(data.get("disasters", []))
            print(f"   📊 Found {disaster_count} disasters in metadata")
    print()
    
    # Check 3: Backend files
    print("3. Checking backend files...")
    backend_files = [
        "backend/app.py",
        "backend/model_inference.py",
        "backend/data_processor.py",
        "backend/requirements.txt"
    ]
    
    for file in backend_files:
        exists = Path(file).exists()
        print(f"   {check_mark(exists)} {file}")
    print()
    
    # Check 4: Frontend files
    print("4. Checking frontend files...")
    frontend_files = [
        "src/utils/api.js",
        "src/components/Sections/Comparison.jsx",
        "package.json"
    ]
    
    for file in frontend_files:
        exists = Path(file).exists()
        print(f"   {check_mark(exists)} {file}")
    print()
    
    # Check 5: Python dependencies
    print("5. Checking Python dependencies...")
    try:
        import flask
        print(f"   ✅ flask ({flask.__version__})")
    except ImportError:
        print("   ❌ flask (not installed)")
    
    try:
        import torch
        print(f"   ✅ torch ({torch.__version__})")
    except ImportError:
        print("   ❌ torch (not installed - run: pip install torch)")
    
    try:
        import PIL
        print(f"   ✅ pillow ({PIL.__version__})")
    except ImportError:
        print("   ❌ pillow (not installed)")
    
    try:
        import cv2
        print(f"   ✅ opencv-python ({cv2.__version__})")
    except ImportError:
        print("   ❌ opencv-python (not installed)")
    print()
    
    # Check 6: Sample images
    print("6. Checking sample images...")
    if train_images:
        train_image_count = len(list(Path("train/images").glob("*.png")))
        print(f"   📸 {train_image_count} images in train/images/")
    if test_images:
        test_image_count = len(list(Path("test/images").glob("*.png")))
        print(f"   📸 {test_image_count} images in test/images/")
    print()
    
    # Summary
    print("=" * 60)
    print("Summary:")
    print("=" * 60)
    
    all_checks = [
        train_exists and test_exists,
        disasters_json and statistics_json,
        all(Path(f).exists() for f in backend_files),
        all(Path(f).exists() for f in frontend_files)
    ]
    
    if all(all_checks):
        print("✅ All core files are in place!")
        print()
        print("Next steps:")
        print("1. Install Python dependencies:")
        print("   cd backend")
        print("   pip install -r requirements.txt")
        print()
        print("2. Start backend:")
        print("   python app.py")
        print()
        print("3. Start frontend (in new terminal):")
        print("   npm run dev")
    else:
        print("⚠️  Some files are missing. Please check the errors above.")
        print()
        if not disasters_json:
            print("Run: python scripts/process_xbd_dataset.py")
    
    print("=" * 60)

if __name__ == "__main__":
    # Change to project directory if needed
    if Path("geosentinal").exists():
        os.chdir("geosentinal")
        print("Changed directory to: geosentinal/")
        print()
    
    test_setup()
