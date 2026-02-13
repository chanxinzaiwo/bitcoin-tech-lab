import React, { useState, useEffect } from 'react';
import {
    StickyNote, Plus, Trash2, Edit3, Save, X, Search,
    Tag, Calendar, Download, Upload, ChevronDown, ChevronRight,
    BookOpen, Copy, Check, Folder, FileText
} from 'lucide-react';
import { useLab } from '../store/LabContext';

// Types
interface Note {
    id: string;
    moduleId: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
}

interface NotesData {
    notes: Note[];
    lastExport: number | null;
}

// Module names mapping
const moduleNames: Record<string, string> = {
    'home': '首页',
    'ecc': 'ECC 密码学',
    'address': '地址生成',
    'hdwallet': 'HD 钱包',
    'utxo': 'UTXO 模型',
    'script': '比特币脚本',
    'mempool': '内存池',
    'p2p': 'P2P 网络',
    'pow': 'PoW 挖矿',
    'mining': '挖矿经济学',
    'consensus': '共识机制',
    'fork': '软硬分叉',
    'segwit': '隔离见证',
    'taproot': 'Taproot',
    'schnorr': 'Schnorr 签名',
    'lightning': '闪电网络',
    'attack51': '51% 攻击',
    'spv': 'SPV 轻节点',
    'fullnode': '全节点',
    'cold': '冷钱包',
    'privacy': '隐私技术',
    'history': '比特币历史',
    'quantum': '量子计算',
    'lamport': 'Lamport 签名',
    'rbf': 'RBF',
    'general': '通用笔记',
};

const NOTES_STORAGE_KEY = 'bitcoin-tech-lab-notes';

