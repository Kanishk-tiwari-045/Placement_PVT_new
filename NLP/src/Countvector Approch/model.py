# required libraries
import os
import pandas as pd
from lightgbm import LGBMRegressor
import xgboost as XGB
from countvec import countvec_matrix_train, countvec_matrix_test, train_df

# Dependent features
y = train_df['Match Percentage']

# XGBoost model
xgb = XGB.XGBRegressor(learning_rate=0.3, n_estimators=200, max_depth=7, max_delta_step=50, random_state=31).fit(countvec_matrix_train, y)

# Convert to float for LightGBM
countvec_matrix_train = countvec_matrix_train.astype('float32')
countvec_matrix_test = countvec_matrix_test.astype('float32')

# LightGBM model (Best Model)
lgbm = LGBMRegressor(num_leaves=31, learning_rate=0.2, n_estimators=200, reg_alpha=1, random_state=31).fit(countvec_matrix_train, y)

# Prediction and submission file creation
def submission(model, test_sentences):
    test1 = pd.read_csv(r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\test.csv')
    preds = model.predict(test_sentences)
    prediction = pd.DataFrame(preds, columns=['Match Percentage'])
    sub_df = pd.concat([test1, prediction], axis=1)
    return sub_df

# Predicting with LightGBM model
sub = submission(lgbm, countvec_matrix_test)

# Define the directory path for saving the submission file
submission_directory = 'submission_file'

# Check if the directory exists, and if not, create it
if not os.path.exists(submission_directory):
    os.makedirs(submission_directory)

# Save the submission DataFrame to a CSV file in the created directory
sub.to_csv(os.path.join(submission_directory, 'lgbm_countvec_best.csv'), index=False)

# Display head of submission DataFrame
print(sub.head())
