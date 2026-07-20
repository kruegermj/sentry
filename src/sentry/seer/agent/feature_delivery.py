from __future__ import annotations

from typing import Any, Protocol

from sentry.seer.agent.types import FeatureRunStatus
from sentry.seer.autofix_rca.delivery import deliver_autofix_rca_result
from sentry.seer.night_shift.delivery import deliver_night_shift_result

__all__ = ["DELIVERY_HANDLERS", "FeatureDeliveryFn", "FeatureRunStatus"]


class FeatureDeliveryFn(Protocol):
    def __call__(
        self,
        organization_id: int,
        run_uuid: str,
        status: FeatureRunStatus,
        result: dict[str, Any] | None,
        error: str | None,
    ) -> None: ...


DELIVERY_HANDLERS: dict[str, FeatureDeliveryFn] = {
    "night_shift": deliver_night_shift_result,
    "autofix_rca": deliver_autofix_rca_result,
}
