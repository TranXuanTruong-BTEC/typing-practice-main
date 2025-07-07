"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DEFAULT_LANGUAGES = [
  "vi", "en", "fr", "ja", "zh", "es", "de", "ru", "it", "ko", "pt", "ar", "tr", "th", "id", "ms", "hi", "bn", "ur", "fa", "pl", "uk", "nl", "sv", "no", "da", "fi", "cs", "el", "he", "ro", "hu", "sk", "bg", "sr", "hr", "lt", "lv", "et", "sl", "mt", "ga", "is", "sq", "mk", "eu", "ca", "gl", "af", "sw", "zu", "xh", "st", "tn", "ts", "ss", "ve", "nr"
];

const LanguagesAdminPage = () => {
  const [languages, setLanguages] = useState<string[]>(DEFAULT_LANGUAGES);
  const [newLanguage, setNewLanguage] = useState("");

  const handleAdd = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([newLanguage, ...languages]);
      setNewLanguage("");
    }
  };

  const handleDelete = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-6">Quản lý ngôn ngữ</h2>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Thêm ngôn ngữ mới (mã: vi, en, ...)"
          value={newLanguage}
          onChange={e => setNewLanguage(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleAdd}>Thêm</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã ngôn ngữ</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {languages.map(lang => (
            <TableRow key={lang}>
              <TableCell>{lang}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(lang)}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LanguagesAdminPage; 