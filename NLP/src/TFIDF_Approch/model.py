import os
import pandas as pd
from lightgbm import LGBMRegressor
import xgboost as XGB
from tfidf import tfidf_matrix_train, tfidf_matrix_test, train_df

# Dependent features
y = train_df['Match Percentage']

# XGBoost model
xgb = XGB.XGBRegressor(learning_rate=0.005, 
                        n_estimators=700, 
                        objective='reg:squarederror', 
                        max_depth=8, 
                        reg_lambda=1.3,
                        gamma=1,
                        min_child_weight=1.5,
                        max_delta_step=100,
                        random_state=31).fit(tfidf_matrix_train, y)

# LightGBM model
lgbm = LGBMRegressor(num_leaves=31,
                     learning_rate=0.01,
                     n_estimators=1000,
                     reg_lambda=2.5,
                     reg_alpha=2,
                     random_state=31).fit(tfidf_matrix_train, y)

# Prediction and submission file creation
def submission(model, test_sentences):
    test1 = pd.read_csv(r'D:\\folder\\nett\\Resume-Match-NLP\\dataset\\test.csv')
    preds = model.predict(test_sentences)
    prediction = pd.DataFrame(preds, columns=['Match Percentage'])
    sub_df = pd.concat([test1, prediction], axis=1)
    return sub_df

# Predicting with XGBoost model
sub_xgb = submission(xgb, tfidf_matrix_test)

# Define the directory path for saving the submission file
submission_directory = 'submission_file'

# Check if the directory exists, and if not, create it
if not os.path.exists(submission_directory):
    os.makedirs(submission_directory)

# Save the submission DataFrame to a CSV file in the created directory
sub_xgb.to_csv(os.path.join(submission_directory, 'xgb_sub.csv'), index=False)

print(sub_xgb.head())
