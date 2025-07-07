"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TypingText {
  _id: string;
  title: string;
  text: string;
  category?: string;
  language?: string;
  difficulty?: string;
}

const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];
const DEFAULT_CATEGORIES = ["Tin tức", "Truyện ngắn", "Khoa học", "Giải trí"];
const DEFAULT_LANGUAGES = [
  "vi", "en", "fr", "ja", "zh", "es", "de", "ru", "it", "ko", "pt", "ar", "tr", "th", "id", "ms", "hi", "bn", "ur", "fa", "pl", "uk", "nl", "sv", "no", "da", "fi", "cs", "el", "he", "ro", "hu", "sk", "bg", "sr", "hr", "lt", "lv", "et", "sl", "mt", "ga", "is", "sq", "mk", "eu", "ca", "gl", "af", "sw", "zu", "xh", "st", "tn", "ts", "ss", "ve", "nr"
];

const LANGUAGE_LABELS: Record<string, string> = {
  vi: "Tiếng Việt",
  en: "English",
  fr: "French",
  ja: "Japanese",
  zh: "Chinese",
  es: "Spanish",
  de: "German",
  ru: "Russian",
  it: "Italian",
  ko: "Korean",
  pt: "Portuguese",
  ar: "Arabic",
  tr: "Turkish",
  th: "Thai",
  id: "Indonesian",
  ms: "Malay",
  hi: "Hindi",
  bn: "Bengali",
  ur: "Urdu",
  fa: "Persian",
  pl: "Polish",
  uk: "Ukrainian",
  nl: "Dutch",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  cs: "Czech",
  el: "Greek",
  he: "Hebrew",
  ro: "Romanian",
  hu: "Hungarian",
  sk: "Slovak",
  bg: "Bulgarian",
  sr: "Serbian",
  hr: "Croatian",
  lt: "Lithuanian",
  lv: "Latvian",
  et: "Estonian",
  sl: "Slovenian",
  mt: "Maltese",
  ga: "Irish",
  is: "Icelandic",
  sq: "Albanian",
  mk: "Macedonian",
  eu: "Basque",
  ca: "Catalan",
  gl: "Galician",
  af: "Afrikaans",
  sw: "Swahili",
  zu: "Zulu",
  xh: "Xhosa",
  st: "Southern Sotho",
  tn: "Tswana",
  ts: "Tsonga",
  ss: "Swati",
  ve: "Venda",
  nr: "South Ndebele",
};

const TextsAdminPage = () => {
  const [texts, setTexts] = useState<TypingText[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("");

  // State cho form thêm bài tập
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newDifficulty, setNewDifficulty] = useState(DIFFICULTY_OPTIONS[0]);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const [editRow, setEditRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/texts");
      if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu");
      const data = await res.json();
      setTexts(Array.isArray(data) ? data : data.texts || []);
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách thể loại/ngôn ngữ từ danh mục chuẩn (có thể mở rộng lấy từ API sau)
  const categories = DEFAULT_CATEGORIES;
  const languages = DEFAULT_LANGUAGES;

  // Lọc dữ liệu theo thể loại và ngôn ngữ
  const filteredTexts = texts.filter(text => {
    const matchCategory = categoryFilter ? text.category === categoryFilter : true;
    const matchLanguage = languageFilter ? text.language === languageFilter : true;
    return matchCategory && matchLanguage;
  });

  // Xử lý submit form thêm bài tập
  const handleAddText = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
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
      setAddSuccess("Thêm bài tập thành công!");
      toast.success("Đã thêm bài tập mới!");
      await fetchTexts();
    } catch (err: any) {
      setAddError(err.message || "Lỗi không xác định");
      toast.error(err.message || "Lỗi không xác định");
    } finally {
      setAdding(false);
    }
  };

  // Hàm mở modal edit
  const handleEdit = (row: TypingText) => {
    setEditRow(row._id);
    setEditData({ ...row });
    setModalOpen(true);
  };

  // Hàm lưu edit
  const handleSaveEdit = async () => {
    try {
      const res = await fetch("/api/update-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Lỗi khi cập nhật bài tập");
      toast.success("Đã cập nhật bài tập!");
      setModalOpen(false);
      setEditRow(null);
      await fetchTexts();
    } catch (err: any) {
      toast.error(err.message || "Lỗi không xác định");
    }
  };

  // Hàm xóa
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài tập này?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/delete-text", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Lỗi khi xóa bài tập");
      toast.success("Đã xóa bài tập!");
      await fetchTexts();
    } catch (err: any) {
      toast.error(err.message || "Lỗi không xác định");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-0 font-sans">
      <div className="flex justify-between items-center mb-6 mt-6">
        <h2 className="font-bold text-2xl">Quản lý bài tập luyện gõ</h2>
        <Link href="/admin/texts/add">
          <Button className="bg-blue-600 text-white font-semibold px-5 py-2 text-base shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Thêm bài tập mới
          </Button>
        </Link>
      </div>
      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-start">
        <div>
          <label className="block text-xs font-medium mb-1">Thể loại</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Ngôn ngữ</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={languageFilter}
            onChange={e => setLanguageFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang} - {LANGUAGE_LABELS[lang] || "Unknown"}</option>
            ))}
          </select>
        </div>
      </div>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto p-0 border border-gray-200 mt-2">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 text-left font-semibold">Tiêu đề</th>
              <th className="py-3 px-4 text-left font-semibold">Nội dung</th>
              <th className="py-3 px-4 text-left font-semibold">Thể loại</th>
              <th className="py-3 px-4 text-left font-semibold">Ngôn ngữ</th>
              <th className="py-3 px-4 text-left font-semibold">Độ khó</th>
              <th className="py-3 px-4 text-left font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredTexts.map((text) => (
              <tr key={text._id} className="border-b last:border-b-0 hover:bg-blue-50/40 transition-colors">
                <td className="py-2 px-4 font-medium text-gray-900 align-top max-w-[180px] truncate" title={text.title}>{text.title}</td>
                <td className="py-2 px-4 text-gray-700 align-top max-w-[220px] truncate" title={text.text}>{text.text}</td>
                <td className="py-2 px-4 text-gray-700 align-top">{text.category || '-'}</td>
                <td className="py-2 px-4 text-gray-700 align-top">{text.language ? `${text.language} - ${LANGUAGE_LABELS[text.language] || "Unknown"}` : '-'}</td>
                <td className="py-2 px-4 text-gray-700 align-top">{text.difficulty || '-'}</td>
                <td className="py-2 px-4 text-gray-700 align-top flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(text)}>Sửa</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(text._id)} disabled={deletingId === text._id}>{deletingId === text._id ? "Đang xóa..." : "Xóa"}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Chỉnh sửa bài tập</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                <Input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nội dung</label>
                <textarea className="border rounded px-2 py-1 w-full min-h-[60px]" value={editData.text} onChange={e => setEditData({ ...editData, text: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thể loại</label>
                <select className="border rounded px-2 py-1 w-full" value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })}>
                  <option value="">Chọn thể loại</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngôn ngữ</label>
                <select className="border rounded px-2 py-1 w-full" value={editData.language} onChange={e => setEditData({ ...editData, language: e.target.value })}>
                  <option value="">Chọn ngôn ngữ</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang} - {LANGUAGE_LABELS[lang] || "Unknown"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Độ khó</label>
                <select className="border rounded px-2 py-1 w-full" value={editData.difficulty} onChange={e => setEditData({ ...editData, difficulty: e.target.value })}>
                  {DIFFICULTY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button onClick={handleSaveEdit}>Lưu</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextsAdminPage; 