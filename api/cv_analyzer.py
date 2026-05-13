from pathlib import Path

# Rutas dinámicas — nunca absolutas, funciona en cualquier máquina/servidor
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BASE_DIR / "storage" / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


class CVAnalyzer:
    def __init__(self, cv_folder=None):
        self.cv_folder = Path(cv_folder) if cv_folder else UPLOADS_DIR

    def scan_cvs(self) -> dict:
        cv_data = {}
        if not self.cv_folder.exists():
            return {}
        for filepath in self.cv_folder.glob("*.pdf"):
            try:
                from pdfminer.high_level import extract_text
                text = extract_text(str(filepath))
                cv_data[filepath.name] = {
                    "content": text,
                    "length": len(text),
                }
            except Exception as e:
                print(f"Failed to process {filepath.name}: {e}")
        return cv_data

    def get_cv_text(self, filename: str) -> str | None:
        filepath = self.cv_folder / filename
        if filepath.exists() and filename.endswith(".pdf"):
            try:
                from pdfminer.high_level import extract_text
                return extract_text(str(filepath))
            except Exception as e:
                print(f"Error reading {filename}: {e}")
        return None
