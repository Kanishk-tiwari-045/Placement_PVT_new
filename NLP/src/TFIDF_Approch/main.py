import subprocess

# Define the list of files to run in sequence
files_to_run = ['extract_text.py', 'processing.py', 'model.py', 'tfidf.py']

# Iterate over the list and run each file using subprocess
for file in files_to_run:
    print(f"Running {file}...")
    try:
        subprocess.run(['python', file], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running {file}: {e}")
    print(f"{file} completed.\n")

print("All files executed successfully.")