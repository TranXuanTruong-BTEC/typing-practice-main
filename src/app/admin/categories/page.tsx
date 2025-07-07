"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DEFAULT_CATEGORIES = ["Tin tức", "Truyện ngắn", "Khoa học", "Giải trí"];

const CategoriesAdminPage = () => {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([newCategory, ...categories]);
      setNewCategory("");
    }
  };

  const handleDelete = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-6">Quản lý thể loại</h2>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Thêm thể loại mới"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleAdd}>Thêm</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên thể loại</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(cat => (
            <TableRow key={cat}>
              <TableCell>{cat}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(cat)}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesAdminPage; 