"""
Data Processor Module
Handles xBD dataset operations for the Flask backend
"""

import os
import json
import glob
from pathlib import Path
from PIL import Image
import numpy as np

class XBDDataProcessor:
    """Process and serve xBD dataset data"""
    
    def __init__(self, dataset_path):
        self.dataset_path = Path(dataset_path)
        self.train_path = self.dataset_path / "train"
        self.test_path = self.dataset_path / "test"
        self.disasters_cache = None
        
    def load_disasters_metadata(self):
        """Load disasters.json metadata"""
        if self.disasters_cache is not None:
            return self.disasters_cache
            
        metadata_path = self.dataset_path / "src" / "data" / "disasters.json"
        if metadata_path.exists():
            with open(metadata_path, 'r') as f:
                self.disasters_cache = json.load(f)
            return self.disasters_cache
        
        return {"disasters": [], "metadata": {}}
    
    def get_disaster_by_id(self, disaster_id):
        """Get specific disaster by ID"""
        disasters_data = self.load_disasters_metadata()
        for disaster in disasters_data.get('disasters', []):
            if disaster['id'] == disaster_id:
                return disaster
        return None
    
    def get_disaster_by_name(self, disaster_name):
        """Get disaster by xBD name"""
        disasters_data = self.load_disasters_metadata()
        for disaster in disasters_data.get('disasters', []):
            if disaster.get('xbd_data', {}).get('disaster_name') == disaster_name:
                return disaster
        return None
    
    def get_image_path(self, disaster_name, image_type='before', index=0):
        """Get path to specific disaster image"""
        # Search in train and test directories
        for split in ['train', 'test']:
            images_path = self.dataset_path / split / "images"
            
            if image_type == 'before':
                pattern = f"{disaster_name}_*_pre_disaster.png"
            else:
                pattern = f"{disaster_name}_*_post_disaster.png"
            
            matching_files = sorted(list(images_path.glob(pattern)))
            if matching_files and index < len(matching_files):
                return matching_files[index]
        
        return None
    
    def get_image_path_by_id(self, disaster_name, image_type='before', image_id=None):
        """Get path to specific disaster image by image_id"""
        if not image_id:
            return self.get_image_path(disaster_name, image_type, 0)
        
        # Search in train and test directories
        for split in ['train', 'test']:
            images_path = self.dataset_path / split / "images"
            
            if image_type == 'before':
                filename = f"{image_id}_pre_disaster.png"
            else:
                filename = f"{image_id}_post_disaster.png"
            
            image_path = images_path / filename
            if image_path.exists():
                return image_path
        
        return None
    
    def get_all_image_pairs(self, disaster_name):
        """Get all before/after image pairs for a disaster"""
        pairs = []
        
        for split in ['train', 'test']:
            images_path = self.dataset_path / split / "images"
            
            # Get all pre-disaster images
            pre_pattern = f"{disaster_name}_*_pre_disaster.png"
            pre_images = sorted(images_path.glob(pre_pattern))
            
            for pre_img in pre_images:
                # Find corresponding post image
                base_name = pre_img.stem.replace('_pre_disaster', '')
                post_img = images_path / f"{base_name}_post_disaster.png"
                
                if post_img.exists():
                    pairs.append({
                        'before': str(pre_img),
                        'after': str(post_img),
                        'id': base_name
                    })
        
        return pairs
    
    def get_target_mask(self, disaster_name, image_type='post', index=0):
        """Get damage target mask for an image"""
        for split in ['train', 'test']:
            targets_path = self.dataset_path / split / "targets"
            
            if image_type == 'before':
                pattern = f"{disaster_name}_*_pre_disaster.png"
            else:
                pattern = f"{disaster_name}_*_post_disaster.png"
            
            matching_files = list(targets_path.glob(pattern))
            if matching_files and index < len(matching_files):
                return matching_files[index]
        
        return None
    
    def create_thumbnail(self, image_path, size=(300, 300)):
        """Create thumbnail from image"""
        try:
            img = Image.open(image_path)
            img.thumbnail(size, Image.Resampling.LANCZOS)
            return img
        except Exception as e:
            print(f"Error creating thumbnail: {e}")
            return None
    
    def get_disaster_statistics(self, disaster_name):
        """Calculate statistics for a specific disaster"""
        disaster = self.get_disaster_by_name(disaster_name)
        if not disaster:
            return None
        
        # Get all image pairs
        pairs = self.get_all_image_pairs(disaster_name)
        
        return {
            'disaster_name': disaster_name,
            'total_image_pairs': len(pairs),
            'disaster_type': disaster.get('type'),
            'severity': disaster.get('severity'),
            'coordinates': disaster.get('coordinates'),
            'damage_metrics': disaster.get('damage', {})
        }
