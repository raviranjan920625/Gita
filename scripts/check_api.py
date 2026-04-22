import requests
import json

BASE_URL = "https://bhagavad-gita3.p.rapidapi.com/v2/chapters/1/verses/1/"
HEADERS = {
    "X-RapidAPI-Key": "d1f664e510msh775e535b507030dp1eae3bjsn011e34781ec4",
    "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com"
}

response = requests.get(BASE_URL, headers=HEADERS)
verse = response.json()

print("Available Translations:")
for t in verse.get('translations', []):
    print(f"- Author: {t['author_name']}, Language: {t['language']}, Text Snippet: {t['description'][:50]}...")

print("\nAvailable Commentaries:")
for c in verse.get('commentaries', []):
    print(f"- Author: {c['author_name']}, Language: {c['language']}, Text Snippet: {c['description'][:50]}...")
