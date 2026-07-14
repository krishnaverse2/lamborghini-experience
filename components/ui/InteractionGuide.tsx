"use client";

import { useExperienceStore } from "@/store/experienceStore";

export default function InteractionGuide() {
  const dragUsed =
    useExperienceStore(
      (state) => state.dragUsed,
    );

  return (
    <div
      className={`interaction-guide ${
        dragUsed
          ? "interaction-guide--used"
          : ""
      }`}
    >
      <span className="interaction-guide__mouse">
        <i />
      </span>

      <p>
        Click, hold and drag
        <strong>
          Spin 360°
        </strong>
      </p>
    </div>
  );
}