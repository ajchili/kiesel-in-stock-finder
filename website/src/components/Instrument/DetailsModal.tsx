import { useRef } from "react";
import type { Instrument as InstrumentType } from "../../types.js";

interface InstrumentDetailsModalProps {
  instrument: InstrumentType;
}

export const InstrumentDetailsModal = ({
  instrument,
}: InstrumentDetailsModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="btn btn-outline"
        onClick={() => ref.current?.showModal()}
      >
        Details
      </button>
      <dialog ref={ref} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">{instrument.title}</h3>
          {Object.entries(instrument).map(([key, value]) => {
            return (
              <p className="py-4" key={key}>
                <strong>{key}:</strong> {JSON.stringify(value)}
              </p>
            );
          })}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
