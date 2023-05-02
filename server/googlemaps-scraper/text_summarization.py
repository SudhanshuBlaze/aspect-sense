import torch
from transformers import AutoTokenizer, AutoModelForSeq2Seq

def summarize(texts, max_length=100):
    # Load BERT tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-xsum-6-6")
    model = AutoModelForSeq2seq.from_pretrained("sshleifer/distilbart-xsum-6-6")

    # Set device to CUDA if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    # Generate summaries for each text
    summaries = []
    for text in texts:
        # Tokenize the text
        inputs = tokenizer.encode(text, return_tensors="pt").to(device)

        # Generate summary
        summary_ids = model.generate(inputs,
                                      num_beams=4,
                                      length_penalty=2.0,
                                      max_length=max_length,
                                      min_length=30,
                                      no_repeat_ngram_size=3)

        # Decode the summary
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        summaries.append(summary)

    return summaries
texts = ["This is the first text to summarize.", "This is the second text to summarize."]
summaries = summarize(texts)
print(summaries)
