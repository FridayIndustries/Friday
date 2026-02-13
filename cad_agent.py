# Thin shim to expose `CadAgent` at package root for tests and imports.
from backend.cad_agent import CadAgent

__all__ = ["CadAgent"]