// Storage functions
const loadNotes = (): NotesData => {
    try {
        const saved = localStorage.getItem(NOTES_STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load notes:', e);
    }
    return { notes: [], lastExport: null };
};

const saveNotes = (data: NotesData): void => {
    try {
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save notes:', e);
    }
};

// Main Component
interface NotesProps {
    onClose: () => void;
    currentModule?: string;
}

const Notes: React.FC<NotesProps> = ({ onClose, currentModule = 'general' }) => {
    const { isDarkMode } = useLab();
    const [notesData, setNotesData] = useState<NotesData>(loadNotes());
    const [activeTab, setActiveTab] = useState<'all' | 'module' | 'search'>('module');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedModule, setSelectedModule] = useState<string>(currentModule);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([currentModule]));

    // Save to localStorage when notes change
    useEffect(() => {
        saveNotes(notesData);
    }, [notesData]);

    // New note template
    const createNewNote = (): Note => ({
        id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        moduleId: selectedModule,
        title: '',
        content: '',
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });

    // CRUD operations
    const addNote = (note: Note) => {
        setNotesData(prev => ({
            ...prev,
            notes: [note, ...prev.notes]
        }));
        setIsCreating(false);
        setEditingNote(null);
    };

    const updateNote = (note: Note) => {
        setNotesData(prev => ({
            ...prev,
            notes: prev.notes.map(n => n.id === note.id ? { ...note, updatedAt: Date.now() } : n)
        }));
        setEditingNote(null);
    };

    const deleteNote = (id: string) => {
        if (confirm('确定要删除这条笔记吗？')) {
            setNotesData(prev => ({
                ...prev,
                notes: prev.notes.filter(n => n.id !== id)
            }));
        }
    };

    // Filter notes
    const filteredNotes = notesData.notes.filter(note => {
        if (activeTab === 'module') {
            return note.moduleId === selectedModule;
        }
        if (activeTab === 'search' && searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query) ||
                note.tags.some(t => t.toLowerCase().includes(query))
            );
        }
        return true;
    });

    // Group notes by module for "all" view
    const notesByModule = notesData.notes.reduce((acc, note) => {
        if (!acc[note.moduleId]) {
            acc[note.moduleId] = [];
        }
        acc[note.moduleId].push(note);
        return acc;
    }, {} as Record<string, Note[]>);

    // Export notes
    const exportNotes = () => {
        const dataStr = JSON.stringify(notesData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bitcoin-notes-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setNotesData(prev => ({ ...prev, lastExport: Date.now() }));
    };

    // Import notes
    const importNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string) as NotesData;
                if (imported.notes && Array.isArray(imported.notes)) {
                    const mergedNotes = [...notesData.notes];
                    imported.notes.forEach(note => {
                        if (!mergedNotes.some(n => n.id === note.id)) {
                            mergedNotes.push(note);
                        }
                    });
                    setNotesData({ notes: mergedNotes, lastExport: notesData.lastExport });
                    alert(`成功导入 ${imported.notes.length} 条笔记`);
                }
            } catch (err) {
                alert('导入失败：文件格式错误');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    // Copy note content
    const copyContent = (note: Note) => {
        navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
        setCopiedId(note.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleModuleExpand = (moduleId: string) => {
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(moduleId)) {
                next.delete(moduleId);
            } else {
                next.add(moduleId);
            }
            return next;
        });
    };

    return (
        <div className={`min-h-[500px] flex flex-col ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-white text-slate-800'}`}>
            {/* Header */}
            <div className={`p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <StickyNote className="w-6 h-6 text-orange-500" />
                        学习笔记
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={exportNotes}
                            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                            title="导出笔记"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <label className={`p-2 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`} title="导入笔记">
                            <Upload className="w-4 h-4" />
                            <input type="file" accept=".json" onChange={importNotes} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {[
                        { id: 'module', label: '当前模块', icon: BookOpen },
                        { id: 'all', label: '全部笔记', icon: Folder },
                        { id: 'search', label: '搜索', icon: Search },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-orange-500 text-white'
                                        : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Search Input */}
                {activeTab === 'search' && (
                    <div className={`mb-4 relative`}>
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                            type="text"
                            placeholder="搜索笔记标题、内容或标签..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                        />
                    </div>
                )}

                {/* Module Selector */}
                {activeTab === 'module' && (
                    <div className="mb-4">
                        <select
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                        >
                            {Object.entries(moduleNames).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* New Note Button */}
                {(activeTab === 'module' || activeTab === 'all') && !isCreating && (
                    <button
                        onClick={() => { setIsCreating(true); setEditingNote(createNewNote()); }}
                        className={`w-full mb-4 p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 font-medium transition-colors ${
                            isDarkMode
                                ? 'border-slate-700 text-slate-400 hover:border-orange-500/50 hover:text-orange-400'
                                : 'border-slate-300 text-slate-500 hover:border-orange-500/50 hover:text-orange-600'
                        }`}
                    >
                        <Plus className="w-5 h-5" />
                        添加笔记
                    </button>
                )}

                {/* Note Editor */}
                {(isCreating || editingNote) && (
                    <NoteEditor
                        note={editingNote || createNewNote()}
                        isDarkMode={isDarkMode}
                        onSave={isCreating ? addNote : updateNote}
                        onCancel={() => { setIsCreating(false); setEditingNote(null); }}
                        moduleNames={moduleNames}
                    />
                )}

                {/* Notes List - Module View */}
                {activeTab === 'module' && !isCreating && !editingNote && (
                    <div className="space-y-3">
                        {filteredNotes.length === 0 ? (
                            <div className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <StickyNote className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>暂无笔记</p>
                                <p className="text-sm mt-1">点击上方按钮添加你的第一条笔记</p>
                            </div>
                        ) : (
                            filteredNotes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    isDarkMode={isDarkMode}
                                    onEdit={() => setEditingNote(note)}
                                    onDelete={() => deleteNote(note.id)}
                                    onCopy={() => copyContent(note)}
                                    copied={copiedId === note.id}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Notes List - All View */}
                {activeTab === 'all' && !isCreating && !editingNote && (
                    <div className="space-y-4">
                        {Object.entries(notesByModule).length === 0 ? (
                            <div className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>暂无笔记</p>
                            </div>
                        ) : (
                            Object.entries(notesByModule).map(([moduleId, notes]) => (
                                <div key={moduleId}>
                                    <button
                                        onClick={() => toggleModuleExpand(moduleId)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {expandedModules.has(moduleId) ? (
                                                <ChevronDown className="w-4 h-4" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4" />
                                            )}
                                            <span className="font-medium">{moduleNames[moduleId] || moduleId}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                                                {notes.length}
                                            </span>
                                        </div>
                                    </button>
                                    {expandedModules.has(moduleId) && (
                                        <div className="mt-2 ml-6 space-y-2">
                                            {notes.map(note => (
                                                <NoteCard
                                                    key={note.id}
                                                    note={note}
                                                    isDarkMode={isDarkMode}
                                                    onEdit={() => setEditingNote(note)}
                                                    onDelete={() => deleteNote(note.id)}
                                                    onCopy={() => copyContent(note)}
                                                    copied={copiedId === note.id}
                                                    compact
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Notes List - Search View */}
                {activeTab === 'search' && !isCreating && !editingNote && (
                    <div className="space-y-3">
                        {searchQuery && filteredNotes.length === 0 ? (
                            <div className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>未找到匹配的笔记</p>
                            </div>
                        ) : !searchQuery ? (
                            <div className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>输入关键词搜索笔记</p>
                            </div>
                        ) : (
                            filteredNotes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    isDarkMode={isDarkMode}
                                    onEdit={() => setEditingNote(note)}
                                    onDelete={() => deleteNote(note.id)}
                                    onCopy={() => copyContent(note)}
                                    copied={copiedId === note.id}
                                    showModule
                                    moduleNames={moduleNames}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className={`p-4 border-t text-sm ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
                <div className="flex items-center justify-between">
                    <span>共 {notesData.notes.length} 条笔记</span>
                    {notesData.lastExport && (
                        <span>上次导出: {new Date(notesData.lastExport).toLocaleDateString('zh-CN')}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Note Editor Component
interface NoteEditorProps {
    note: Note;
    isDarkMode: boolean;
    onSave: (note: Note) => void;
    onCancel: () => void;
    moduleNames: Record<string, string>;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, isDarkMode, onSave, onCancel, moduleNames }) => {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [moduleId, setModuleId] = useState(note.moduleId);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>(note.tags);

    const handleSave = () => {
        if (!title.trim() && !content.trim()) {
            alert('请输入标题或内容');
            return;
        }
        onSave({
            ...note,
            title: title.trim() || '无标题',
            content: content.trim(),
            moduleId,
            tags,
            updatedAt: Date.now(),
        });
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    return (
        <div className={`p-4 rounded-xl border mb-4 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <input
                type="text"
                placeholder="笔记标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border mb-3 font-medium ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            />

            <textarea
                placeholder="写下你的笔记..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className={`w-full px-3 py-2 rounded-lg border mb-3 resize-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
                <select
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    className={`px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                >
                    {Object.entries(moduleNames).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="添加标签"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className={`flex-1 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    />
                    <button
                        onClick={addTag}
                        className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map(tag => (
                        <span
                            key={tag}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
                        >
                            <Tag className="w-3 h-3" />
                            {tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    保存
                </button>
                <button
                    onClick={onCancel}
                    className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                    取消
                </button>
            </div>
        </div>
    );
};

// Note Card Component
interface NoteCardProps {
    note: Note;
    isDarkMode: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onCopy: () => void;
    copied: boolean;
    compact?: boolean;
    showModule?: boolean;
    moduleNames?: Record<string, string>;
}

const NoteCard: React.FC<NoteCardProps> = ({
    note, isDarkMode, onEdit, onDelete, onCopy, copied, compact, showModule, moduleNames
}) => (
    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'} transition-colors`}>
        <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {note.title || '无标题'}
                </h4>
                {showModule && moduleNames && (
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        {moduleNames[note.moduleId] || note.moduleId}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={onCopy}
                    className={`p-1.5 rounded ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                    title="复制"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                    onClick={onEdit}
                    className={`p-1.5 rounded ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                    title="编辑"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    className={`p-1.5 rounded hover:text-red-500 ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                    title="删除"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>

        {!compact && note.content && (
            <p className={`mt-2 text-sm line-clamp-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {note.content}
            </p>
        )}

        <div className="flex items-center justify-between mt-2">
            {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map(tag => (
                        <span
                            key={tag}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
                        >
                            {tag}
                        </span>
                    ))}
                    {note.tags.length > 3 && (
                        <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            +{note.tags.length - 3}
                        </span>
                    )}
                </div>
            )}
            <div className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                <Calendar className="w-3 h-3" />
                {new Date(note.updatedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
            </div>
        </div>
    </div>
);

export default Notes;
