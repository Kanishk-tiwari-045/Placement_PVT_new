# required libraries
import pandas as pd
from pdfminer import high_level
import os
# Load datasets

# Load datasets
test = pd.read_csv(r'D:\\folder\\\nett\\Resume-Match-NLP\\dataset\\test.csv')
train = pd.read_csv(r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\train.csv')


train_path = r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\trainResumes'
test_path = r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\testResumes'

# Empty lists for resumes text
train_resumes = []
test_resumes = []

# Ids
ids = list(train.CandidateID)
test_ids = list(test.CandidateID)
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

# Extract text from PDFs for training and testing data
pdf2string_train(train_path, ids, train_resumes)
pdf2string_test(test_path, test_ids, test_resumes)

# Display example of training and testing resumes
print(train_resumes[0])
print('==================')
print(test_resumes[0])
