import re
from collections import Counter


def tokenize_text(text: str) -> list[str]:
    return re.findall(r"\b\w+\b", text.lower())


def analyze_reading(expected_text: str, spoken_text: str) -> dict:
    expected_words = tokenize_text(expected_text)
    spoken_words = tokenize_text(spoken_text)

    expected_count = len(expected_words)
    spoken_count = len(spoken_words)

    expected_counter = Counter(expected_words)
    spoken_counter = Counter(spoken_words)

    matched_words = sum((expected_counter & spoken_counter).values())
    missing_words = max(expected_count - matched_words, 0)
    extra_words = max(spoken_count - matched_words, 0)

    if expected_count == 0:
        accuracy_score = 0.0
    else:
        accuracy_score = round((matched_words / expected_count) * 100, 2)

    # Simple MVP fluency score based on transcript completeness
    fluency_score = round(max(0.0, min(100.0, accuracy_score - (extra_words * 2))), 2)

    # Placeholder for now
    comprehension_score = 0.0

    feedback_parts = []

    if accuracy_score >= 90:
        feedback_parts.append("Excellent reading accuracy.")
    elif accuracy_score >= 75:
        feedback_parts.append("Good reading accuracy, with some room for improvement.")
    else:
        feedback_parts.append("Reading accuracy needs improvement.")

    feedback_parts.append(f"Matched words: {matched_words}.")
    feedback_parts.append(f"Missing words: {missing_words}.")
    feedback_parts.append(f"Extra words: {extra_words}.")

    feedback_summary = " ".join(feedback_parts)

    return {
        "word_count": spoken_count,
        "accuracy_score": accuracy_score,
        "fluency_score": fluency_score,
        "comprehension_score": comprehension_score,
        "feedback_summary": feedback_summary,
    }