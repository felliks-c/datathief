"use client";
import Burden from "./burden";
import { useState } from "react";

export default function LoadBurdenButton() {
    const [show, setShow] = useState(false);

    return (
        <div className="mt-8 flex flex-col items-center">
        <button
            onClick={() => setShow(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
            нажми меня
        </button>
        {show && (
            <div className="mt-4">
            <Burden />
            </div>
        )}
        </div>
    );
}