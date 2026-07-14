"use client";

import {
  CAR_COLORS,
  useExperienceStore,
} from "@/store/experienceStore";

export default function CarConfigurator() {
  const activeScene =
    useExperienceStore(
      (state) =>
        state.activeScene,
    );

  const selectedColor =
    useExperienceStore(
      (state) =>
        state.selectedColor,
    );

  const setSelectedColor =
    useExperienceStore(
      (state) =>
        state.setSelectedColor,
    );

  return (
    <aside
      className={`car-configurator ${
        activeScene === 2
          ? "car-configurator--visible"
          : ""
      }`}
      aria-label="Exterior colours"
    >
      <div className="car-configurator__heading">
        <span>
          Exterior
        </span>

        <strong>
          Select finish
        </strong>
      </div>

      <div className="car-configurator__colors">
        {CAR_COLORS.map(
          (colour) => {
            const active =
              selectedColor.toLowerCase() ===
              colour.hex.toLowerCase();

            return (
              <button
                key={colour.id}
                type="button"
                className={`car-color ${
                  active
                    ? "car-color--active"
                    : ""
                }`}
                aria-label={`Select ${colour.label}`}
                aria-pressed={
                  active
                }
                onClick={() =>
                  setSelectedColor(
                    colour.hex,
                  )
                }
              >
                <span
                  className="car-color__swatch"
                  style={{
                    backgroundColor:
                      colour.hex,
                  }}
                />

                <span className="car-color__label">
                  {colour.label}
                </span>
              </button>
            );
          },
        )}
      </div>
    </aside>
  );
}