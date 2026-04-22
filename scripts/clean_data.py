import json
import re

def clean_text(text):
    if not text:
        return ""
    # Remove markers like ।।1.1।। or 1.1 or ।।1.1 -- 1.5।।
    # Handle both Sanskrit style ।। and English style numerals
    cleaned = re.sub(r'।।\d+\.\d+( -- \d+\.\d+)?।।', '', text)
    cleaned = re.sub(r'^\d+\.\d+', '', cleaned)
    # Remove leading/trailing markers and spaces
    cleaned = cleaned.strip()
    return cleaned

def is_hindi(text):
    # Check for Devanagari characters
    return bool(re.search(r'[\u0900-\u097F]', text))

def process():
    file_path = 'data/gita_full.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for verse in data:
        # Clean Sanskrit
        if 'sanskrit' in verse['translations']:
            verse['translations']['sanskrit']['text'] = clean_text(verse['translations']['sanskrit']['text'])
        
        # Check current English field
        en_field = verse['translations'].get('en', {})
        en_text = en_field.get('text', '')
        
        # If English field contains Hindi, move it to Hindi field
        if is_hindi(en_text):
            if 'hi' not in verse['translations']:
                verse['translations']['hi'] = {"text": "", "source": en_field.get('source', '')}
            
            verse['translations']['hi']['text'] = clean_text(en_text)
            # Clear the English text since it's actually Hindi
            verse['translations']['en']['text'] = "" 
        else:
            verse['translations']['en']['text'] = clean_text(en_text)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("Cleaned data and separated Hindi from English.")

if __name__ == "__main__":
    process()
