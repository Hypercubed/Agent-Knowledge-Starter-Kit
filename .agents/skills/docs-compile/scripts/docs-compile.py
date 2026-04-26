#!/usr/bin/env python3
"""
Refresh derived docs artifacts (optional durable indexes + docs-search cache).
Run from anywhere inside the repository.
"""
import os
import sys
import subprocess

def find_agents_root():
    dir_path = os.path.abspath(os.getcwd())
    while dir_path != "/":
        candidate = os.path.join(dir_path, ".agents")
        if os.path.isdir(candidate):
            return candidate
        parent = os.path.dirname(dir_path)
        if parent == dir_path:
            break
        dir_path = parent
    return None

def main():
    agents_root_env = os.environ.get("AGENTS_ROOT")
    if agents_root_env:
        candidate = agents_root_env
        if os.path.basename(candidate) != ".agents":
            candidate = os.path.join(candidate, ".agents")
        
        if os.path.isdir(candidate):
            agents_root = os.path.abspath(candidate)
        else:
            print(f"ERROR: AGENTS_ROOT does not resolve to a .agents directory: {agents_root_env}", file=sys.stderr)
            sys.exit(1)
    else:
        agents_root = find_agents_root()
        if not agents_root:
            print("ERROR: docs-compile.py could not locate .agents. Set AGENTS_ROOT or run inside a repo tree.", file=sys.stderr)
            sys.exit(1)

    repo_root = os.path.dirname(agents_root)
    os.chdir(repo_root)

    script_path = os.path.join(".agents", "skills", "docs-compile", "scripts", "generate-durable-indexes.py")
    if os.path.isfile(script_path):
        try:
            subprocess.run([sys.executable, script_path], check=True)
        except subprocess.CalledProcessError as e:
            print(f"ERROR: failed to run {script_path}", file=sys.stderr)
            sys.exit(e.returncode)
    else:
        print("docs-compile: durable index generator not found, skipping.")

    print("docs-compile: done.")

if __name__ == "__main__":
    main()
