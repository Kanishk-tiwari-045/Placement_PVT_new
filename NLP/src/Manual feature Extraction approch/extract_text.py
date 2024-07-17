import pandas as pd
from pdfminer import high_level
import os

# Read data
test = pd.read_csv(r'D:\folder\nett\Resume-Match-NLP\dataset\test.csv')
train = pd.read_csv(r'D:\folder\nett\Resume-Match-NLP\dataset\train.csv')

# Define file paths
train_path = r"D:\folder\nett\Resume-Match-NLP\dataset\trainResumes\\"
test_path = r"D:\folder\nett\Resume-Match-NLP\dataset\testResumes\\"

# Empty lists for resumes text
train_resumes = []
test_resumes = []

# Function to extract text from PDF for training data
def pdf2string_train(path, ids, resumes):
    for i in ids:
        main_path = os.path.join(path, i+'.pdf')
        if os.path.exists(main_path):
            text = high_level.extract_text(main_path)
            str_list = text.split()
            string = ' '.join(str_list)
            resumes.append(string)
        else:
            print(f"File '{main_path}' does not exist.")

# Function to extract text from PDF for testing data
def pdf2string_test(path, test_ids, resumes):
    for i in test_ids:
        main_path = os.path.join(path, i+'.pdf')
        if os.path.exists(main_path):
            text = high_level.extract_text(main_path)
            str_list = text.split()
            string = ' '.join(str_list)
            resumes.append(string)
        else:
            print(f"File '{main_path}' does not exist.")

# Extract text from PDF for training data
pdf2string_train(train_path, train['CandidateID'], train_resumes)

# Extract text from PDF for testing data
pdf2string_test(test_path, test['CandidateID'], test_resumes)

print(train_resumes[0])
print('==================')
print(test_resumes[0])
