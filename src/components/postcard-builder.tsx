"use client";
import React, { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { toPng } from "html-to-image";

const allowedTags = [
  "div",
  "span",
  "p",
  "img",
  "a",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];
const allowedAttrs = ["href", "src", "alt", "title", "style", "class", "id"];

function PostcardBuilder() {
  const [htmlContent, setHtmlContent] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlContent(e.target.value);
  };

  const handleExport = () => {
    const previewArea = document.getElementById("previewArea");

    if (previewArea) {
      toPng(previewArea)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "postcard.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error("Exporting image failed", err);
        });
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <textarea
        id="htmlInput"
        placeholder="Enter your HTML template here"
        value={htmlContent}
        onChange={handleChange}
        rows={10}
        cols={50}
        className="w-full max-w-lg p-2 mb-4 border rounded"
      />
      <button
        onClick={handleExport}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Export as Image
      </button>
      <div
        id="previewArea"
        className="relative w-[576px] h-[384px] p-3 bg-white shadow-lg border"
      >
        <div className="absolute top-[12px] left-0 right-0 h-0 border-t border-dashed border-red-500"></div>
        <div className="absolute bottom-[12px] left-0 right-0 h-0 border-t border-dashed border-red-500"></div>
        <div className="absolute top-0 bottom-0 left-[12px] w-0 border-l border-dashed border-red-500"></div>
        <div className="absolute top-0 bottom-0 right-[12px] w-0 border-l border-dashed border-red-500"></div>
        {htmlContent.length > 0 && (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(htmlContent, {
                ALLOWED_TAGS: allowedTags,
                ALLOWED_ATTR: allowedAttrs,
              }),
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default PostcardBuilder;
