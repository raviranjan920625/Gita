import json
import re

def clean_commentary(text):
    if not text: return ""
    # Remove markers like "1.1", "1.1.", "1.1-2", "।।1.1।।", "Verse 1:"
    text = re.sub(r'^(।।)?\d+\.\d+( -- \d+\.\d+)?(।।)?', '', text)
    text = re.sub(r'^\d+', '', text)
    text = re.sub(r'^Verse \d+:', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^Shloka \d+:', '', text, flags=re.IGNORECASE)
    return text.strip()

def assign_metadata(verse):
    text = (verse['translations']['en']['text'] + " " + verse['commentary']['en']).lower()
    
    # Keyword-based concepts
    concepts = []
    tags = []
    
    keywords = {
        "yoga": ["yoga", "union", "meditation"],
        "dharma": ["dharma", "righteousness", "duty"],
        "karma": ["karma", "action", "deeds"],
        "soul": ["soul", "atman", "self", "immortal"],
        "bhakti": ["bhakti", "devotion", "love", "worship"],
        "knowledge": ["knowledge", "wisdom", "jnana"],
        "gunas": ["gunas", "sattva", "rajas", "tamas"],
        "renunciation": ["renunciation", "sannyasa", "abandon"],
        "warrior": ["warrior", "battle", "fight"]
    }
    
    for concept, terms in keywords.items():
        if any(term in text for term in terms):
            concepts.append(concept)
            tags.append(concept)

    # Importance Score Logic (Heuristic)
    # Give higher scores to verses in significant chapters (2, 4, 9, 11, 18)
    # and specific famous verses.
    score = 0.5
    chapter = verse['location']['chapter']
    verse_num = verse['location']['verse']
    
    if chapter in [2, 9, 11, 18]: score += 0.2
    
    # Famous verses
    famous = [
        (2, 47), (2, 20), (3, 19), (4, 7), (4, 8), 
        (7, 1), (9, 22), (9, 27), (11, 12), (18, 66)
    ]
    if (chapter, verse_num) in famous:
        score = 1.0
        concepts.append("most_important")
        tags.append("divine_message")

    verse['metadata']['concepts'] = list(set(concepts))
    verse['metadata']['tags'] = list(set(tags))
    verse['metadata']['importance_score'] = min(round(score, 2), 1.0)
    
    return verse

def process():
    file_path = 'data/gita_full.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for verse in data:
        # 1. Remove numbers from commentaries
        verse['commentary']['en'] = clean_commentary(verse['commentary']['en'])
        verse['commentary']['hi'] = clean_commentary(verse['commentary']['hi'])
        
        # 2. Assign concepts, tags, and importance scores
        verse = assign_metadata(verse)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("Cleaned commentaries and enriched metadata (concepts, tags, scores).")

if __name__ == "__main__":
    process()
