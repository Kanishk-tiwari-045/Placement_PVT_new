import pandas as pd
import os
from model import xgb, test_df

def submission(model, test_sentences):
    test1 = pd.read_csv(r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\test.csv')
    preds = model.predict(test_sentences)
    prediction = pd.DataFrame(preds, columns=['Match Percentage'])
    sub_df = pd.concat([test1, prediction], axis=1)
    return sub_df

# Generate submission DataFrame
sub = submission(xgb, test_df)

# Specify the directory where you want to save the CSV file
submission_directory = 'submission_files'
if not os.path.exists(submission_directory):
    os.makedirs(submission_directory)

# Save the DataFrame as CSV in the specified directory
csv_file_path = os.path.join(submission_directory, 'Manual_feature_submission.csv')
sub.to_csv(csv_file_path, index=False)  # Set index=False to avoid saving row indices

# Print the first few rows of the DataFrame (assuming sub is already defined)
print(sub.head())
