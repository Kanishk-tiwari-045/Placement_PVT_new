import os
import pandas as pd
from pdfminer import high_level
import nltk
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

test = pd.read_csv(r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\test.csv')
train = pd.read_csv(r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\train.csv')

# Paths
train_path = r"D:\\folder\\nett\\Resume-Match-NLP\\dataset\\trainResumes"
test_path = r"D:\\folder\\nett\\Resume-Match-NLP\\dataset\\testResumes"

# Empty lists for resumes text
train_resumes = []
test_resumes = []

# Ids
ids = list(train.CandidateID)
test_ids = list(test.CandidateID)

# pdf2string
def pdf2string_train(path, ids, resumes):
    for i in ids:
        main_path = os.path.join(path, i + '.pdf')
        try:
            text = high_level.extract_text(main_path)
            resumes.append(text)
        except Exception as e:
            print(f"Error processing file {main_path}: {e}")

def pdf2string_test(path, test_ids, resumes):
    for i in test_ids:
        main_path = os.path.join(path, i + '.pdf')
        try:
            text = high_level.extract_text(main_path)
            resumes.append(text)
        except Exception as e:
            print(f"Error processing file {main_path}: {e}")

pdf2string_train(train_path, ids, train_resumes)
pdf2string_test(test_path,  test_ids, test_resumes)

print(train_resumes[0])
print('==================')
print(test_resumes[0])
