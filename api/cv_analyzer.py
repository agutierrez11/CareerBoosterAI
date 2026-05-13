import os
import json
from pdfminer.high_level import extract_text

class CVAnalyzer:
    def __init__(self, cv_folder):
        self.cv_folder = cv_folder

    def scan_cvs(self):
        cv_data = {}
        if not os.path.exists(self.cv_folder):
            print(f"Error: Folder {self.cv_folder} not found.")
            return {}

        print(f"Scanning folder: {self.cv_folder}")
        for filename in os.listdir(self.cv_folder):
            if filename.lower().endswith(".pdf"):
                filepath = os.path.join(self.cv_folder, filename)
                try:
                    text = extract_text(filepath)
                    cv_data[filename] = {
                        "content": text,
                        "length": len(text)
                    }
                    print(f"Processed: {filename} ({len(text)} chars)")
                except Exception as e:
                    print(f"Failed to process {filename}: {e}")
        
        return cv_data

    def get_cv_text(self, filename):
        """Extracts text from a specific CV file."""
        filepath = os.path.join(self.cv_folder, filename)
        if os.path.exists(filepath) and filename.lower().endswith(".pdf"):
            try:
                return extract_text(filepath)
            except Exception as e:
                print(f"Error reading {filename}: {e}")
        return None

    def save_master_profile(self, data, output_file="master_profile.json"):
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Master profile saved to {output_file}")

if __name__ == "__main__":
    # Pointing to the verified user path
    CV_PATH = r"C:\Users\Antonio\OneDrive\Escritorio\CVs_2026"
    analyzer = CVAnalyzer(CV_PATH)
    data = analyzer.scan_cvs()
    analyzer.save_master_profile(data)
