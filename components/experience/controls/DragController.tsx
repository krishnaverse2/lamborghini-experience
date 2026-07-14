"use client";

import { useExperienceStore } from "@/store/experienceStore";
import {
  PointerEvent,
  useRef,
} from "react";

interface DragControllerProps {
  children: React.ReactNode;
}

export default function DragController({
  children,
}: DragControllerProps) {
  const activePointerId = useRef<
    number | null
  >(null);

  const previousX = useRef(0);
  const previousTime = useRef(0);

  const startDragging = useExperienceStore(
    (state) => state.startDragging,
  );

  const stopDragging = useExperienceStore(
    (state) => state.stopDragging,
  );

  const addDragRotation = useExperienceStore(
    (state) => state.addDragRotation,
  );

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) {
      return;
    }

    activePointerId.current =
      event.pointerId;

    previousX.current = event.clientX;
    previousTime.current =
      performance.now();

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    startDragging();

    document.body.classList.add(
      "car-is-dragging",
    );
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      activePointerId.current !==
      event.pointerId
    ) {
      return;
    }

    const currentTime =
      performance.now();

    const deltaX =
      event.clientX - previousX.current;

    const elapsedSeconds = Math.max(
      (currentTime -
        previousTime.current) /
        1000,
      0.001,
    );

    const rotationDelta =
      deltaX * 0.009;

    const rotationVelocity =
      rotationDelta / elapsedSeconds;

    addDragRotation(
      rotationDelta,
      Math.min(
        Math.max(rotationVelocity, -8),
        8,
      ),
    );

    previousX.current = event.clientX;
    previousTime.current = currentTime;
  };

  const endDrag = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      activePointerId.current !==
      event.pointerId
    ) {
      return;
    }

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    activePointerId.current = null;

    stopDragging();

    document.body.classList.remove(
      "car-is-dragging",
    );
  };

  return (
    <div
      className="drag-controller"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {children}
    </div>
  );
}