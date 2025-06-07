from datetime import datetime, timezone
from typing import Any, Optional



def to_iso_string(dt: Any) -> Optional[str]:
    """Convert datetime to ISO string or None"""
    dt = ensure_datetime(dt)
    return dt.isoformat() if dt else None

def utc_now() -> datetime:
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)

def ensure_datetime(value) -> datetime:
    """
    Convert an ISO string or naive/aware datetime into a UTC‐aware datetime.
    - If value is None, return None.
    - If value is already a datetime:
        - If tzinfo is None (naive), assume UTC and attach tzinfo.
        - If tzinfo is present, convert to UTC.
    - If value is a string:
        - Replace trailing 'Z' with '+00:00' if present.
        - Use datetime.fromisoformat() to parse.
        - If resulting dt has no tzinfo, assume UTC; otherwise convert to UTC.
    - On parse failure, return None.
    """
    if value is None:
        return None

    if isinstance(value, datetime):
        # If naive, assume UTC
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        # Already aware: convert to UTC
        return value.astimezone(timezone.utc)

    if isinstance(value, str):
        try:
            # Handle trailing 'Z' (ISO8601 for UTC)
            if value.endswith('Z'):
                value = value[:-1] + "+00:00"
            dt = datetime.fromisoformat(value)
            # If parsed dt is naive, assume UTC
            if dt.tzinfo is None:
                return dt.replace(tzinfo=timezone.utc)
            # If aware, convert to UTC
            return dt.astimezone(timezone.utc)
        except Exception:
            return None

    return None
