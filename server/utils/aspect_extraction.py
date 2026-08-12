from textblob import TextBlob
import spacy
from typing import List, Tuple, Dict, Any, Optional

try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    nlp = spacy.blank("en")

ASPECT_TAXONOMY = {
    "Service": ["staff", "waiter", "service", "reception", "hospitality", "driver", "guide", "guard", "vendor", "system", "management", "host", "behavior", "attitude"],
    "Cleanliness": ["cleanliness", "hygiene", "restroom", "bathroom", "clean", "trash", "dirty", "sanitary", "maintenance", "tidy"],
    "Food & Beverage": ["food", "seafood", "breakfast", "buffet", "snack", "coffee", "tea", "restaurant", "thali", "sweet", "prasadam", "drink", "meal", "stall", "fish", "khaja"],
    "Value & Pricing": ["price", "cost", "taxi", "ticket", "expensive", "cheap", "bargain", "fee", "fare", "rate", "value", "pricey"],
    "Amenities": ["pool", "room", "wifi", "bed", "parking", "balcony", "lighting", "ride", "resort", "hotel", "track", "counter", "seat", "shower", "ac", "blanket", "facility"],
    "Location": ["beach", "lake", "hill", "mountain", "temple", "park", "forest", "garden", "monument", "sunset", "sunrise", "view", "landscape", "climate", "weather", "location", "spot", "waterfall"],
    "Vibe & Atmosphere": ["vibe", "atmosphere", "crowd", "breeze", "culture", "experience", "noise", "ambiance", "nature", "air", "feeling"]
}

def categorize_aspect(aspect: Optional[str]) -> str:
    if not aspect:
        return "General"
    aspect_lower = aspect.lower()
    for cat, keywords in ASPECT_TAXONOMY.items():
        if any(kw in aspect_lower for kw in keywords):
            return cat
    return "General"


def extract_aspect_descriptor_pairs(doc: spacy.tokens.Doc) -> List[Dict[str, Any]]:
    pairs = []
    seen_aspects = set()

    # 1. Inspect Noun Chunks for multi-word aspects ("room service", "swimming pool", "sea beach")
    if doc.has_annotation("DEP"):
        for chunk in doc.noun_chunks:
            root = chunk.root
            if root.pos_ in ('NOUN', 'PROPN'):
                descriptors = []
                
                # Check direct child modifiers (e.g., "clean pool", "tasty local snacks")
                for child in root.children:
                    if child.pos_ == 'ADJ':
                        advs = [c.text for c in child.children if c.pos_ == 'ADV' or c.dep_ == 'neg']
                        descriptors.append(" ".join(advs + [child.text]))
                
                # Check predicate adjectives linked via copula ("The beach was serene")
                if root.dep_ in ('nsubj', 'nsubjpass', 'attr'):
                    head = root.head
                    for child in head.children:
                        if child.dep_ in ('acomp', 'attr', 'oprd') and child.pos_ == 'ADJ':
                            advs = [c.text for c in child.children if c.pos_ == 'ADV' or c.dep_ == 'neg']
                            descriptors.append(" ".join(advs + [child.text]))
                
                if descriptors:
                    aspect_term = chunk.text.strip()
                    desc_term = ", ".join(descriptors).strip()
                    pairs.append({
                        'aspect': aspect_term,
                        'description': desc_term,
                        'category': categorize_aspect(aspect_term)
                    })
                    seen_aspects.add(aspect_term.lower())

    # 2. Fallback scan for single noun tokens if noun chunks missed direct nsubj/dobj relationships
    for token in doc:
        if token.pos_ in ('NOUN', 'PROPN') and token.text.lower() not in seen_aspects:
            descriptors = []
            
            # Check child adjectives
            for child in token.children:
                if child.pos_ == 'ADJ':
                    advs = [c.text for c in child.children if c.pos_ == 'ADV' or c.dep_ == 'neg']
                    descriptors.append(" ".join(advs + [child.text]))
            
            # Check head verb adjectives
            if token.dep_ in ('nsubj', 'nsubjpass', 'dobj', 'pobj'):
                head = token.head
                for child in head.children:
                    if child.dep_ in ('acomp', 'attr', 'oprd') and child.pos_ == 'ADJ':
                        advs = [c.text for c in child.children if c.pos_ == 'ADV' or c.dep_ == 'neg']
                        descriptors.append(" ".join(advs + [child.text]))

            if descriptors:
                aspect_term = token.text.strip()
                desc_term = ", ".join(descriptors).strip()
                pairs.append({
                    'aspect': aspect_term,
                    'description': desc_term,
                    'category': categorize_aspect(aspect_term)
                })
                seen_aspects.add(aspect_term.lower())

    return pairs


def get_aspect(doc: spacy.tokens.Doc) -> str:
    pairs = extract_aspect_descriptor_pairs(doc)
    if pairs:
        return pairs[0]['aspect']
    for token in doc:
        if token.dep_ in ('nsubj', 'dobj') and token.pos_ in ('NOUN', 'PROPN'):
            return token.text
    return ''

def get_descriptor(doc: spacy.tokens.Doc) -> str:
    pairs = extract_aspect_descriptor_pairs(doc)
    if pairs:
        return pairs[0]['description']
    for i, token in enumerate(doc):
        if token.pos_ == 'ADJ':
            prepend = ' '.join([child.text for child in token.children if child.pos_ == 'ADV']) + ' '
            negation = ''
            for t in range(i, 0, -1):
                if i - t >= 0 and doc[i-t].dep_ == 'neg':
                    negation = doc[i-t].text + ' '
                    break
            return (negation + prepend + token.text).strip()
    return ''

def get_polarity(segment: str) -> float:
    polarity = round(TextBlob(segment).sentiment.polarity, 2)
    return polarity


def analysis_with_spacy(reviews_list: List[str]) -> Tuple[List[dict], List[dict]]:
    """
    Extracts fine-grained aspect-descriptor pairs, aspect categories, and polarity scores.
    """
    aspects, polarities = [], []
    for segment in reviews_list:
        doc = nlp(segment)
        polarity = get_polarity(segment)
        extracted_pairs = extract_aspect_descriptor_pairs(doc)
        
        if extracted_pairs:
            primary = extracted_pairs[0]
            aspects.append({
                'aspect': primary['aspect'],
                'description': primary['description'],
                'category': primary['category']
            })
            polarities.append({
                'aspect': primary['aspect'],
                'polarity': polarity,
                'category': primary['category']
            })
        else:
            aspects.append({'aspect': None, 'description': None, 'category': 'General'})
            polarities.append({'aspect': None, 'polarity': None, 'category': 'General'})
            
    return aspects, polarities

