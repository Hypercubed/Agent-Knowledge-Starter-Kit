#!/usr/bin/env bash
# Shared logging helpers for the scripts/ validators.
# Sourced (not executed): `. "$SCRIPT_DIR/utils.sh"`.
# Idempotent: safe to source twice; the first load wins.
#
# Provides: failures/warnings counters plus section/fail/warn/pass.
# Callers keep their own `set -u` and domain logic.

if [ -z "${_AKSK_UTILS_LOADED:-}" ]; then
	_AKSK_UTILS_LOADED=1

	failures=0
	warnings=0

	section() {
		printf '\n== %s ==\n' "$1"
	}

	fail() {
		failures=$((failures + 1))
		printf 'FAIL: %s\n' "$1"
	}

	warn() {
		warnings=$((warnings + 1))
		printf 'WARN: %s\n' "$1"
	}

	pass() {
		printf 'PASS: %s\n' "$1"
	}
fi
