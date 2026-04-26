import os

files_to_delete = [
    "/home/jmh/workspace/projects/agent-knowledge-starter/example/.agents/skills/docs-compile/scripts/docs-compile.sh",
    "/home/jmh/workspace/projects/agent-knowledge-starter/.agents/skills/docs-compile/scripts/docs-compile.sh"
]

for file_path in files_to_delete:
    try:
        os.remove(file_path)
        print(f"Deleted: {file_path}")
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    except Exception as e:
        print(f"Error deleting {file_path}: {e}")
