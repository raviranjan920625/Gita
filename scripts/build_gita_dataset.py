import requests
import json
import time
import re

BASE_URL = "https://bhagavad-gita3.p.rapidapi.com/v2/chapters/{}/verses/"
HEADERS = {
    "X-RapidAPI-Key": "d1f664e510msh775e535b507030dp1eae3bjsn011e34781ec4",
    "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com"
}

def clean(text):
    if not text: return ""
    # Remove markers like ।।1.1।।
    text = re.sub(r'।।\d+\.\d+( -- \d+\.\d+)?।।', '', text)
    return text.strip()

def process():
    all_verses = []
    print("Starting full dataset rebuild with multi-language support...")

    for chapter in range(1, 19):
        print(f"Fetching Chapter {chapter}...")
        url = BASE_URL.format(chapter)
        try:
            response = requests.get(url, headers=HEADERS)
            verses = response.json()
        except Exception as e:
            print(f"Error fetching chapter {chapter}: {e}")
            continue

        for v in verses:
            # Extract preferred translations
            # We look for Swami Sivananda (EN) and Swami Chinmayananda (HI)
            en_trans = ""
            hi_trans = ""
            en_source = ""
            hi_source = ""
            
            for t in v.get('translations', []):
                if t['language'] == 'english' and not en_trans:
                    en_trans = clean(t['description'])
                    en_source = t['author_name']
                if t['language'] == 'hindi' and not hi_trans:
                    hi_trans = clean(t['description'])
                    hi_source = t['author_name']
            
            # Extract English commentary (usually Swami Sivananda or similar)
            en_comm = ""
            hi_comm = ""
            for c in v.get('commentaries', []):
                if c['language'] == 'english' and not en_comm:
                    en_comm = clean(c['description'])
                if c['language'] == 'hindi' and not hi_comm:
                    hi_comm = clean(c['description'])

            verse_data = {
                "id": f"gita_{chapter}_{v['verse_number']}",
                "location": {
                    "chapter": chapter,
                    "verse": v["verse_number"]
                },
                "translations": {
                    "sanskrit": {
                        "text": clean(v["text"]) + " ||",
                        "transliteration": v.get("transliteration", "")
                    },
                    "en": { "text": en_trans, "source": en_source },
                    "hi": { "text": hi_trans, "source": hi_source }
                },
                "commentary": {
                    "en": en_comm,
                    "hi": hi_comm
                },
                "metadata": {
                    "speaker": "Krishna" if chapter > 1 else "Various",
                    "listener": "Arjuna",
                    "concepts": [],
                    "tags": [],
                    "importance_score": 0.5
                }
            }
            all_verses.append(verse_data)
        
        # Small sleep to be nice to API
        time.sleep(1)

    with open("data/gita_full.json", "w", encoding="utf-8") as f:
        json.dump(all_verses, f, ensure_ascii=False, indent=2)

    print(f"Done! Generated {len(all_verses)} verses with English and Hindi.")

if __name__ == "__main__":
    process()