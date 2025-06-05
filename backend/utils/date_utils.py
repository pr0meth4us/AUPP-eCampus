# utils/date_utils.py
from datetime import datetime, timezone
from typing import Any, Optional

def ensure_datetime(value: Any) -> Optional[datetime]:
    """Convert various date formats to datetime object or None"""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        try:
            # Handle ISO format strings
            return datetime.fromisoformat(value.replace('Z', '+00:00'))
        except (ValueError, AttributeError):
            return None
    # Handle MongoDB date objects
    if hasattr(value, 'replace') and hasattr(value, 'year'):
        return value
    return None

def to_iso_string(dt: Any) -> Optional[str]:
    """Convert datetime to ISO string or None"""
    dt = ensure_datetime(dt)
    return dt.isoformat() if dt else None

def utc_now() -> datetime:
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)