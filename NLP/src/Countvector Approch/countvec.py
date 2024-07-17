# required libraries
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from processing import train_lemma, test_lemma
import os 

# Load datasets
test = pd.read_csv(r'D:\\folder\\\nett\\Resume-Match-NLP\\dataset\\test.csv')
train = pd.read_csv(r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\train.csv')


train_path = r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\trainResumes'
test_path = r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\testResumes'


# Preprocess and create final dataset
train_df = pd.concat([train, pd.DataFrame(train_lemma, columns=['resumes'])], axis=1)
test_df = pd.concat([test, pd.DataFrame(test_lemma, columns=['resumes'])], axis=1)

# Display head of datasets
print(train_df.head())
print(test_df.head())

# Apply CountVectorizer
countvec = CountVectorizer(analyzer='word', ngram_range=(1, 1), stop_words='english')
countvec_matrix_train = countvec.fit_transform(train_df['resumes'])
countvec_matrix_test = countvec.transform(test_df['resumes'])

# Display shape of CountVectorizer matrices
print(countvec_matrix_train.shape)
print(countvec_matrix_test.shape)
