# Thin shim to expose `WebAgent` at package root for tests and imports.
from backend.web_agent import WebAgent

__all__ = ["WebAgent"]
