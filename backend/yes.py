import os

def combine_flask_project_code(source_directory, output_file):
    combined_content = ""

    # Define files and directories to ignore
    ignored_dirs = {"venv", "__pycache__", "static", "migrations"}
    ignored_files = {".env", "requirements.txt"}
    ignored_extensions = {".pyc", ".log", ".db"}

    # Walk through the directory recursively
    for root, dirs, files in os.walk(source_directory):
        # Exclude ignored directories
        dirs[:] = [d for d in dirs if d not in ignored_dirs]

        for file in files:
            file_path = os.path.join(root, file)

            # Skip ignored files and extensions
            if file in ignored_files or any(file.endswith(ext) for ext in ignored_extensions):
                continue

            # Process only relevant code files
            if file.endswith(('.py', '.html', '.js', '.css')):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        combined_content += f"\n\n# File: {file_path}\n\n"
                        combined_content += f.read()
                except Exception as e:
                    print(f"Could not read file: {file_path}. Error: {e}")

    # Write the combined content to the output file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(combined_content)
            print(f"Combined content written to: {output_file}")
    except Exception as e:
        print(f"Could not write to output file: {output_file}. Error: {e}")

# Specify the directory and output file
source_directory = "/Users/nicksng/Desktop/code/AUPP-eCampus/frontend/src/services"
output_file = "/Users/nicksng/Desktop/code/AUPP-eCampus/combined_flask_code.txt"

combine_flask_project_code(source_directory, output_file)
