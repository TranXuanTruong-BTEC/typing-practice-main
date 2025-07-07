"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];
const DEFAULT_CATEGORIES = ["Tin tức", "Truyện ngắn", "Khoa học", "Giải trí"];
const DEFAULT_LANGUAGES = [
  "vi", "en", "fr", "ja", "zh", "es", "de", "ru", "it", "ko", "pt", "ar", "tr", "th", "id", "ms", "hi", "bn", "ur", "fa", "pl", "uk", "nl", "sv", "no", "da", "fi", "cs", "el", "he", "ro", "hu", "sk", "bg", "sr", "hr", "lt", "lv", "et", "sl", "mt", "ga", "is", "sq", "mk", "eu", "ca", "gl", "af", "sw", "zu", "xh", "st", "tn", "ts", "ss", "ve", "nr"
];
const LANGUAGE_LABELS: Record<string, string> = {
  vi: "Tiếng Việt", en: "English", fr: "French", ja: "Japanese", zh: "Chinese", es: "Spanish", de: "German", ru: "Russian", it: "Italian", ko: "Korean", pt: "Portuguese", ar: "Arabic", tr: "Turkish", th: "Thai", id: "Indonesian", ms: "Malay", hi: "Hindi", bn: "Bengali", ur: "Urdu", fa: "Persian", pl: "Polish", uk: "Ukrainian", nl: "Dutch", sv: "Swedish", no: "Norwegian", da: "Danish", fi: "Finnish", cs: "Czech", el: "Greek", he: "Hebrew", ro: "Romanian", hu: "Hungarian", sk: "Slovak", bg: "Bulgarian", sr: "Serbian", hr: "Croatian", lt: "Lithuanian", lv: "Latvian", et: "Estonian", sl: "Slovenian", mt: "Maltese", ga: "Irish", is: "Icelandic", sq: "Albanian", mk: "Macedonian", eu: "Basque", ca: "Catalan", gl: "Galician", af: "Afrikaans", sw: "Swahili", zu: "Zulu", xh: "Xhosa", st: "Southern Sotho", tn: "Tswana", ts: "Tsonga", ss: "Swati", ve: "Venda", nr: "South Ndebele",
};

export default function AddTextPage() {
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newDifficulty, setNewDifficulty] = useState(DIFFICULTY_OPTIONS[0]);
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const handleAddText = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/add-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          text: newText,
          category: newCategory,
          language: newLanguage,
          difficulty: newDifficulty,
        }),
      });
      if (!res.ok) throw new Error("Lỗi khi thêm bài tập");
      setNewTitle("");
      setNewText("");
      setNewCategory("");
      setNewLanguage("");
      setNewDifficulty(DIFFICULTY_OPTIONS[0]);
      toast.success("Đã thêm bài tập mới!");
      setTimeout(() => router.push("/admin/texts"), 800);
    } catch (err: any) {
      toast.error(err.message || "Lỗi không xác định");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-2 md:px-0 font-sans">
      <div className="flex items-center gap-4 mb-8 mt-8">
        <Link href="/admin/texts">
          <Button variant="outline" className="flex items-center gap-2">
            ← Quay lại danh sách
          </Button>
        </Link>
        <h2 className="font-bold text-2xl">Thêm bài tập mới</h2>
      </div>
      <form onSubmit={handleAddText} className="bg-white rounded-lg p-6 flex flex-col gap-5 border border-gray-200 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Tiêu đề <span className="text-red-500">*</span></label>
          <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="Nhập tiêu đề bài tập" className="text-base py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nội dung <span className="text-red-500">*</span></label>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            required
            placeholder="Nhập nội dung bài tập"
            className="border rounded px-3 py-2 w-full min-h-[80px] resize-vertical text-base"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Thể loại <span className="text-red-500">*</span></label>
            <select
              className="border rounded px-2 py-2 w-full text-base"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              required
            >
              <option value="">Chọn thể loại</option>
              {DEFAULT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Ngôn ngữ <span className="text-red-500">*</span></label>
            <select
              className="border rounded px-2 py-2 w-full text-base"
              value={newLanguage}
              onChange={e => setNewLanguage(e.target.value)}
              required
            >
              <option value="">Chọn ngôn ngữ</option>
              {DEFAULT_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang} - {LANGUAGE_LABELS[lang] || "Unknown"}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Độ khó <span className="text-red-500">*</span></label>
            <select
              className="border rounded px-2 py-2 w-full text-base"
              value={newDifficulty}
              onChange={e => setNewDifficulty(e.target.value)}
              required
            >
              {DIFFICULTY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4 items-center mt-2">
          <Button type="submit" disabled={adding} className="min-w-[120px] text-base h-10">
            {adding ? "Đang thêm..." : "Thêm bài tập"}
          </Button>
        </div>
      </form>
    </div>
  );
} 