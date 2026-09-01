"""
custom_ui/api/access_control.py

Central permission gate for every custom_ui API endpoint.

Rather than inventing a separate access-control list, this wraps Frappe's
own role-based DocType permissions -- an admin configures per-role
Read / Write / Create / Delete (etc.) for each DocType the normal
ERPNext way, in Setup > Role Permissions Manager, and this module just
enforces that consistently across every endpoint. On top of that it adds
a "3 strikes" alert: after a user is blocked 3 times in a row (across
any doctype/action), every System Manager gets emailed and the counter
resets, so it can fire again later rather than going silent forever
after the first alert.
"""

import frappe
from frappe import _

# Maps our friendly action names (as used in crud.py / metadata.py) to
# Frappe's own permission-type strings (what frappe.has_permission and
# Role Permissions Manager both use).
_ACTION_TO_PTYPE = {
    "get_list": "read",
    "get": "read",
    "create": "create",
    "update": "write",
    "delete": "delete",
    "submit": "submit",
    "cancel": "cancel",
}

_BLOCK_THRESHOLD = 3
_CACHE_KEY_PREFIX = "custom_ui:blocked_attempts:"
_COUNTER_TTL_SECONDS = 24 * 60 * 60  # a stale streak from yesterday shouldn't count today


def _cache_key(user: str) -> str:
    return f"{_CACHE_KEY_PREFIX}{user}"


def _get_admin_emails() -> list:
    """Every enabled user with the System Manager role, so the alert
    isn't hardcoded to one address. Falls back to Administrator's email
    if that query comes back empty (e.g. a brand-new site with no other
    System Managers configured yet)."""
    role_holders = frappe.get_all(
        "Has Role",
        filters={"role": "System Manager", "parenttype": "User"},
        pluck="parent",
    )
    if role_holders:
        users = frappe.get_all(
            "User",
            filters={"name": ["in", role_holders], "enabled": 1},
            fields=["email"],
        )
        addresses = [u["email"] for u in users if u.get("email")]
        if addresses:
            return addresses

    fallback = frappe.db.get_value("User", "Administrator", "email")
    return [fallback] if fallback else []


def _send_admin_alert(user: str, doctype: str, action: str, count: int):
    recipients = _get_admin_emails()
    if not recipients:
        frappe.log_error(
            title="custom_ui access_control: no admin recipient found",
            message=f"Could not notify anyone about repeated blocked access by {user}.",
        )
        return
    try:
        frappe.sendmail(
            recipients=recipients,
            subject=f"[ERP Alert] Repeated unauthorized access attempts by {user}",
            message=(
                f"<p>The user <b>{frappe.utils.escape_html(user)}</b> has been blocked "
                f"<b>{count}</b> times in a row for actions they don't have permission for.</p>"
                f"<p>Most recent attempt: <b>{action}</b> on <b>{doctype}</b>.</p>"
                f"<p>This may indicate a misconfigured role, a confused user, or someone "
                f"probing for access they shouldn't have. Review this user's role "
                f"assignments under User &gt; Roles if this is unexpected.</p>"
            ),
            now=True,
        )
    except Exception:
        frappe.log_error(
            title="custom_ui access_control: failed to send admin alert",
            message=frappe.get_traceback(),
        )


def _record_blocked_attempt(user: str, doctype: str, action: str):
    """Increments this user's blocked-attempt counter. On the 3rd
    consecutive block, emails every System Manager and resets the
    counter to 0, so it can trigger again on a later streak instead of
    firing on every attempt after the 3rd, or never firing again."""
    key = _cache_key(user)
    try:
        count = frappe.cache().get_value(key) or 0
        count = int(count) + 1
        frappe.cache().set_value(key, count, expires_in_sec=_COUNTER_TTL_SECONDS)
    except Exception:
        # Redis/cache unavailable, etc. Fail open on the COUNTER only --
        # the permission denial itself (enforce_permission below) still
        # happens regardless -- but log it and trigger the alert path
        # defensively so a cache outage doesn't also silence the alert.
        frappe.log_error(
            title="custom_ui access_control: cache unavailable",
            message=frappe.get_traceback(),
        )
        count = _BLOCK_THRESHOLD

    frappe.log_error(
        title=f"custom_ui: blocked action ({count}/{_BLOCK_THRESHOLD})",
        message=(
            f"User: {user}\nDoctype: {doctype}\nAction: {action}\n"
            f"Consecutive blocked attempts: {count}"
        ),
    )

    if count >= _BLOCK_THRESHOLD:
        _send_admin_alert(user, doctype, action, count)
        try:
            frappe.cache().delete_value(key)
        except Exception:
            pass


def _clear_blocked_attempts(user: str):
    """Called after a successful, PERMITTED action, so a legitimate
    action in between denied ones doesn't quietly keep the streak alive
    toward an alert days apart."""
    try:
        frappe.cache().delete_value(_cache_key(user))
    except Exception:
        pass


def enforce_permission(doctype: str, action: str, user: str = None) -> None:
    """Call this before performing `action` on `doctype`.

    Raises frappe.PermissionError (-> HTTP 403) if the current session
    user's role(s) don't grant it, per Role Permissions Manager's config
    for this DocType -- and counts the denial toward the 3-strikes email
    alert. On a PERMITTED action, clears any existing streak.

    `user` defaults to frappe.session.user -- already resolved
    automatically from the request's session cookie/API key by the time
    a whitelisted method runs, so callers normally don't pass this.
    """
    user = user or frappe.session.user
    ptype = _ACTION_TO_PTYPE.get(action)
    if not ptype:
        frappe.throw(_("Unknown action: {0}").format(action), frappe.ValidationError)

    if user == "Administrator":
        # frappe.has_permission already always returns True for
        # Administrator; short-circuit skips the extra query.
        return

    if frappe.has_permission(doctype, ptype=ptype, user=user):
        _clear_blocked_attempts(user)
        return

    _record_blocked_attempt(user, doctype, action)
    frappe.throw(
        _("You do not have permission to {0} {1}.").format(action, doctype),
        frappe.PermissionError,
    )