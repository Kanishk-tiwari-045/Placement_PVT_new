# required libraries
import nltk
import string
from nltk.corpus import stopwords
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer
from extract_text import train_resumes, test_resumes

# Single words removal
single_words = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
def remove_single_word(text):
    return ' '.join([word for word in text.split() if word not in single_words])

train_resumes_str = [remove_single_word(resume) for resume in train_resumes]
test_resumes_str = [remove_single_word(resume) for resume in test_resumes]

# Lowercasing all letters
train_resumes_lower = [resume.lower() for resume in train_resumes_str]
test_resumes_lower = [resume.lower() for resume in test_resumes_str]

# Punctuation removal
def remove_punctuation(text):
    return text.translate(str.maketrans('', '', string.punctuation))

train_punc_removed = [remove_punctuation(resume) for resume in train_resumes_lower]
test_punc_removed = [remove_punctuation(resume) for resume in test_resumes_lower]

# Stopwords removal
STOPWORDS = set(stopwords.words('english'))
def remove_stopwords(text):
    return " ".join([word for word in str(text).split() if word.lower() not in STOPWORDS])

train_stopwords_removed = [remove_stopwords(resume) for resume in train_punc_removed]
test_stopwords_removed = [remove_stopwords(resume) for resume in test_punc_removed]

# Lemmatization
lemmatizer = WordNetLemmatizer()
wordnet_map = {"N":wordnet.NOUN, "V":wordnet.VERB, "J":wordnet.ADJ, "R":wordnet.ADV}
def lemmatize_words(text):
    pos_tagged_text = nltk.pos_tag(text.split())
    return " ".join([lemmatizer.lemmatize(word, wordnet_map.get(pos[0], wordnet.NOUN)) for word, pos in pos_tagged_text])

train_lemma = [lemmatize_words(resume) for resume in train_stopwords_removed]
test_lemma = [lemmatize_words(resume) for resume in test_stopwords_removed]

# Printing results for verification
print(train_punc_removed[0])
print('===========')
print(test_punc_removed[0])
print('\n')
print('\n')
print(train_stopwords_removed[0])
print('===========')
print(test_stopwords_removed[0])
print('\n')
print('\n')
print(train_lemma[0])
print('===========')
print(test_lemma[0])
