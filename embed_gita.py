import json
import time
from pinecone import Pinecone, ServerlessSpec

# Configuration
API_KEY = "pcsk_57WZeu_SpdsP7xKgNRgjw86GEcNpqTWnTasDuB5N4ETDPMmsGoSjVRh47Ubws9V8wbZ87w"
INDEX_NAME = "gita-full"
JSON_FILE = "data/gita_full.json"
MODEL = "multilingual-e5-large"
DIMENSION = 1024

def main():
    pc = Pinecone(api_key=API_KEY)

    # 1. Handle Index
    if INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=INDEX_NAME,
            dimension=DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
        while not pc.describe_index(INDEX_NAME).status['ready']:
            time.sleep(2)
    
    index = pc.Index(INDEX_NAME)

    # 2. Load and parse JSON
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        verses = json.load(f)

    # 3. Prepare texts for embedding
    texts = []
    metadata_list = []
    ids = []

    for verse in verses:
        v_id = verse['id']
        chapter = verse['location']['chapter']
        verse_num = verse['location']['verse']
        
        en_text = verse['translations']['en']['text']
        hi_text = verse['translations']['hi']['text']
        sa_text = verse['translations']['sanskrit']['text']
        en_comm = verse.get('commentary', {}).get('en', '')
        hi_comm = verse.get('commentary', {}).get('hi', '')
        
        # Combined text for embedding - Multi-language support
        combined_text = f"Chapter {chapter} Verse {verse_num}\nSanskrit: {sa_text}\nEnglish: {en_text}\nHindi: {hi_text}\nCommentary (EN): {en_comm}\nCommentary (HI): {hi_comm}"
        
        texts.append(combined_text)
        metadata_list.append({
            "id": v_id,
            "chapter": str(chapter),
            "verse": str(verse_num),
            "en": en_text,
            "hi": hi_text,
            "sanskrit": sa_text,
            "speaker": verse['metadata']['speaker']
        })
        ids.append(v_id)

    # 4. Generate Embeddings in batches
    print(f"Embedding {len(texts)} verses with multilingual support...")
    batch_size = 20
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i + batch_size]
        print(f"  Batch {i//batch_size + 1}/{len(texts)//batch_size + 1}...")
        embeddings = pc.inference.embed(
            model=MODEL,
            inputs=batch_texts,
            parameters={"input_type": "passage", "truncate": "END"}
        )
        all_embeddings.extend(embeddings)
        time.sleep(5) # Add 5s delay to stay under rate limits (250k tokens/min)

    # 5. Upsert to Pinecone
    print("Upserting to Pinecone...")
    vectors = []
    for i, emb in enumerate(all_embeddings):
        vectors.append({
            "id": ids[i],
            "values": emb.values,
            "metadata": metadata_list[i]
        })
    
    for i in range(0, len(vectors), 100):
        index.upsert(vectors=vectors[i:i + 100])
    
    print("Optimization Complete!")

if __name__ == "__main__":
    main()
